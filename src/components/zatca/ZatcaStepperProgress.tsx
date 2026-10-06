'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ZatcaStepperProgressProps {
  currentStep: number;
  isZatcaActivated: boolean;
  stepsList: { num: number; title: string; desc: string }[];
}

export const ZatcaStepperProgress: React.FC<ZatcaStepperProgressProps> = ({
  currentStep,
  isZatcaActivated,
  stepsList
}) => {
  return (
    <div style={{ padding: '20px 0', borderBottom: '1px solid #F1F5F9' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
        {/* Connecting Line */}
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
  );
};
