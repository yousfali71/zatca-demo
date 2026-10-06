'use client';

import React from 'react';
import { RefreshCw } from 'lucide-react';
import { ZatcaUnitDto, ZatcaStatusDto } from '../../services/apiClient';

interface ZatcaStatusTabProps {
  unitStatusDto: ZatcaUnitDto | null;
  isZatcaActivated: boolean;
  unitId: string;
  backendStats: ZatcaStatusDto | null;
  targetEnv: string;
  isRenewingCsid: boolean;
  onRenewCsid: () => void;
}

export const ZatcaStatusTab: React.FC<ZatcaStatusTabProps> = ({
  unitStatusDto,
  isZatcaActivated,
  unitId,
  backendStats,
  targetEnv,
  isRenewingCsid,
  onRenewCsid
}) => {
  return (
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
          onClick={onRenewCsid}
          style={{ padding: '8px 16px', borderRadius: 6, backgroundColor: '#0F172A', color: '#FFFFFF', fontWeight: 800, fontSize: 12, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
        >
          <RefreshCw style={{ width: 14, height: 14, animation: isRenewingCsid ? 'spin 1s linear infinite' : 'none' }} />
          <span>{isRenewingCsid ? 'جاري الاتصال...' : 'تجديد الشهادة الآن'}</span>
        </button>
      </div>
    </div>
  );
};
