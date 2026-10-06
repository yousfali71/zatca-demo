'use client';

import React from 'react';
import { CreditCard, TrendingUp, TrendingDown, ShieldCheck } from 'lucide-react';
import { VatReturnDeclaration } from '../../types/zatcaErp';
import { formatSar } from '../../utils/format';

interface KpiCardsSectionProps {
  vatDec: VatReturnDeclaration;
}

export const KpiCardsSection: React.FC<KpiCardsSectionProps> = ({ vatDec }) => {
  return (
    <div className="rg-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
      {/* KPI 1: Total Sales */}
      <div className="kpi-card">
        <div className="kpi-card-menu">···</div>
        <div className="kpi-icon-wrap" style={{ background: 'var(--g-50)' }}>
          <TrendingUp style={{ width: 18, height: 18, color: 'var(--g-600)' }} />
        </div>
        <div className="kpi-label">إجمالي الإيرادات</div>
        <div className="kpi-value" suppressHydrationWarning>{formatSar(vatDec.standardRatedSalesSar)}</div>
        <div className="kpi-sub">ريال</div>
        <div className="kpi-trend-up">▲ 18% مقابل آخر 30 يوماً</div>
      </div>

      {/* KPI 2: Purchases */}
      <div className="kpi-card">
        <div className="kpi-card-menu">···</div>
        <div className="kpi-icon-wrap" style={{ background: '#FFF8E6' }}>
          <TrendingDown style={{ width: 18, height: 18, color: 'var(--gold)' }} />
        </div>
        <div className="kpi-label">إجمالي المشتريات</div>
        <div className="kpi-value" suppressHydrationWarning>{formatSar(vatDec.standardRatedPurchasesSar)}</div>
        <div className="kpi-sub">ريال</div>
        <div className="kpi-trend-down">▼ 7% مقابل آخر 30 يوماً</div>
      </div>

      {/* KPI 3: HERO — Net Tax */}
      <div className="kpi-card hero">
        <div className="kpi-card-menu">···</div>
        <div className="kpi-icon-wrap" style={{ background: 'rgba(255,255,255,0.18)' }}>
          <CreditCard style={{ width: 18, height: 18, color: '#fff' }} />
        </div>
        <div className="kpi-label">صافي الضريبة</div>
        <div className="kpi-value" suppressHydrationWarning>{formatSar(vatDec.netTaxPayableSar)}</div>
        <div className="kpi-sub">ريال</div>
        <div className="kpi-trend-up">▲ 23% مقابل آخر 30 يوماً</div>
      </div>

      {/* KPI 4: Input VAT */}
      <div className="kpi-card">
        <div className="kpi-card-menu">···</div>
        <div className="kpi-icon-wrap" style={{ background: 'var(--g-50)' }}>
          <ShieldCheck style={{ width: 18, height: 18, color: 'var(--g-500)' }} />
        </div>
        <div className="kpi-label">ضريبة المدخلات</div>
        <div className="kpi-value" suppressHydrationWarning>{formatSar(vatDec.totalInputVatSar)}</div>
        <div className="kpi-sub">ريال</div>
        <div className="kpi-trend-up">▲ 11% مقابل آخر 30 يوماً</div>
      </div>
    </div>
  );
};
