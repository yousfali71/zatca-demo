'use client';

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  Code2,
  QrCode,
  RefreshCw,
  Copy,
  Terminal
} from 'lucide-react';
import { generateZatcaUblXml } from '../utils/zatcaCrypto';
import { MOCK_INVOICES } from '../mock/zatcaData';

export const ZatcaOnboardingPortal: React.FC = () => {
  const { businessProfile, updateBusinessProfile, zatca, isZatcaActivated } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<'csid' | 'xml' | 'qr'>('csid');
  const [isRenewingCsid, setIsRenewingCsid] = useState(false);
  const [copiedXml, setCopiedXml] = useState(false);

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

  const handleRenewCsid = () => {
    setIsRenewingCsid(true);
    setTimeout(() => {
      setIsRenewingCsid(false);
      updateBusinessProfile({
        csidStatus: 'ACTIVE',
        csidProductionKey: 'PCSID-SA-2026-' + Math.floor(100000 + Math.random() * 900000),
        lastZatcaSync: 'الآن'
      });
    }, 1500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedXml(true);
    setTimeout(() => setCopiedXml(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="fade-up">
      {/* Activation banner — ZATCA is a separate phase after account creation */}
      {!isZatcaActivated && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap',
          padding: '14px 18px', borderRadius: 14, background: '#FFF8E1', border: '1px solid #F2D27A'
        }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 900, color: '#8A6100' }}>
              {zatca.status === 'NOT_CONNECTED' ? 'حسابك جاهز — لكن ZATCA غير مُفعّل بعد' : `حالة الربط: ${zatca.status}`}
            </div>
            <p style={{ fontSize: 12, color: '#8A6100', margin: '2px 0 0' }}>
              أكمل تفعيل الفوترة الإلكترونية (الوحدة ← CSR ← Compliance ← Production) لتُرسل فواتيرك إلى هيئة الزكاة والضريبة.
            </p>
          </div>
        </div>
      )}
      {/* Top Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShieldCheck style={{ width: 22, height: 22, color: 'var(--g-600)' }} />
            <span>مركز الربط البرمجي وشهادات ZATCA (Phase 2 Hub)</span>
          </h1>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            توليد مفاتيح التوقيع الرقمي ECDSA secp256k1، فحص ملفات UBL 2.1 XML، واختبار API الاعتماد اللحظي
          </p>
        </div>

        {/* Sub Navigation Pills */}
        <div style={{ display: 'flex', alignItems: 'center', background: '#E2E8F0', padding: 3, borderRadius: 10 }}>
          <button
            type="button"
            onClick={() => setActiveSubTab('csid')}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeSubTab === 'csid' ? 'var(--g-600)' : 'transparent',
              color: activeSubTab === 'csid' ? '#FFF' : 'var(--text-primary)',
              transition: 'all 0.15s ease'
            }}
          >
            شهادة CSID والحالة
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('xml')}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeSubTab === 'xml' ? 'var(--g-600)' : 'transparent',
              color: activeSubTab === 'xml' ? '#FFF' : 'var(--text-primary)',
              transition: 'all 0.15s ease'
            }}
          >
            محلل UBL 2.1 XML
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('qr')}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeSubTab === 'qr' ? 'var(--g-600)' : 'transparent',
              color: activeSubTab === 'qr' ? '#FFF' : 'var(--text-primary)',
              transition: 'all 0.15s ease'
            }}
          >
            فك ترميز TLV QR
          </button>
        </div>
      </div>

      {/* SUB TAB 1: CSID STATUS */}
      {activeSubTab === 'csid' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            <div className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>حالة شهادة الإنتاج CSID</span>
                <span className="live-dot" style={{ width: 10, height: 10 }}></span>
              </div>
              <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--g-600)' }}>
                {businessProfile.csidStatus === 'ACTIVE' ? 'نشطة ومعتمدة ZATCA' : 'معلقة'}
              </div>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace', margin: 0 }}>
                {businessProfile.csidProductionKey}
              </p>
            </div>

            <div className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>منفذ API الاعتماد (Clearance)</span>
              <div style={{ fontSize: 13, fontWeight: 800, fontFamily: 'monospace', color: 'var(--text-primary)', direction: 'ltr', textAlign: 'right' }}>
                POST /invoices/clearance/single
              </div>
              <p style={{ fontSize: 11, color: 'var(--g-600)', fontWeight: 700, margin: 0 }}>
                استجابة السيرفر: 200 OK (0.42 ثانية)
              </p>
            </div>

            <div className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>تجديد الربط والتراخيص</span>
              <button
                type="button"
                disabled={isRenewingCsid}
                onClick={handleRenewCsid}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <RefreshCw style={{ width: 14, height: 14, animation: isRenewingCsid ? 'spin 1s linear infinite' : 'none' }} />
                <span>{isRenewingCsid ? 'جاري الاتصال بـ ZATCA...' : 'تجديد شهادة CSID الآن'}</span>
              </button>
            </div>
          </div>

          <div className="card" style={{ background: '#0F172A', color: '#E2E8F0', padding: 20, fontFamily: 'monospace', fontSize: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1E293B', paddingBottom: 8, color: '#94A3B8' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: 'var(--gold)' }}>
                <Terminal style={{ width: 16, height: 16 }} />
                ZATCA Phase 2 API Handshake Terminal Output
              </span>
              <span>fatoora.zatca.gov.sa</span>
            </div>
            <pre style={{ margin: '12px 0 0 0', lineHeight: 1.6, overflowX: 'auto', color: '#6EE7B7' }}>
{`[ZATCA-CSID Engine] Requesting Compliance CSID via ECDSA keypair...
[ZATCA-CSID Engine] CSR generated with CN=${businessProfile.companyNameEn}, VAT=${businessProfile.vatNumber}
[ZATCA API] POST https://fatoora.zatca.gov.sa/api/v1/compliance
[ZATCA API] HTTP 200 OK - Compliance CSID Granted!
[ZATCA API] Cryptographic Stamp Signature verified (secp256k1).
[STATUS] Ready to clear B2B Invoices & report B2C Invoices in real-time.`}
            </pre>
          </div>
        </div>
      )}

      {/* SUB TAB 2: UBL 2.1 XML VIEWER */}
      {activeSubTab === 'xml' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Code2 style={{ width: 18, height: 18, color: 'var(--g-600)' }} />
              <span>معاينة بنية ملف XML (UBL 2.1 Standard) المعين لـ ZATCA</span>
            </h3>

            <button
              type="button"
              onClick={() => copyToClipboard(sampleXml)}
              className="btn-ghost"
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Copy style={{ width: 14, height: 14 }} />
              <span>{copiedXml ? 'تم النسخ!' : 'نسخ كـ XML'}</span>
            </button>
          </div>

          <div className="card" style={{ background: '#090D16', color: '#6EE7B7', padding: 20, fontFamily: 'monospace', fontSize: 12, maxHeight: 450, overflow: 'auto' }}>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{sampleXml}</pre>
          </div>
        </div>
      )}

      {/* SUB TAB 3: TLV QR DECODER */}
      {activeSubTab === 'qr' && (
        <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
            <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <QrCode style={{ width: 20, height: 20, color: 'var(--g-600)' }} />
              <span>تحليل وقراءة محتويات Tag-Length-Value (TLV) لـ ZATCA QR Code</span>
            </h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              يتكون الرمز من 8 علامات (Tags) تحتوي على اسم المورد، الرقم الضريبي، التوقيع الرقمي، والهاش.
            </p>
          </div>

          <div className="rg-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              <div style={{ padding: 16, borderRadius: 10, background: 'var(--bg)', border: '1px solid var(--border)', fontFamily: 'monospace', fontSize: 11, color: 'var(--text-primary)', wordBreak: 'break-all', lineHeight: 1.6 }}>
                <span style={{ fontWeight: 800, color: 'var(--g-600)', display: 'block', marginBottom: 6 }}>Base64 Encoded TLV String:</span>
                {MOCK_INVOICES[0].zatcaQrCodeBase64}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
              <div style={{ padding: '10px 14px', borderRadius: 8, background: 'var(--g-50)', color: 'var(--g-600)', display: 'flex', justifyContent: 'space-between', fontWeight: 800 }}>
                <span>Tag 1 (اسم المنشأة):</span>
                <span>{businessProfile.companyNameAr}</span>
              </div>
              <div style={{ padding: '10px 14px', borderRadius: 8, background: '#F8FAFC', color: 'var(--text-primary)', display: 'flex', justifyContent: 'space-between' }}>
                <span>Tag 2 (الرقم الضريبي):</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{businessProfile.vatNumber}</span>
              </div>
              <div style={{ padding: '10px 14px', borderRadius: 8, background: '#F8FAFC', color: 'var(--text-primary)', display: 'flex', justifyContent: 'space-between' }}>
                <span>Tag 3 (تاريخ ووقت الفاتورة):</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>2026-09-29T14:15:00Z</span>
              </div>
              <div style={{ padding: '10px 14px', borderRadius: 8, background: '#F8FAFC', color: 'var(--text-primary)', display: 'flex', justifyContent: 'space-between' }}>
                <span>Tag 4 (إجمالي الفاتورة مع الضريبة):</span>
                <span style={{ fontWeight: 800, color: 'var(--g-600)' }}>5,635.00 ر.س</span>
              </div>
              <div style={{ padding: '10px 14px', borderRadius: 8, background: '#F8FAFC', color: 'var(--text-primary)', display: 'flex', justifyContent: 'space-between' }}>
                <span>Tag 5 (مبلغ ضريبة القيمة المضافة 15%):</span>
                <span style={{ fontWeight: 800, color: 'var(--gold)' }}>735.00 ر.س</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
