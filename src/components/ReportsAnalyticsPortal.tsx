'use client';

import React from 'react';
import { BarChart3, TrendingUp, Download } from 'lucide-react';
import { INITIAL_VAT_DECLARATION, MOCK_WAREHOUSES } from '../mock/zatcaData';
import { formatSar } from '../utils/format';

export const ReportsAnalyticsPortal: React.FC = () => {
  const stockVal = (MOCK_WAREHOUSES[0].totalStockValueSar || 0) + (MOCK_WAREHOUSES[1].totalStockValueSar || 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="fade-up">
      {/* Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <BarChart3 style={{ width: 22, height: 22, color: 'var(--g-600)' }} />
            <span>التقارير التحليلية وسجلات التدقيق الضريبي ZATCA</span>
          </h1>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            تقارير المبيعات الشاملة، تقارير الأرباح، تقييم المستودعات، وطباعة كشوف التدقيق للهيئة
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="btn-ghost"
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <Download style={{ width: 16, height: 16, color: 'var(--g-600)' }} />
          <span>تصدير تقرير التدقيق الشامل</span>
        </button>
      </div>

      {/* KPI Cards */}
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

      {/* Visual Chart Card */}
      <div className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="card-header" style={{ border: 'none', padding: 0 }}>
          <div className="card-title">تحليل الإيرادات والضريبة حسب الأشهر (2026)</div>
        </div>

        {/* SVG Chart */}
        <div style={{ width: '100%', height: 200, display: 'flex', alignItems: 'flex-end', gap: 24, padding: '20px 10px 0 10px', borderBottom: '1px solid var(--border)' }}>
          {[
            { month: 'يناير', sales: 78000, vat: 11700 },
            { month: 'فبراير', sales: 92000, vat: 13800 },
            { month: 'مارس', sales: 110000, vat: 16500 },
            { month: 'أبريل', sales: 85000, vat: 12750 },
            { month: 'مايو', sales: 125000, vat: 18750 },
            { month: 'يونيو', sales: 140000, vat: 21000 },
          ].map((item, idx) => {
            const maxVal = 150000;
            const hPct = (item.sales / maxVal) * 100;
            const vPct = (item.vat / maxVal) * 100;
            return (
              <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 4, height: '100%' }}>
                  <div
                    style={{
                      width: '40%',
                      height: `${hPct}%`,
                      backgroundColor: 'var(--g-600)',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.3s ease'
                    }}
                    title={`المبيعات: ${item.sales.toLocaleString()} ر.س`}
                  />
                  <div
                    style={{
                      width: '30%',
                      height: `${vPct}%`,
                      backgroundColor: 'var(--gold)',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.3s ease'
                    }}
                    title={`الضريبة: ${item.vat.toLocaleString()} ر.س`}
                  />
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>{item.month}</span>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 12, height: 12, backgroundColor: 'var(--g-600)', borderRadius: 3 }}></span>
            <span>المبيعات الخاضعة للضريبة</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 12, height: 12, backgroundColor: 'var(--gold)', borderRadius: 3 }}></span>
            <span>ضريبة القيمة المضافة (15%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

