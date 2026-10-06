'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { generateZatcaUblXml } from '../utils/zatcaCrypto';
import { MOCK_INVOICES } from '../mock/zatcaData';
import { apiClient, ZatcaUnitDto, ZatcaStatusDto } from '../services/apiClient';

export function useZatcaOnboarding() {
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

  const appendLog = useCallback((msg: string) => {
    const time = new Date().toLocaleTimeString('ar-SA');
    setLogs((prev) => [`[${time}] ${msg}`, ...prev]);
  }, []);

  const handleEnvChange = useCallback((env: 'sandbox' | 'simulation' | 'production') => {
    setTargetEnv(env);
    if (env === 'sandbox') setOtp('123345');
    else setOtp('');
    appendLog(`Target environment set to: ${env.toUpperCase()}`);
  }, [appendLog]);

  const handleResetWizard = useCallback(() => {
    setCurrentStep(1);
    setErrorMsg(null);
    setUnitId('');
    setZatcaActivation({ unitId: null, status: 'NOT_CONNECTED' });
    appendLog('Wizard reset to Step 1.');
  }, [setZatcaActivation, appendLog]);

  const formatError = useCallback((err: any) => {
    if (err?.status === 403 || err?.message?.includes('403') || err?.message?.includes('zatca:onboard')) {
      return 'خطأ صلاحيات (403): حسابك لا يملك صلاحية [zatca:onboard]. يرجى تسجيل الدخول كـ Owner/Admin.';
    }
    return err?.message || 'تعذر إكمال الطلب، يرجى إعادة المحاولة.';
  }, []);

  // STEP 1: Create Unit
  const handleStep1CreateUnit = useCallback(async () => {
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
  }, [unitName, targetEnv, setZatcaActivation, appendLog, formatError]);

  // STEP 2: CSR
  const handleStep2GenerateCsr = useCallback(async () => {
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
  }, [unitId, vatNumber, invoiceType, branchName, organizationName, address, industry, appendLog, formatError]);

  // STEP 3: Compliance CSID
  const handleStep3ComplianceCsid = useCallback(async () => {
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
  }, [unitId, otp, setZatcaActivation, appendLog, formatError]);

  // STEP 4: Compliance Check
  const handleStep4ComplianceCheck = useCallback(async () => {
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
  }, [unitId, appendLog, formatError]);

  // STEP 5: Production CSID
  const handleStep5ProductionCsid = useCallback(async () => {
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
  }, [unitId, setZatcaActivation, updateBusinessProfile, appendLog, formatError]);

  // Renew Certificate
  const handleRenewCsid = useCallback(async () => {
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
  }, [unitId, updateBusinessProfile, appendLog, formatError]);

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

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedXml(true);
    setTimeout(() => setCopiedXml(false), 2000);
  }, []);

  return {
    businessProfile,
    isZatcaActivated,
    canOnboard,
    activeTab,
    setActiveTab,
    targetEnv,
    handleEnvChange,
    currentStep,
    setCurrentStep,
    unitId,
    unitName,
    setUnitName,
    vatNumber,
    setVatNumber,
    organizationName,
    setOrganizationName,
    branchName,
    setBranchName,
    invoiceType,
    setInvoiceType,
    industry,
    setIndustry,
    address,
    setAddress,
    otp,
    setOtp,
    showTerminal,
    setShowTerminal,
    logs,
    loadingStep,
    errorMsg,
    handleResetWizard,
    backendStats,
    unitStatusDto,
    isRenewingCsid,
    handleRenewCsid,
    sampleXml,
    copiedXml,
    copyToClipboard,
    handleStep1CreateUnit,
    handleStep2GenerateCsr,
    handleStep3ComplianceCsid,
    handleStep4ComplianceCheck,
    handleStep5ProductionCsid
  };
}
