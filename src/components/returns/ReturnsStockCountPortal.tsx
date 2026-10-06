'use client';

import React, { useState } from 'react';
import { ReturnsHeader } from './ReturnsHeader';
import { ReturnsTable } from './ReturnsTable';
import { StockCountsTable } from './StockCountsTable';

export const ReturnsStockCountPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'returns' | 'stock_counts'>('returns');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="fade-up">
      <ReturnsHeader activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'returns' ? (
        <ReturnsTable />
      ) : (
        <StockCountsTable />
      )}
    </div>
  );
};
