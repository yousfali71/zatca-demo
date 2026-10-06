'use client';

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { INITIAL_VAT_DECLARATION } from '../../mock/zatcaData';
import { VatReturnDeclaration } from '../../types/zatcaErp';

import { VatHeader } from './VatHeader';
import { VatInfoCard } from './VatInfoCard';
import { VatKpiCards } from './VatKpiCards';
import { VatSalesSection } from './VatSalesSection';
import { VatPurchasesSection } from './VatPurchasesSection';
import { VatActionBox } from './VatActionBox';

export const VatReturnCalculator: React.FC = () => {
  const { businessProfile } = useAuth();
  const [dec, setDec] = useState<VatReturnDeclaration>(INITIAL_VAT_DECLARATION);
  const [submitted, setSubmitted] = useState(dec.submissionStatus === 'SUBMITTED_AND_PAID');

  const handleInputChange = (field: keyof VatReturnDeclaration, val: number) => {
    setDec(prev => {
      const updated = { ...prev, [field]: val };
      if (field === 'standardRatedSalesSar') {
        updated.standardRatedSalesVatSar = val * 0.15;
      }
      if (field === 'standardRatedPurchasesSar') {
        updated.standardRatedPurchasesVatSar = val * 0.15;
      }

      updated.totalOutputVatSar = updated.standardRatedSalesVatSar;
      updated.totalInputVatSar = updated.standardRatedPurchasesVatSar;
      updated.netTaxPayableSar = updated.totalOutputVatSar - updated.totalInputVatSar;
      return updated;
    });
  };

  const handleSubmitReturn = () => {
    setSubmitted(true);
    setDec(prev => ({ ...prev, submissionStatus: 'SUBMITTED_AND_PAID' }));
  };

  const [activeSubTab, setActiveSubTab] = useState<'sales' | 'purchases'>('sales');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 900, margin: '0 auto', width: '100%', paddingBottom: 64 }} className="fade-up">
      <VatHeader periodName={dec.periodName} />

      <VatInfoCard
        companyNameAr={businessProfile.companyNameAr}
        vatNumber={businessProfile.vatNumber}
        periodQuarter={dec.periodQuarter}
        periodYear={dec.periodYear}
      />

      <VatKpiCards
        totalOutputVatSar={dec.totalOutputVatSar}
        totalInputVatSar={dec.totalInputVatSar}
        netTaxPayableSar={dec.netTaxPayableSar}
      />

      {/* Smart Interactive Tabs */}
      <div style={{ display: 'flex', gap: 12, backgroundColor: '#F1F5F9', padding: 6, borderRadius: 12, marginTop: 12 }}>
        <button
          onClick={() => setActiveSubTab('sales')}
          style={{ flex: 1, padding: '12px 16px', borderRadius: 8, border: 'none', fontWeight: 800, fontSize: 15, cursor: 'pointer', transition: 'all 0.2s', backgroundColor: activeSubTab === 'sales' ? '#FFFFFF' : 'transparent', color: activeSubTab === 'sales' ? 'var(--g-600)' : '#64748B', boxShadow: activeSubTab === 'sales' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none' }}
        >
          أولاً: المبيعات (المخرجات)
        </button>
        <button
          onClick={() => setActiveSubTab('purchases')}
          style={{ flex: 1, padding: '12px 16px', borderRadius: 8, border: 'none', fontWeight: 800, fontSize: 15, cursor: 'pointer', transition: 'all 0.2s', backgroundColor: activeSubTab === 'purchases' ? '#FFFFFF' : 'transparent', color: activeSubTab === 'purchases' ? '#2563EB' : '#64748B', boxShadow: activeSubTab === 'purchases' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none' }}
        >
          ثانياً: المشتريات (المدخلات)
        </button>
      </div>

      <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
        {activeSubTab === 'sales' ? (
          <VatSalesSection dec={dec} onInputChange={handleInputChange} />
        ) : (
          <VatPurchasesSection dec={dec} onInputChange={handleInputChange} />
        )}
      </div>

      <VatActionBox dec={dec} submitted={submitted} onSubmit={handleSubmitReturn} />
    </div>
  );
};
