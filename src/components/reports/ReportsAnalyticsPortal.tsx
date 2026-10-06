'use client';

import React from 'react';
import { ReportsHeader } from './ReportsHeader';
import { ReportsKpiCards } from './ReportsKpiCards';
import { ReportsBarChart } from './ReportsBarChart';

export const ReportsAnalyticsPortal: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="fade-up">
      <ReportsHeader />
      <ReportsKpiCards />
      <ReportsBarChart />
    </div>
  );
};
