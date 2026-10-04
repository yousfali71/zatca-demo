'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  Code2,
  QrCode,
  RefreshCw,
  Copy,
  Terminal,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Lock,
  Building2,
  KeyRound,
  FileCheck2,
  Sparkles
} from 'lucide-react';
import { generateZatcaUblXml } from '../utils/zatcaCrypto';
import { MOCK_INVOICES } from '../mock/zatcaData';
import { apiClient, ZatcaUnitDto, ZatcaStatusDto } from '../services/apiClient';
import { PremiumOtpInput } from './PremiumOtpInput';

export const ZatcaOnboardingPortal: React.FC = () => {
  const { businessProfile, updateBusinessProfile, zatca, setZatcaActivation, isZatcaActivated, hasPermission, isOwner } = useAuth();
  
  // Navigation & Sub-views
  const [activeTab, setActiveTab] = useState<'stepper' | 'status' | 'xml' | 'qr'>('stepper');
  const [targetEnv, setTargetEnv] = useState<'sandbox' | 'simulation' | 'production'>('sandbox');
  
  // Step State (1 to 5)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [unitId, setUnitId] = useState<string>(zatca.unitId || '');
  const [unitName, setUnitName] = useState<string>('الفرع الرئيسي - الرياض');
  
  // Step 2 Inputs
  const [vatNumber, setVatNumber] = useState<string>(businessProfile.vatNumber || '399999999900003');
  const [organizationName, setOrganizationName] = useState<string>(businessProfile.companyNameAr || 'مؤسسة السرعة القصوى للتقنية');
  const [branchName, setBranchName] = useState<string>('الفرع الرئيسي');
  const [invoiceType, setInvoiceType] = useState<string>('1100');
  const [industry, setIndustry] = useState<string>('Supply activities');
  const [address, setAddress] = useState<string>('RRRD2929');
  
  // Step 3 OTP Input
  const [otp, setOtp] = useState<string>('123345');
  
  // Terminal drawer & status
  const [showTerminal, setShowTerminal] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([
    '[ZATCA Engine] Initialized in Sandbox mode (API v2).'
  ]);
  const [loadingStep, setLoadingStep] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Backend Live Stats
  const [backendStats, setBackendStats] = useState<ZatcaStatusDto | null>(null);
  const [unitStatusDto, setUnitStatusDto] = useState<ZatcaUnitDto | null>(null);
  const [isRenewingCsid, setIsRenewingCsid] = useState(false);
  const [copiedXml, setCopiedXml] = useState(false);

  const canOnboard = hasPermission('zatca:onboard') || isOwner;

  useEffect(() => {
    let isMounted = true;
    apiClient.getZatcaStatus()
      .then((res) => { if (isMounted && res) setBackendStats(res); })
      .catch(() => { /* fallback */ });

    if (zatca.unitId) {
      apiClient.getZatcaUnitStatus(zatca.unitId)
        .then((res) => {
          if (isMounted && res) {
            setUnitStatusDto(res);
            if (res.status === 'CONNECTED') setCurrentStep(5);
            else if (res.status === 'COMPLIANCE') setCurrentStep(4);
          }
        })
        .catch(() => { /* fallback */ });
    }
    return () => { isMounted = false; };
  }, [zatca.unitId]);

  const handleEnvChange = (env: 'sandbox' | 'simulation' | 'production') => {
    setTargetEnv(env);
    if (env === 'sandbox') setOtp('123345');
    else setOtp('');
    appendLog(`Target environment set to: ${env.toUpperCase()}`);
  };

  const appendLog = (msg: string) => {
    const time = new Date().toLocaleTimeString('ar-SA');
    setLogs((prev) => [`[${time}] ${msg}`, ...prev]);
  };

  const handleResetWizard = () => {
    setCurrentStep(1);
    setErrorMsg(null);
    setUnitId('');
    setZatcaActivation({ unitId: null, status: 'NOT_CONNECTED' });
    appendLog('Wizard reset to Step 1.');
  };

  const formatError = (err: any) => {
    if (err?.status === 403 || err?.message?.includes('403') || err?.message?.includes('zatca:onboard')) {
      return 'خطأ صلاحيات (403): حسابك لا يملك صلاحية [zatca:onboard]. يرجى تسجيل الدخول كـ Owner/Admin.';
    }
    return err?.message || 'تعذر إكمال الطلب، يرجى إعادة المحاولة.';
  };

  // STEP 1: Create Unit
  const handleStep1CreateUnit = async () => {
    setLoadingStep(true);
    setErrorMsg(null);
    try {
      appendLog(`Creating Unit "${unitName}" (${targetEnv})...`);
      const res = await apiClient.createZatcaUnit({ name: unitName, environment: targetEnv });
      setUnitId(res.id);
      setZatcaActivation({ unitId: res.id, status: res.status });
      appendLog(`Unit created! ID: ${res.id}`);
      setCurrentStep(2);
    } catch (err: any) {
      const msg = formatError(err);
      setErrorMsg(msg);
      appendLog(`[Step 1 Error] ${msg}`);
    } finally {
      setLoadingStep(false);
    }
  };

  // STEP 2: CSR
  const handleStep2GenerateCsr = async () => {
    if (!unitId) return setErrorMsg('يرجى إنشاء الوحدة أولاً');
    setLoadingStep(true);
    setErrorMsg(null);
    try {
      appendLog(`Generating secp256k1 CSR for Unit ${unitId}...`);
      await apiClient.generateZatcaCsr(unitId, {
        vatNumber,
        invoiceType,
        branchName,
        organizationName,
        commonName: `TST-${vatNumber}`,
        address,
        industry
      });
      appendLog('CSR and Private Key generated successfully.');
      setCurrentStep(3);
    } catch (err: any) {
      const msg = formatError(err);
      setErrorMsg(msg);
      appendLog(`[Step 2 Error] ${msg}`);
    } finally {
      setLoadingStep(false);
    }
  };

  // STEP 3: Compliance CSID
  const handleStep3ComplianceCsid = async () => {
    if (!unitId) return setErrorMsg('معرف الوحدة مفقود');
    if (!otp) return setErrorMsg('يرجى أدخال رمز OTP المكون من 6 أرقام');
    setLoadingStep(true);
    setErrorMsg(null);
    try {
      appendLog(`Exchanging OTP (${otp}) for Compliance CSID...`);
      await apiClient.requestZatcaCompliance(unitId, otp);
      setZatcaActivation({ unitId, status: 'COMPLIANCE' });
      appendLog('Compliance CSID acquired successfully.');
      setCurrentStep(4);
    } catch (err: any) {
      const msg = formatError(err);
      setErrorMsg(msg);
      appendLog(`[Step 3 Error] ${msg}`);
    } finally {
      setLoadingStep(false);
    }
  };

  // STEP 4: Compliance Check
  const handleStep4ComplianceCheck = async () => {
    if (!unitId) return setErrorMsg('معرف الوحدة مفقود');
    setLoadingStep(true);
    setErrorMsg(null);
    try {
      appendLog('Dispatching compliance test invoices to ZATCA validator...');
      await apiClient.runZatcaComplianceCheck(unitId);
      appendLog('Compliance test checks passed cleanly.');
      setCurrentStep(5);
    } catch (err: any) {
      const msg = formatError(err);
      setErrorMsg(msg);
      appendLog(`[Step 4 Error] ${msg}`);
    } finally {
      setLoadingStep(false);
    }
  };

  // STEP 5: Production CSID
  const handleStep5ProductionCsid = async () => {
    if (!unitId) return setErrorMsg('معرف الوحدة مفقود');
    setLoadingStep(true);
    setErrorMsg(null);
    try {
      appendLog('Acquiring Production CSID...');
      await apiClient.requestZatcaProduction(unitId);
      setZatcaActivation({ unitId, status: 'CONNECTED' });
      updateBusinessProfile({ csidStatus: 'ACTIVE', lastZatcaSync: 'الآن' });
      appendLog('Production CSID granted! Unit status is CONNECTED.');
    } catch (err: any) {
      const msg = formatError(err);
      setErrorMsg(msg);
      appendLog(`[Step 5 Error] ${msg}`);
    } finally {
      setLoadingStep(false);
    }
  };

  // Renew Certificate
  const handleRenewCsid = async () => {
    if (!unitId) return;
    setIsRenewingCsid(true);
    try {
      appendLog(`Renewing certificate for Unit ${unitId}...`);
      await apiClient.renewZatcaUnit(unitId);
      appendLog('Certificate renewed successfully.');
      updateBusinessProfile({ csidStatus: 'ACTIVE', lastZatcaSync: 'الآن' });
    } catch (err: any) {
      appendLog(`Renewal error: ${formatError(err)}`);
    } finally {
      setIsRenewingCsid(false);
    }
  };

  const sampleXml = generateZatcaUblXml({
    invoiceNumber: MOCK_INVOICES[0].invoiceNumber,
    uuid: MOCK_INVOICES[0].uuid,
    issueDate: MOCK_INVOICES[0].issueDate,
    issueTime: MOCK_INVOICES[0].issueTime,
    invoiceType: 'STANDARD',
    sellerName: businessProfile.companyNameAr,
    sellerVat: businessProfile.vatNumber,
    buyerName: MOCK_INVOICES[0].customerName,
    buyerVat: MOCK_INVOICES[0].customerVatNumber,
    subtotal: MOCK_INVOICES[0].subtotalExclVat,
    vatAmount: MOCK_INVOICES[0].totalVatAmount,
    grandTotal: MOCK_INVOICES[0].grandTotal,
    items: MOCK_INVOICES[0].items.map((i) => ({
      name: i.productName,
      qty: i.quantity,
      price: i.unitPrice,
      vat: i.vatAmount,
      total: i.totalWithVat
    }))
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedXml(true);
    setTimeout(() => setCopiedXml(false), 2000);
  };

  const stepsList = [
    { num: 1, title: 'تسجيل الوحدة', desc: 'POST /zatca/units' },
    { num: 2, title: 'إعداد CSR', desc: 'مفاتيح التشفير' },
    { num: 3, title: 'اعتماد Compliance', desc: 'رمز OTP' },
    { num: 4, title: 'فحص الامتثال', desc: 'اختبار الفواتير' },
    { num: 5, title: 'شهادة Production', desc: 'تفعيل لايف' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1120, margin: '0 auto', width: '100%' }} className="fade-up">
      
      {/* 1. Header & Navigation Section */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: 16, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
              الربط مع الفوترة الإلكترونية (ZATCA Phase 2)
            </h1>
            <span style={{
              fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 6,
              backgroundColor: isZatcaActivated ? '#ECFDF5' : '#FEF3C7',
              color: isZatcaActivated ? '#047857' : '#D97706',
              border: `1px solid ${isZatcaActivated ? '#A7F3D0' : '#FDE68A'}`
            }}>
              {isZatcaActivated ? 'مفعل — CONNECTED' : 'غير مكتمل التفعيل'}
            </span>
          </div>
          <p style={{ fontSize: 13, color: '#64748B', margin: '4px 0 0 0' }}>
            تفعيل شهادات CSID، الربط مع منصة فاتورة، وإصدار الفواتير الموقعة لحظياً
          </p>
        </div>

        {/* Minimal Underline Tabs */}
        <div style={{ display: 'flex', gap: 20 }}>
          {[
            { key: 'stepper', label: 'مسار التفعيل' },
            { key: 'status', label: 'حالة الربط والإحصائيات' },
            { key: 'xml', label: 'محلل UBL 2.1 XML' },
            { key: 'qr', label: 'فك ترميز TLV QR' }
          ].map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setActiveTab(t.key as any)}
              style={{
                background: 'none', border: 'none', padding: '8px 0', fontSize: 13, fontWeight: activeTab === t.key ? 800 : 600,
                color: activeTab === t.key ? '#0F172A' : '#64748B', cursor: 'pointer', position: 'relative'
              }}
            >
              {t.label}
              {activeTab === t.key && (
                <span style={{ position: 'absolute', bottom: -17, right: 0, left: 0, height: 2, backgroundColor: '#0F172A', borderRadius: 1 }} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Permission Warning if role lacks zatca:onboard */}
      {!canOnboard && (
        <div style={{ padding: '14px 18px', borderRadius: 8, background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Lock style={{ width: 18, height: 18, flexShrink: 0 }} />
          <span style={{ fontSize: 13, fontWeight: 700 }}>
            تنبيه: يتطلب السيرفر وجود صلاحية <code style={{ fontFamily: 'monospace' }}>zatca:onboard</code>. يرجى تسجيل الدخول بحساب مالك المنشأة (Owner/Admin) لإتمام عملية الربط.
          </span>
        </div>
      )}

      {/* 2. MAIN TAB: STEPPER WIZARD */}
      {activeTab === 'stepper' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Environment Selector Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderRadius: 8, background: '#F8FAFC', border: '1px solid #E2E8F0', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Building2 style={{ width: 18, height: 18, color: '#475569' }} />
              <span style={{ fontSize: 13, fontWeight: 800, color: '#1E293B' }}>البيئة المستهدفة للاتصال (Target Environment):</span>
            </div>
            
            <div style={{ display: 'flex', gap: 8 }}>
              {(['sandbox', 'simulation', 'production'] as const).map((env) => (
                <button
                  key={env}
                  type="button"
                  onClick={() => handleEnvChange(env)}
                  style={{
                    padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 800, cursor: 'pointer',
                    border: targetEnv === env ? '1px solid #0F172A' : '1px solid #CBD5E1',
                    backgroundColor: targetEnv === env ? '#0F172A' : '#FFFFFF',
                    color: targetEnv === env ? '#FFFFFF' : '#475569',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {env === 'sandbox' && 'Sandbox (تطوير)'}
                  {env === 'simulation' && 'Simulation (محاكاة)'}
                  {env === 'production' && 'Production (إنتاج لايف)'}
                </button>
              ))}
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div style={{ padding: '20px 0', borderBottom: '1px solid #F1F5F9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
              {/* Connecting Background Line */}
              <div style={{ position: 'absolute', top: 15, left: '10%', right: '10%', height: 2, backgroundColor: '#E2E8F0', zIndex: 0 }} />

              {stepsList.map((s) => {
                const isPassed = currentStep > s.num || isZatcaActivated;
                const isCurrent = currentStep === s.num && !isZatcaActivated;
                return (
                  <div key={s.num} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, zIndex: 1, position: 'relative', width: 140 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: 13,
                      backgroundColor: isPassed ? '#0F172A' : isCurrent ? '#059669' : '#FFFFFF',
                      color: isPassed || isCurrent ? '#FFFFFF' : '#64748B',
                      border: isPassed ? 'none' : isCurrent ? '2px solid #059669' : '2px solid #CBD5E1',
                      transition: 'all 0.2s ease'
                    }}>
                      {isPassed ? <CheckCircle2 style={{ width: 18, height: 18 }} /> : s.num}
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 12, fontWeight: isCurrent ? 900 : 700, color: isCurrent ? '#0F172A' : '#64748B' }}>
                        {s.title}
                      </div>
                      <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 2 }}>{s.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {errorMsg && (
            <div style={{ padding: '12px 16px', borderRadius: 8, background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>⚠️ {errorMsg}</span>
              <button type="button" onClick={handleResetWizard} style={{ background: 'none', border: 'none', color: '#991B1B', textDecoration: 'underline', cursor: 'pointer', fontSize: 12, fontWeight: 800 }}>
                إعادة المحاولة
              </button>
            </div>
          )}

          {/* STEP 1: CREATE UNIT */}
          {currentStep === 1 && (
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 900, color: '#0F172A', margin: 0 }}>
                  الخطوة 1: إنشاء وحدة ZATCA (POST /zatca/units)
                </h3>
                <p style={{ fontSize: 13, color: '#64748B', margin: '4px 0 0 0' }}>
                  تسجيل الفرع أو الجهاز الكترونياً في قاعدة بيانات النظام وتجهيز بيئة الاتصال.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 800, color: '#334155', display: 'block', marginBottom: 6 }}>اسم الوحدة أو الفرع:</label>
                  <input
                    type="text"
                    value={unitName}
                    onChange={(e) => setUnitName(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13, outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 800, color: '#334155', display: 'block', marginBottom: 6 }}>بيئة الربط المحددة:</label>
                  <input
                    type="text"
                    disabled
                    value={targetEnv.toUpperCase()}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 6, border: '1px solid #CBD5E1', background: '#F8FAFC', fontSize: 13, fontWeight: 800, color: '#475569' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                <button
                  type="button"
                  disabled={loadingStep}
                  onClick={handleStep1CreateUnit}
                  style={{
                    padding: '10px 20px', borderRadius: 6, backgroundColor: '#0F172A', color: '#FFFFFF',
                    fontWeight: 800, fontSize: 13, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8
                  }}
                >
                  <span>{loadingStep ? 'جاري الإنشاء...' : 'إنشاء الوحدة والانتقال للخطوة 2'}</span>
                  <ArrowRight style={{ width: 16, height: 16 }} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: CSR */}
          {currentStep === 2 && (
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 900, color: '#0F172A', margin: 0 }}>
                  الخطوة 2: توليد مفاتيح التشفير وطلب CSR (POST /zatca/units/id/csr)
                </h3>
                <p style={{ fontSize: 13, color: '#64748B', margin: '4px 0 0 0' }}>
                  توليد مفتاح التوقيع الرقمي secp256k1 وتجهيز مواصفات الشهادة.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 800, color: '#334155', display: 'block', marginBottom: 6 }}>الرقم الضريبي (15 رقم):</label>
                  <input type="text" value={vatNumber} onChange={(e) => setVatNumber(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13 }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 800, color: '#334155', display: 'block', marginBottom: 6 }}>اسم المنشأة المسجلة:</label>
                  <input type="text" value={organizationName} onChange={(e) => setOrganizationName(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13 }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 800, color: '#334155', display: 'block', marginBottom: 6 }}>نوع الفواتير المدعوم:</label>
                  <select value={invoiceType} onChange={(e) => setInvoiceType(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13 }}>
                    <option value="1100">1100 — قياسية ومبسطة معاً (Standard + Simplified)</option>
                    <option value="1000">1000 — قياسية فقط (B2B)</option>
                    <option value="0100">0100 — مبسطة فقط (B2C)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 800, color: '#334155', display: 'block', marginBottom: 6 }}>اسم الفرع:</label>
                  <input type="text" value={branchName} onChange={(e) => setBranchName(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 13 }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                <button type="button" onClick={() => setCurrentStep(1)} style={{ background: 'none', border: 'none', color: '#64748B', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>الرجوع للخطوة 1</button>
                <button type="button" disabled={loadingStep} onClick={handleStep2GenerateCsr} style={{ padding: '10px 20px', borderRadius: 6, backgroundColor: '#0F172A', color: '#FFFFFF', fontWeight: 800, fontSize: 13, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>{loadingStep ? 'جاري التوليد...' : 'توليد مفاتيح CSR والتقدم للخطوة 3'}</span>
                  <ArrowRight style={{ width: 16, height: 16 }} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: OTP INTEGRATION WITH FATOORA LINK */}
          {currentStep === 3 && (
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 900, color: '#0F172A', margin: 0 }}>
                  الخطوة 3: طلب شهادة الامتثال Compliance CSID (POST /zatca/units/id/compliance)
                </h3>
                <p style={{ fontSize: 13, color: '#64748B', margin: '4px 0 0 0' }}>
                  إرسال الـ CSR متبوعاً برمز OTP المستخرج من بوابة الفوترة التابعة للهيئة.
                </p>
              </div>

              {/* Fatoora Portal Callout Card */}
              <div style={{ padding: '16px 20px', borderRadius: 8, background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A' }}>
                    كيف تحصل على رمز OTP؟
                  </div>
                  <p style={{ fontSize: 12, color: '#64748B', margin: '3px 0 0 0' }}>
                    سجل الدخول لبوابة Fatoora الرسمية ← اختر (Onboard New Solution Unit) ← انسخ رمز OTP (صالح لمدة ساعة واحدة).
                  </p>
                </div>
                <a
                  href="https://fatoora.zatca.gov.sa/"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    padding: '8px 16px', borderRadius: 6, border: '1px solid #0F172A', backgroundColor: '#FFFFFF',
                    color: '#0F172A', fontWeight: 800, fontSize: 12, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6
                  }}
                >
                  <span>فتح بوابة فاتورة (Fatoora Portal)</span>
                  <ExternalLink style={{ width: 14, height: 14 }} />
                </a>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 800, color: '#334155', display: 'block', marginBottom: 10 }}>
                  رمز OTP المؤقت (6 أرقام):
                </label>
                <PremiumOtpInput
                  length={6}
                  value={otp}
                  onChange={(val) => setOtp(val)}
                  disabled={loadingStep}
                />
                {targetEnv === 'sandbox' && (
                  <span style={{ fontSize: 11, color: '#059669', fontWeight: 800, marginTop: 8, display: 'block' }}>
                    ✓ تم تعبئة 123345 تلقائياً (الرمز الافتراضي لبيئة Sandbox)
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                <button type="button" onClick={() => setCurrentStep(2)} style={{ background: 'none', border: 'none', color: '#64748B', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>الرجوع للخطوة 2</button>
                <button type="button" disabled={loadingStep} onClick={handleStep3ComplianceCsid} style={{ padding: '10px 20px', borderRadius: 6, backgroundColor: '#0F172A', color: '#FFFFFF', fontWeight: 800, fontSize: 13, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>{loadingStep ? 'جاري التحقق...' : 'إرسال OTP وجلب Compliance CSID'}</span>
                  <ArrowRight style={{ width: 16, height: 16 }} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: COMPLIANCE CHECK */}
          {currentStep === 4 && (
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 900, color: '#0F172A', margin: 0 }}>
                  الخطوة 4: فحص الامتثال الآلي (POST /zatca/units/id/compliance-check)
                </h3>
                <p style={{ fontSize: 13, color: '#64748B', margin: '4px 0 0 0' }}>
                  إرسال مجموعة من الفواتير الاختبارية الموقعة للتحقق من التوافق الكامل مع معايير ZATCA UBL 2.1.
                </p>
              </div>

              <div style={{ padding: '14px 18px', borderRadius: 6, background: '#F8FAFC', border: '1px solid #E2E8F0', fontSize: 13, color: '#334155' }}>
                الوحدة الحالية في حالة: <strong style={{ color: '#D97706' }}>COMPLIANCE</strong>. اضغط على الزر أدناه لبدء فحص الدفعات الاختبارية تلقائياً.
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                <button type="button" onClick={() => setCurrentStep(3)} style={{ background: 'none', border: 'none', color: '#64748B', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>الرجوع للخطوة 3</button>
                <button type="button" disabled={loadingStep} onClick={handleStep4ComplianceCheck} style={{ padding: '10px 20px', borderRadius: 6, backgroundColor: '#0F172A', color: '#FFFFFF', fontWeight: 800, fontSize: 13, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>{loadingStep ? 'جاري الفحص...' : 'تشغيل فحص الامتثال الآلي'}</span>
                  <ArrowRight style={{ width: 16, height: 16 }} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: PRODUCTION CSID */}
          {currentStep === 5 && (
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 900, color: '#0F172A', margin: 0 }}>
                  الخطوة 5: تفعيل شهادة الإنتاج Production CSID (POST /zatca/units/id/production)
                </h3>
                <p style={{ fontSize: 13, color: '#64748B', margin: '4px 0 0 0' }}>
                  إصدار وتثبيت شهادة CSID الإنتاجية الدائمة لتصديق الفواتير في النظام.
                </p>
              </div>

              {isZatcaActivated ? (
                <div style={{ padding: '18px 20px', borderRadius: 8, background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', fontSize: 13, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <CheckCircle2 style={{ width: 22, height: 22, color: '#059669' }} />
                  <span>الوحدة مُفعّلة بنجاح بحالة CONNECTED. يمكنك الآن إصدار وتصديق الفواتير في realtime!</span>
                </div>
              ) : (
                <button type="button" disabled={loadingStep} onClick={handleStep5ProductionCsid} style={{ padding: '12px 24px', borderRadius: 6, backgroundColor: '#059669', color: '#FFFFFF', fontWeight: 900, fontSize: 13, border: 'none', cursor: 'pointer', width: 'fit-content', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>{loadingStep ? 'جاري التفعيل...' : 'تفعيل شهادة الإنتاج Production CSID'}</span>
                  <ShieldCheck style={{ width: 18, height: 18 }} />
                </button>
              )}
            </div>
          )}

          {/* Collapsible Live Trace Terminal Drawer */}
          <div style={{ border: '1px solid #E2E8F0', borderRadius: 8, background: '#0F172A', color: '#E2E8F0', overflow: 'hidden' }}>
            <button
              type="button"
              onClick={() => setShowTerminal(!showTerminal)}
              style={{
                width: '100%', padding: '12px 18px', background: 'none', border: 'none', color: '#94A3B8',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: 12, fontFamily: 'monospace'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: '#F59E0B' }}>
                <Terminal style={{ width: 16, height: 16 }} />
                عرض سجل الاتصال المباشر (ZATCA API Live Output Trace)
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>{logs.length} سجلات</span>
                {showTerminal ? <ChevronUp style={{ width: 16, height: 16 }} /> : <ChevronDown style={{ width: 16, height: 16 }} />}
              </div>
            </button>

            {showTerminal && (
              <div style={{ padding: 18, borderTop: '1px solid #1E293B', fontFamily: 'monospace', fontSize: 12, color: '#6EE7B7', maxHeight: 220, overflow: 'auto' }}>
                <pre style={{ margin: 0, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{logs.join('\n')}</pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. TAB: STATUS & STATS */}
      {activeTab === 'status' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#64748B' }}>حالة CSID الحالية:</span>
            <div style={{ fontSize: 20, fontWeight: 900, color: isZatcaActivated ? '#059669' : '#D97706' }}>
              {unitStatusDto?.status || (isZatcaActivated ? 'CONNECTED (نشطة)' : 'NOT_CONNECTED')}
            </div>
            <p style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'monospace', margin: 0 }}>
              {unitId ? `Unit ID: ${unitId}` : 'لم تسجل وحدة بعد'}
            </p>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#64748B' }}>إحصائيات الإرسال:</span>
            <div style={{ display: 'flex', gap: 16, fontSize: 13, fontWeight: 800 }}>
              <span style={{ color: '#059669' }}>Cleared: {backendStats?.invoicesSummary?.CLEARED || 0}</span>
              <span style={{ color: '#0284C7' }}>Reported: {backendStats?.invoicesSummary?.REPORTED || 0}</span>
              <span style={{ color: '#DC2626' }}>Failed: {backendStats?.invoicesSummary?.FAILED || 0}</span>
            </div>
            <p style={{ fontSize: 11, color: '#94A3B8', margin: 0 }}>البيئة: {backendStats?.environment || targetEnv}</p>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#64748B' }}>تجديد ترخيص CSID:</span>
            <button
              type="button"
              disabled={isRenewingCsid || !unitId}
              onClick={handleRenewCsid}
              style={{ padding: '8px 16px', borderRadius: 6, backgroundColor: '#0F172A', color: '#FFFFFF', fontWeight: 800, fontSize: 12, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
            >
              <RefreshCw style={{ width: 14, height: 14, animation: isRenewingCsid ? 'spin 1s linear infinite' : 'none' }} />
              <span>{isRenewingCsid ? 'جاري الاتصال...' : 'تجديد الشهادة الآن'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. TAB: UBL 2.1 XML VIEWER */}
      {activeTab === 'xml' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', margin: 0 }}>معاينة بنية ملف XML (UBL 2.1 Standard)</h3>
            <button type="button" onClick={() => copyToClipboard(sampleXml)} style={{ background: 'none', border: '1px solid #CBD5E1', padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Copy style={{ width: 14, height: 14 }} />
              <span>{copiedXml ? 'تم النسخ!' : 'نسخ كـ XML'}</span>
            </button>
          </div>
          <div style={{ background: '#0F172A', color: '#6EE7B7', padding: 20, borderRadius: 8, fontFamily: 'monospace', fontSize: 12, maxHeight: 450, overflow: 'auto' }}>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{sampleXml}</pre>
          </div>
        </div>
      )}

      {/* 5. TAB: TLV QR DECODER */}
      {activeTab === 'qr' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 900, color: '#0F172A', margin: 0 }}>محتويات Tag-Length-Value (TLV) لـ ZATCA QR Code</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div style={{ padding: 16, borderRadius: 6, background: '#F8FAFC', border: '1px solid #E2E8F0', fontFamily: 'monospace', fontSize: 11, wordBreak: 'break-all' }}>
              <span style={{ fontWeight: 800, color: '#0F172A', display: 'block', marginBottom: 6 }}>Base64 Encoded TLV String:</span>
              {MOCK_INVOICES[0].zatcaQrCodeBase64}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
              <div style={{ padding: '8px 12px', borderRadius: 6, background: '#F1F5F9', display: 'flex', justifyContent: 'space-between', fontWeight: 800 }}>
                <span>Tag 1 (اسم المنشأة):</span>
                <span>{businessProfile.companyNameAr}</span>
              </div>
              <div style={{ padding: '8px 12px', borderRadius: 6, background: '#F8FAFC', display: 'flex', justifyContent: 'space-between' }}>
                <span>Tag 2 (الرقم الضريبي):</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{businessProfile.vatNumber}</span>
              </div>
              <div style={{ padding: '8px 12px', borderRadius: 6, background: '#F8FAFC', display: 'flex', justifyContent: 'space-between' }}>
                <span>Tag 3 (تاريخ ووقت الفاتورة):</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>2026-09-29T14:15:00Z</span>
              </div>
              <div style={{ padding: '8px 12px', borderRadius: 6, background: '#F8FAFC', display: 'flex', justifyContent: 'space-between' }}>
                <span>Tag 4 (إجمالي الفاتورة مع الضريبة):</span>
                <span style={{ fontWeight: 800, color: '#059669' }}>5,635.00 ر.س</span>
              </div>
              <div style={{ padding: '8px 12px', borderRadius: 6, background: '#F8FAFC', display: 'flex', justifyContent: 'space-between' }}>
                <span>Tag 5 (مبلغ ضريبة القيمة المضافة 15%):</span>
                <span style={{ fontWeight: 800, color: '#D97706' }}>735.00 ر.س</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
