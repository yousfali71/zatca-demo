'use client';

import React from 'react';
import { RotateCcw } from 'lucide-react';

interface ReturnsHeaderProps {
  activeTab: 'returns' | 'stock_counts';
  onTabChange: (tab: 'returns' | 'stock_counts') => void;
}

export const ReturnsHeader: React.FC<ReturnsHeaderProps> = ({ activeTab, onTabChange }) => {
  return (
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
          onClick={() => onTabChange('returns')}
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
          onClick={() => onTabChange('stock_counts')}
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
  );
};
