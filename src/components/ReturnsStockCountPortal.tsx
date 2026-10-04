'use client';

import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { MOCK_RETURNS, MOCK_STOCK_COUNTS } from '../mock/zatcaData';
import { formatSar } from '../utils/format';

export const ReturnsStockCountPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'returns' | 'stock_counts'>('returns');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="fade-up">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <RotateCcw style={{ width: 22, height: 22, color: 'var(--g-600)' }} />
            <span>المرتجعات والإشعارات الضريبية وجرد المخزون</span>
          </h1>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            إصدار الإشعارات الدائنة والمدينة الضريبية (Credit/Debit Notes) المعتمدة لدى ZATCA وجرد الفروقات
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', background: '#E2E8F0', padding: 3, borderRadius: 10 }}>
          <button
            type="button"
            onClick={() => setActiveTab('returns')}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeTab === 'returns' ? 'var(--g-600)' : 'transparent',
              color: activeTab === 'returns' ? '#FFF' : 'var(--text-primary)',
              transition: 'all 0.15s ease'
            }}
          >
            إشعارات المرتجعات الضريبية
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('stock_counts')}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeTab === 'stock_counts' ? 'var(--g-600)' : 'transparent',
              color: activeTab === 'stock_counts' ? '#FFF' : 'var(--text-primary)',
              transition: 'all 0.15s ease'
            }}
          >
            تسويات الجرد المخزني
          </button>
        </div>
      </div>

      {activeTab === 'returns' ? (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="data-table" style={{ width: '100%', textAlign: 'right' }}>
            <thead>
              <tr>
                <th>رقم الإشعار الدائن</th>
                <th>رقم الفاتورة الأصلية</th>
                <th>الطرف المسترجِع</th>
                <th>التاريخ</th>
                <th>الضريبة المرتجعة (15%)</th>
                <th>إجمالي الإرجاع الشامل</th>
                <th>اعتماد ZATCA</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_RETURNS.map((ret) => (
                <tr key={ret.id}>
                  <td style={{ fontWeight: 800, fontFamily: 'monospace', color: 'var(--text-primary)' }}>{ret.returnNumber}</td>
                  <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>{ret.originalReferenceNumber}</td>
                  <td style={{ fontWeight: 700 }}>{ret.partyName}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{ret.date}</td>
                  <td style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--g-600)' }} suppressHydrationWarning>{formatSar(ret.totalVatRefundSar)} ر.س</td>
                  <td style={{ fontFamily: 'monospace', fontWeight: 900, color: 'var(--text-primary)' }} suppressHydrationWarning>{formatSar(ret.totalRefundSar)} ر.س</td>
                  <td>
                    <span className="badge-green">
                      معتمد ZATCA
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="data-table" style={{ width: '100%', textAlign: 'right' }}>
            <thead>
              <tr>
                <th>رقم التسوية والجرد</th>
                <th>المستودع</th>
                <th>تاريخ الجرد</th>
                <th>عدد الأصناف المتأثرة</th>
                <th>قيمة العجز / الزيادة</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_STOCK_COUNTS.map((sc) => (
                <tr key={sc.id}>
                  <td style={{ fontWeight: 800, fontFamily: 'monospace', color: 'var(--text-primary)' }}>{sc.referenceNumber}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{sc.warehouseName}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{sc.date}</td>
                  <td style={{ fontWeight: 800 }}>{sc.discrepancyItemsCount} أصناف</td>
                  <td style={{ fontFamily: 'monospace', fontWeight: 800, color: '#E11D48' }} suppressHydrationWarning>{formatSar(sc.totalVarianceValueSar)} ر.س</td>
                  <td>
                    <span className="badge-green">
                      مكتمل ومرحّل
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

