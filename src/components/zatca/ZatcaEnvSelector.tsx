'use client';

import React from 'react';
import { Building2 } from 'lucide-react';

interface ZatcaEnvSelectorProps {
  targetEnv: 'sandbox' | 'simulation' | 'production';
  onEnvChange: (env: 'sandbox' | 'simulation' | 'production') => void;
}

export const ZatcaEnvSelector: React.FC<ZatcaEnvSelectorProps> = ({ targetEnv, onEnvChange }) => {
  return (
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
            onClick={() => onEnvChange(env)}
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
  );
};
