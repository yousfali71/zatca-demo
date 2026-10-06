'use client';

import React from 'react';
import { BarChart3, Download } from 'lucide-react';

export const ReportsHeader: React.FC = () => {
  return (
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
  );
};
