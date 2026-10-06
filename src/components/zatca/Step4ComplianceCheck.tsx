'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

interface Step4ComplianceCheckProps {
  loadingStep: boolean;
  onBack: () => void;
  onNext: () => void;
}

export const Step4ComplianceCheck: React.FC<Step4ComplianceCheckProps> = ({
  loadingStep,
  onBack,
  onNext
}) => {
  return (
    <div style={{ padding: '32px 0', display: 'flex', flexDirection: 'column', gap: 32, alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
          الخطوة 4: فحص الامتثال الآلي
        </h3>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '8px 0 0 0', maxWidth: 500, lineHeight: 1.6 }}>
          إرسال مجموعة من الفواتير الاختبارية الموقعة للتحقق من التوافق الكامل مع معايير ZATCA UBL 2.1.
        </p>
      </div>

      <div style={{ padding: '20px 24px', borderRadius: 12, background: '#F8FAFC', border: '1px solid #E2E8F0', fontSize: 14, color: '#334155', textAlign: 'center', width: '100%', maxWidth: 500 }}>
        الوحدة الحالية في حالة: <strong style={{ color: '#D97706' }}>COMPLIANCE</strong>.<br/>
        اضغط على الزر أدناه لبدء فحص الدفعات الاختبارية تلقائياً.
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginTop: 10, width: '100%', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button type="button" onClick={onBack} style={{ padding: '14px 32px', borderRadius: 12, backgroundColor: '#F1F5F9', color: '#475569', fontWeight: 800, fontSize: 14, border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}>
          تراجع
        </button>
        <button type="button" disabled={loadingStep} onClick={onNext} style={{ padding: '14px 32px', borderRadius: 12, backgroundColor: 'var(--g-600)', color: '#FFFFFF', fontWeight: 800, fontSize: 15, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.2)' }}>
          <span>{loadingStep ? 'جاري الفحص...' : 'تشغيل فحص الامتثال الآلي'}</span>
          <ArrowRight style={{ width: 20, height: 20 }} />
        </button>
      </div>
    </div>
  );
};
