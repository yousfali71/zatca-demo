'use client';

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Printer, CheckCircle2, CreditCard, Calculator } from 'lucide-react';
import { INITIAL_VAT_DECLARATION } from '../mock/zatcaData';
import { VatReturnDeclaration } from '../types/zatcaErp';
import { formatSar } from '../utils/format';

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="fade-up">
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: 'var(--g-600)', marginBottom: 4 }}>
            <ShieldCheck style={{ width: 16, height: 16 }} />
            <span>نموذج الإقرار الضريبي الرسمي المعتمد من هيئة الزكاة والضريبة والجمارك (نموذج 2026)</span>
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
            إقرار ضريبة القيمة المضافة (VAT Return) - {dec.periodName}
          </h1>
        </div>

        <button type="button" onClick={() => window.print()} className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Printer style={{ width: 15, height: 15, color: 'var(--g-600)' }} />
          <span>طباعة الإقرار</span>
        </button>
      </div>

      {/* Info Card */}
      <div className="card" style={{ padding: 18 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          <div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>اسم المنشأة المكلفة</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>{businessProfile.companyNameAr}</span>
          </div>
          <div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>الرقم الضريبي (VAT ID)</span>
            <span style={{ fontSize: 14, fontWeight: 800, fontFamily: 'monospace', color: 'var(--text-primary)' }}>{businessProfile.vatNumber}</span>
          </div>
          <div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>الفترة الضريبية</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--g-600)' }}>{dec.periodQuarter} {dec.periodYear}</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
        <div className="kpi-card">
          <div className="title">ضريبة المخرجات (Sales VAT)</div>
          <div className="val green" suppressHydrationWarning>{formatSar(dec.totalOutputVatSar)} ر.س</div>
          <div className="sub">15% محصلة من مبيعات الفترة</div>
        </div>
        <div className="kpi-card">
          <div className="title">ضريبة المدخلات (Purchases VAT)</div>
          <div className="val" style={{ color: '#2563EB' }} suppressHydrationWarning>{formatSar(dec.totalInputVatSar)} ر.س</div>
          <div className="sub">خصم فواتير الموردين المستردة</div>
        </div>
        <div className="kpi-card hero">
          <div className="title">صافي الضريبة المستحقة للدفع</div>
          <div className="val" suppressHydrationWarning>{formatSar(dec.netTaxPayableSar)} ر.س</div>
          <div className="sub">معادلة الزكاة: المخرجات - المدخلات</div>
        </div>
      </div>

      {/* Section 1: Sales / Output VAT */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="card-header" style={{ padding: '14px 20px', backgroundColor: '#FAFAFA', borderBottom: '1px solid var(--border)' }}>
          <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Calculator style={{ width: 18, height: 18, color: 'var(--g-600)' }} />
            <span>أولاً: المبيعات والمخرجات (Sales & Output VAT)</span>
          </div>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>المبالغ بالريال السعودي</span>
        </div>

        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="rg-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, alignItems: 'center', paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
            <div>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', display: 'block' }}>1. المبيعات الخاضعة للنسبة الأساسية (15%)</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>الفواتير الإلكترونية المعتمدة من ZATCA</span>
            </div>
            <div>
              <label className="label">المبلغ الإجمالي (بدون الضريبة)</label>
              <input
                type="number"
                value={dec.standardRatedSalesSar}
                onChange={(e) => handleInputChange('standardRatedSalesSar', Number(e.target.value))}
                className="input"
                style={{ fontFamily: 'monospace', fontWeight: 700 }}
              />
            </div>
            <div>
              <label className="label">مبلغ الضريبة المحصلة (15%)</label>
              <div style={{ padding: '8px 12px', background: 'var(--g-50)', border: '1px solid #C8E6C9', borderRadius: 8, fontFamily: 'monospace', fontWeight: 800, color: 'var(--g-600)', fontSize: 14 }} suppressHydrationWarning>
                {formatSar(dec.standardRatedSalesVatSar)} ر.س
              </div>
            </div>
          </div>

          <div className="rg-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', display: 'block' }}>2. المبيعات الخاضعة لنسبة الصفر (0%)</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>الصادرات والسلع المعفاة</span>
            </div>
            <div>
              <input
                type="number"
                value={dec.zeroRatedSalesSar}
                onChange={(e) => handleInputChange('zeroRatedSalesSar', Number(e.target.value))}
                className="input"
                style={{ fontFamily: 'monospace', fontWeight: 700 }}
              />
            </div>
            <div style={{ fontFamily: 'monospace', color: 'var(--text-muted)', fontWeight: 700, fontSize: 14 }}>0.00 ر.س</div>
          </div>
        </div>
      </div>

      {/* Section 2: Purchases / Input VAT */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="card-header" style={{ padding: '14px 20px', backgroundColor: '#FAFAFA', borderBottom: '1px solid var(--border)' }}>
          <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Calculator style={{ width: 18, height: 18, color: '#2563EB' }} />
            <span>ثانياً: المشتريات والمدخلات القابلة للخصم (Purchases & Input VAT)</span>
          </div>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>خصم ضريبة فواتير الموردين</span>
        </div>

        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="rg-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', display: 'block' }}>1. المشتريات الخاضعة للنسبة الأساسية (15%)</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>فواتير المشتريات ذات الرقم الضريبي</span>
            </div>
            <div>
              <label className="label">المبلغ الإجمالي (بدون الضريبة)</label>
              <input
                type="number"
                value={dec.standardRatedPurchasesSar}
                onChange={(e) => handleInputChange('standardRatedPurchasesSar', Number(e.target.value))}
                className="input"
                style={{ fontFamily: 'monospace', fontWeight: 700 }}
              />
            </div>
            <div>
              <label className="label">مبلغ الضريبة المستردة (15%)</label>
              <div style={{ padding: '8px 12px', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 8, fontFamily: 'monospace', fontWeight: 800, color: '#1D4ED8', fontSize: 14 }} suppressHydrationWarning>
                {formatSar(dec.standardRatedPurchasesVatSar)} ر.س
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submission Action Box */}
      <div className="card" style={{ background: 'var(--g-600)', color: '#FFF', padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>نتيجة حساب الإقرار الضريبي النهائي</div>
            <h3 style={{ fontSize: 22, fontWeight: 900, color: 'var(--gold)', margin: '4px 0 0 0' }} suppressHydrationWarning>
              صافي الضريبة الواجب دفعها لـ ZATCA: {formatSar(dec.netTaxPayableSar)} ر.س
            </h3>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', marginTop: 4 }} suppressHydrationWarning>
              (ضريبة المخرجات {formatSar(dec.totalOutputVatSar)} ر.س - ضريبة المدخلات {formatSar(dec.totalInputVatSar)} ر.س)
            </div>
          </div>

          <div>
            {submitted ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', background: 'var(--gold)', color: '#000', borderRadius: 10, fontWeight: 800, fontSize: 13 }}>
                <CheckCircle2 style={{ width: 18, height: 18 }} />
                <span>تم الاعتماد والتسديد بنجاح (رقم سداد: 020-998271)</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleSubmitReturn}
                className="btn-primary"
                style={{ backgroundColor: 'var(--gold)', color: '#000', fontSize: 14, padding: '12px 24px' }}
              >
                <CreditCard style={{ width: 18, height: 18 }} />
                <span>تقديم الإقرار وتسديد الضريبة عبر سداد الآن</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

