'use client';

import React from 'react';

export const ReportsBarChart: React.FC = () => {
  const chartData = [
    { month: 'يناير', sales: 78000, vat: 11700 },
    { month: 'فبراير', sales: 92000, vat: 13800 },
    { month: 'مارس', sales: 110000, vat: 16500 },
    { month: 'أبريل', sales: 85000, vat: 12750 },
    { month: 'مايو', sales: 125000, vat: 18750 },
    { month: 'يونيو', sales: 140000, vat: 21000 },
  ];

  const maxVal = 150000;

  return (
    <div className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="card-header" style={{ border: 'none', padding: 0 }}>
        <div className="card-title">تحليل الإيرادات والضريبة حسب الأشهر (2026)</div>
      </div>

      <div style={{ width: '100%', height: 200, display: 'flex', alignItems: 'flex-end', gap: 24, padding: '20px 10px 0 10px', borderBottom: '1px solid var(--border)' }}>
        {chartData.map((item, idx) => {
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
  );
};
