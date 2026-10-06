'use client';

import React from 'react';
import { TrendingUp } from 'lucide-react';
import { INITIAL_VAT_DECLARATION, MOCK_WAREHOUSES } from '../../mock/zatcaData';
import { formatSar } from '../../utils/format';

export const ReportsKpiCards: React.FC = () => {
  const stockVal = (MOCK_WAREHOUSES[0].totalStockValueSar || 0) + (MOCK_WAREHOUSES[1].totalStockValueSar || 0);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
      <div className="kpi-card hero">
        <div className="title">إجمالي مبيعات الربع</div>
        <div className="val" suppressHydrationWarning>{formatSar(INITIAL_VAT_DECLARATION.standardRatedSalesSar)} ر.س</div>
        <div className="sub" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <TrendingUp style={{ width: 14, height: 14 }} />
          <span>خاضعة لنسبة 15% الضريبية</span>
        </div>
      </div>

      <div className="kpi-card">
        <div className="title">مجموع المشتريات والمصاريف</div>
        <div className="val" style={{ color: '#2563EB' }} suppressHydrationWarning>{formatSar(INITIAL_VAT_DECLARATION.standardRatedPurchasesSar)} ر.س</div>
        <div className="sub">مدخلات خصمية معتمدة بالفواتير</div>
      </div>

      <div className="kpi-card">
        <div className="title">إجمالي قيمة المخزون الحالي</div>
        <div className="val green" suppressHydrationWarning>{formatSar(stockVal)} ر.س</div>
        <div className="sub">موزعة على مستودع الرياض وجدة</div>
      </div>
    </div>
  );
};
