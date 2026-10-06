'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../services/apiClient';
import { PlusCircle, ArrowLeft } from 'lucide-react';
import { MOCK_INVOICES, INITIAL_VAT_DECLARATION } from '../../mock/zatcaData';
import { Invoice } from '../../types/zatcaErp';

import { BarChart } from './BarChart';
import { LineChart } from './LineChart';
import { DonutChart } from './DonutChart';
import { RecentExpensesList } from './RecentExpensesList';
import { KpiCardsSection } from './KpiCardsSection';
import { SadadPaymentCard } from './SadadPaymentCard';
import { InvoicesTableSection } from './InvoicesTableSection';

interface Props {
  onNavigateToTab: (tab: any) => void;
  onSelectInvoiceForPrint?: (inv: Invoice) => void;
}

export const ZatcaTaxDashboard: React.FC<Props> = ({ onNavigateToTab, onSelectInvoiceForPrint }) => {
  const { businessProfile } = useAuth();
  const [vatDec] = useState(INITIAL_VAT_DECLARATION);
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [payDone, setPayDone] = useState(false);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const sales = await apiClient.getSales();
        if (Array.isArray(sales) && sales.length > 0) {
          setInvoices(sales);
        }
      } catch {
        /* keep default list */
      }
    };
    fetchSales();
  }, []);

  const handlePay = () => {
    setPaying(true);
    setTimeout(() => { setPaying(false); setPayDone(true); }, 1800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="fade-up">

      {/* ── Row 1: Page title ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>لوحة القيادة</h1>
          <p style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 3, fontWeight: 600 }}>
            الربع الثالث 2026 · هيئة الزكاة والضريبة والجمارك
          </p>
        </div>
        <button className="btn-primary" onClick={() => onNavigateToTab('pos_sales')}>
          <PlusCircle style={{ width: 14, height: 14 }} />
          فاتورة جديدة
        </button>
      </div>

      {/* ── Row 2: KPI Cards ── */}
      <KpiCardsSection vatDec={vatDec} />

      {/* ── Row 3: Bar Chart + Recent Invoices ── */}
      <div className="rg-side" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 14 }}>
        {/* Bar chart card */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">أعلى 10 مصادر الضرائب</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11 }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: 'var(--g-600)', display: 'inline-block' }} />
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>مبيعات</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11 }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: 'var(--g-300)', display: 'inline-block' }} />
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>ضريبة</span>
              </div>
              <button className="card-more" type="button">···</button>
            </div>
          </div>
          <div style={{ padding: '8px 16px 12px' }}>
            <BarChart />
          </div>
        </div>

        {/* Recent invoices */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">المصاريف الحديثة</span>
            <button
              type="button"
              onClick={() => onNavigateToTab('pos_sales')}
              style={{ fontSize: 11, fontWeight: 700, color: 'var(--g-600)', background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              <span>الكل</span>
              <ArrowLeft style={{ width: 12, height: 12 }} />
            </button>
          </div>
          <RecentExpensesList
            invoices={invoices}
            onPrint={inv => onSelectInvoiceForPrint && onSelectInvoiceForPrint(inv)}
          />
        </div>
      </div>

      {/* ── Row 4: Line chart + Donut + SADAD ── */}
      <div className="rg-side3" style={{ display: 'grid', gridTemplateColumns: '1fr 280px 260px', gap: 14 }}>
        {/* Line chart */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">نشاط المصاريف</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11 }}>
                <span style={{ width: 18, height: 2, background: 'var(--g-500)', display: 'inline-block', borderRadius: 2 }} />
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>المصاريف الفعلية</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11 }}>
                <span style={{ width: 18, height: 2, background: 'var(--border)', display: 'inline-block', borderRadius: 2, borderTop: '2px dashed var(--text-muted)' }} />
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>المصاريف المتوقعة</span>
              </div>
              <button className="card-more" type="button">···</button>
            </div>
          </div>
          <div style={{ padding: '4px 16px 12px' }}>
            <LineChart />
          </div>
        </div>

        {/* Donut — Overview */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">نظرة عامة</span>
            <button className="card-more" type="button">···</button>
          </div>
          <div style={{ padding: '8px 16px 16px' }}>
            <DonutChart
              output={vatDec.totalOutputVatSar}
              input={vatDec.totalInputVatSar}
              net={vatDec.netTaxPayableSar}
            />
          </div>
        </div>

        {/* SADAD Payment box */}
        <SadadPaymentCard
          vatDec={vatDec}
          paying={paying}
          payDone={payDone}
          onPay={handlePay}
        />
      </div>

      {/* ── Row 5: Full Invoices Table ── */}
      <InvoicesTableSection
        invoices={invoices}
        onNavigateToTab={onNavigateToTab}
        onSelectInvoiceForPrint={onSelectInvoiceForPrint}
      />
    </div>
  );
};
