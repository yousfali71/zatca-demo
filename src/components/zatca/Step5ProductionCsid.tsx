'use client';

import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

interface Step5ProductionCsidProps {
  isZatcaActivated: boolean;
  loadingStep: boolean;
  onActivate: () => void;
}

export const Step5ProductionCsid: React.FC<Step5ProductionCsidProps> = ({
  isZatcaActivated,
  loadingStep,
  onActivate
}) => {
  return (
    <div style={{ padding: '32px 0', display: 'flex', flexDirection: 'column', gap: 32, alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
          الخطوة 5: تفعيل شهادة الإنتاج (Production CSID)
        </h3>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '8px 0 0 0', maxWidth: 500, lineHeight: 1.6 }}>
          إصدار وتثبيت شهادة CSID الإنتاجية الدائمة لتصديق الفواتير في النظام بنجاح.
        </p>
      </div>

      {isZatcaActivated ? (
        <div style={{ padding: '24px 32px', borderRadius: 16, background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', fontSize: 15, fontWeight: 800, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.1)' }}>
          <CheckCircle2 style={{ width: 48, height: 48, color: '#059669' }} />
          <span>تم تفعيل الوحدة بنجاح بحالة <strong style={{ color: '#047857' }}>CONNECTED</strong>.<br/>يمكنك الآن إصدار وتصديق الفواتير بشكل فعلي وربطها مع هيئة الزكاة!</span>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginTop: 10, width: '100%', justifyContent: 'center' }}>
          <button type="button" disabled={loadingStep} onClick={onActivate} style={{ padding: '16px 32px', borderRadius: 12, backgroundColor: 'var(--g-600)', color: '#FFFFFF', fontWeight: 900, fontSize: 16, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, transition: 'all 0.2s', boxShadow: '0 4px 16px rgba(5, 150, 105, 0.25)' }}>
            <span>{loadingStep ? 'جاري التفعيل...' : 'تفعيل شهادة الإنتاج Production CSID'}</span>
            <ShieldCheck style={{ width: 22, height: 22 }} />
          </button>
        </div>
      )}
    </div>
  );
};
