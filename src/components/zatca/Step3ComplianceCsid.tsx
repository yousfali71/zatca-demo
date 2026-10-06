'use client';

import React from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { PremiumOtpInput } from '../PremiumOtpInput';

interface Step3ComplianceCsidProps {
  otp: string;
  setOtp: (v: string) => void;
  targetEnv: string;
  loadingStep: boolean;
  onBack: () => void;
  onNext: () => void;
}

export const Step3ComplianceCsid: React.FC<Step3ComplianceCsidProps> = ({
  otp,
  setOtp,
  targetEnv,
  loadingStep,
  onBack,
  onNext
}) => {
  return (
    <div style={{ padding: '32px 0', display: 'flex', flexDirection: 'column', gap: 32, alignItems: 'center', textAlign: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
            إدخال رمز التفعيل (OTP)
          </h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '8px 0 0 0', maxWidth: 400, lineHeight: 1.6 }}>
            الرجاء إدخال الرمز المكون من 6 أرقام للتحقق.
            للحصول على الرمز، تفضل بزيارة{' '}
            <a href="https://fatoora.zatca.gov.sa/" target="_blank" rel="noreferrer" style={{ color: 'var(--g-600)', fontWeight: 800, textDecoration: 'underline' }}>
              بوابة فاتورة
            </a>
            {' '}واختر Onboard New Solution Unit.
          </p>
        </div>
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

      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginTop: 24, width: '100%', maxWidth: 400 }}>
        <button type="button" disabled={loadingStep} onClick={onBack} style={{ flex: 1, padding: '14px 20px', borderRadius: 12, backgroundColor: '#F1F5F9', color: '#475569', fontWeight: 800, fontSize: 14, border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}>
          تراجع
        </button>
        <button type="button" disabled={loadingStep} onClick={onNext} style={{ flex: 2, padding: '14px 20px', borderRadius: 12, backgroundColor: 'var(--g-600)', color: '#FFFFFF', fontWeight: 800, fontSize: 14, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.2)' }}>
          <span>{loadingStep ? 'جاري التحقق...' : 'تأكيد الرمز'}</span>
          <ArrowRight style={{ width: 18, height: 18 }} />
        </button>
      </div>
    </div>
  );
};
