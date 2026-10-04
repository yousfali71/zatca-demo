'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../services/apiClient';
import {
  CreditCard, TrendingUp, TrendingDown,
  ShieldCheck, ArrowLeft, QrCode,
  PlusCircle, MoreHorizontal, CheckCircle2
} from 'lucide-react';
import { MOCK_INVOICES, INITIAL_VAT_DECLARATION } from '../mock/zatcaData';
import { Invoice } from '../types/zatcaErp';
import { formatSar } from '../utils/format';

/* ────────────────────────────────── helpers */
const BAR_MONTHS = [
  { label: 'يناير',   sales: 38000, tax: 5700  },
  { label: 'فبراير',  sales: 29000, tax: 4350  },
  { label: 'مارس',    sales: 51000, tax: 7650  },
  { label: 'أبريل',   sales: 43000, tax: 6450  },
  { label: 'مايو',    sales: 60000, tax: 9000  },
  { label: 'يونيو',   sales: 47000, tax: 7050  },
  { label: 'يوليو',   sales: 54000, tax: 8100  },
  { label: 'أغسطس',   sales: 39000, tax: 5850  },
  { label: 'سبتمبر',  sales: 63000, tax: 9450  },
  { label: 'أكتوبر',  sales: 58000, tax: 8700  },
  { label: 'نوفمبر',  sales: 72000, tax: 10800 },
  { label: 'ديسمبر',  sales: 85000, tax: 12750 },
];

const LINE_POINTS = [28, 42, 35, 55, 48, 66, 58, 72, 63, 80, 74, 88];

/* ── SVG Bar Chart ────────────────────────────── */
function BarChart() {
  const maxVal = Math.max(...BAR_MONTHS.map(m => m.sales));
  const W = 560; const H = 120; const PAD_X = 4; const BAR_W = 28; const GAP = 16;

  return (
    <svg viewBox={`0 0 ${W} ${H + 20}`} style={{ width: '100%', height: 150, overflow: 'visible' }}>
      {/* Y grid lines */}
      {[0.25, 0.5, 0.75, 1].map((f, i) => (
        <line key={i} x1={0} y1={H - H * f} x2={W} y2={H - H * f}
          stroke="#E8ECEE" strokeWidth={0.8} strokeDasharray="3 3" />
      ))}

      {BAR_MONTHS.map((m, i) => {
        const x = i * (BAR_W + GAP) + PAD_X;
        const salesH = Math.round((m.sales / maxVal) * H);
        const taxH = Math.round((m.tax / maxVal) * H);
        const isHighlight = i === 10; // نوفمبر

        return (
          <g key={i}>
            {/* Sales bar */}
            <rect
              x={x} y={H - salesH} width={BAR_W} height={salesH}
              rx={5} ry={5}
              fill={isHighlight ? 'var(--g-600)' : 'var(--g-100)'}
            />
            {/* Tax bar overlay */}
            <rect
              x={x} y={H - taxH} width={BAR_W} height={taxH}
              rx={5} ry={5}
              fill={isHighlight ? 'rgba(255,255,255,0.30)' : 'var(--g-300)'}
            />
            {/* Highlighted label */}
            {isHighlight && (
              <>
                <rect x={x - 14} y={H - salesH - 26} width={56} height={20} rx={6} fill="var(--g-600)" />
                <text x={x + BAR_W / 2} y={H - salesH - 12} textAnchor="middle"
                  fill="#fff" fontSize={9} fontWeight={700}>
                  {formatSar(m.tax)} ر.س
                </text>
              </>
            )}
            {/* Month label */}
            <text x={x + BAR_W / 2} y={H + 16} textAnchor="middle"
              fill="var(--text-muted)" fontSize={8.5} fontWeight={600}>
              {m.label.slice(0, 3)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ── SVG Line Chart ────────────────────────────── */
function LineChart() {
  const W = 420; const H = 100;
  const pts = LINE_POINTS;
  const max = Math.max(...pts);
  const min = Math.min(...pts);
  const range = max - min || 1;
  const step = W / (pts.length - 1);

  const coords = pts.map((v, i) => ({
    x: i * step,
    y: H - ((v - min) / range) * H
  }));

  const pathD = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ');
  const areaD = `${pathD} L ${W} ${H} L 0 ${H} Z`;

  // Highlight max point
  const maxIdx = pts.indexOf(max);

  return (
    <svg viewBox={`0 0 ${W} ${H + 24}`} style={{ width: '100%', height: 130 }}>
      {/* Grid */}
      {[0.25, 0.5, 0.75, 1].map((f, i) => (
        <line key={i} x1={0} y1={H * (1 - f)} x2={W} y2={H * (1 - f)}
          stroke="#E8ECEE" strokeWidth={0.8} strokeDasharray="4 4" />
      ))}

      {/* Area fill */}
      <path d={areaD} fill="url(#lineGrad)" />

      {/* Line */}
      <path d={pathD} fill="none" stroke="var(--g-500)" strokeWidth={2} strokeLinejoin="round" />

      {/* Dots */}
      {coords.map((c, i) => (
        <circle key={i} cx={c.x} cy={c.y} r={i === maxIdx ? 5 : 3}
          fill={i === maxIdx ? 'var(--g-600)' : 'var(--white)'}
          stroke="var(--g-500)" strokeWidth={i === maxIdx ? 0 : 1.5} />
      ))}

      {/* Highlighted tooltip */}
      {coords[maxIdx] && (
        <>
          <rect x={coords[maxIdx].x - 24} y={coords[maxIdx].y - 22}
            width={48} height={18} rx={6} fill="var(--g-600)" />
          <text x={coords[maxIdx].x} y={coords[maxIdx].y - 10}
            textAnchor="middle" fill="#fff" fontSize={8.5} fontWeight={700}>
            88%
          </text>
        </>
      )}

      {/* Month labels */}
      {coords.map((c, i) => (
        <text key={i} x={c.x} y={H + 16} textAnchor="middle"
          fill="var(--text-muted)" fontSize={8} fontWeight={600}>
          {(i + 1).toString()}
        </text>
      ))}

      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--g-300)" stopOpacity={0.35} />
          <stop offset="100%" stopColor="var(--g-300)" stopOpacity={0} />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ── SVG Donut Chart ───────────────────────────── */
function DonutChart({ output, input, net }: { output: number; input: number; net: number }) {
  const total = output + input + net;
  const r = 45; const cx = 60; const cy = 60;
  const circ = 2 * Math.PI * r;

  const slices = [
    { value: output, color: 'var(--g-600)', label: 'مخرجات' },
    { value: input,  color: 'var(--g-300)', label: 'مدخلات' },
    { value: net,    color: 'var(--g-100)', label: 'صافي'   },
  ];

  let offset = 0;
  const arcs = slices.map(s => {
    const pct = s.value / total;
    const dash = pct * circ;
    const gap = circ - dash;
    const arc = { ...s, dash, gap, offset };
    offset += dash;
    return arc;
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
      <svg viewBox="0 0 120 120" style={{ width: 100, height: 100, flexShrink: 0 }}>
        {arcs.map((arc, i) => (
          <circle key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={arc.color}
            strokeWidth={18}
            strokeDasharray={`${arc.dash} ${arc.gap}`}
            strokeDashoffset={-arc.offset}
            strokeLinecap="round"
            style={{ transform: 'rotate(-90deg)', transformOrigin: `${cx}px ${cy}px` }}
          />
        ))}
        {/* Center label */}
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize={9} fill="var(--text-muted)" fontWeight={600}>إجمالي</text>
        <text x={cx} y={cy + 8} textAnchor="middle" fontSize={11} fill="var(--text-primary)" fontWeight={900}>VAT</text>
      </svg>

      {/* Legend */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {[
          { label: 'المخرجات', val: output, color: 'var(--g-600)' },
          { label: 'المدخلات', val: input,  color: 'var(--g-300)' },
          { label: 'الصافي',   val: net,    color: 'var(--g-100)', border: '1px solid var(--g-300)' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11.5 }}>
            <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontWeight: 800, color: 'var(--text-primary)' }} suppressHydrationWarning>
                {formatSar(item.val)} ر.س
              </span>
              <span style={{
                width: 9, height: 9, borderRadius: '50%',
                background: item.color, border: item.border ?? 'none', flexShrink: 0
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Recent Invoices List ──────────────────────── */
function RecentExpensesList({ invoices, onPrint }: { invoices: Invoice[]; onPrint: (inv: Invoice) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {invoices.slice(0, 5).map(inv => (
        <div
          key={inv.id}
          onClick={() => onPrint(inv)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '9px 14px', borderRadius: 10, cursor: 'pointer',
            transition: 'background 0.15s'
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--g-50)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{inv.customerName}</div>
            <div style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 1 }}>{inv.issueDate}</div>
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--text-primary)' }} suppressHydrationWarning>
              {formatSar(inv.grandTotal)} <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 400 }}>ر.س</span>
            </div>
            <div style={{
              fontSize: 10, fontWeight: 700, color: inv.status === 'CLEARED' ? 'var(--g-600)' : 'var(--gold)',
              textAlign: 'left', marginTop: 1
            }}>
              {inv.status === 'CLEARED' ? '✓ معتمدة' : '⊙ مبلغة'}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Main Dashboard ────────────────────────────── */
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
      <div className="rg-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>

        {/* KPI 1: Total Sales */}
        <div className="kpi-card">
          <div className="kpi-card-menu">···</div>
          <div className="kpi-icon-wrap" style={{ background: 'var(--g-50)' }}>
            <TrendingUp style={{ width: 18, height: 18, color: 'var(--g-600)' }} />
          </div>
          <div className="kpi-label">إجمالي الإيرادات</div>
          <div className="kpi-value" suppressHydrationWarning>{formatSar(vatDec.standardRatedSalesSar)}</div>
          <div className="kpi-sub">ريال</div>
          <div className="kpi-trend-up">▲ 18% مقابل آخر 30 يوماً</div>
        </div>

        {/* KPI 2: Purchases */}
        <div className="kpi-card">
          <div className="kpi-card-menu">···</div>
          <div className="kpi-icon-wrap" style={{ background: '#FFF8E6' }}>
            <TrendingDown style={{ width: 18, height: 18, color: 'var(--gold)' }} />
          </div>
          <div className="kpi-label">إجمالي المشتريات</div>
          <div className="kpi-value" suppressHydrationWarning>{formatSar(vatDec.standardRatedPurchasesSar)}</div>
          <div className="kpi-sub">ريال</div>
          <div className="kpi-trend-down">▼ 7% مقابل آخر 30 يوماً</div>
        </div>

        {/* KPI 3: HERO — Net Tax */}
        <div className="kpi-card hero">
          <div className="kpi-card-menu">···</div>
          <div className="kpi-icon-wrap" style={{ background: 'rgba(255,255,255,0.18)' }}>
            <CreditCard style={{ width: 18, height: 18, color: '#fff' }} />
          </div>
          <div className="kpi-label">صافي الضريبة</div>
          <div className="kpi-value" suppressHydrationWarning>{formatSar(vatDec.netTaxPayableSar)}</div>
          <div className="kpi-sub">ريال</div>
          <div className="kpi-trend-up">▲ 23% مقابل آخر 30 يوماً</div>
        </div>

        {/* KPI 4: Input VAT */}
        <div className="kpi-card">
          <div className="kpi-card-menu">···</div>
          <div className="kpi-icon-wrap" style={{ background: 'var(--g-50)' }}>
            <ShieldCheck style={{ width: 18, height: 18, color: 'var(--g-500)' }} />
          </div>
          <div className="kpi-label">ضريبة المدخلات</div>
          <div className="kpi-value" suppressHydrationWarning>{formatSar(vatDec.totalInputVatSar)}</div>
          <div className="kpi-sub">ريال</div>
          <div className="kpi-trend-up">▲ 11% مقابل آخر 30 يوماً</div>
        </div>
      </div>

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
        <div
          style={{
            borderRadius: 'var(--radius-card)',
            background: 'linear-gradient(160deg, var(--g-900) 0%, var(--g-700) 100%)',
            padding: '20px 18px',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(255,255,255,0.12)', borderRadius: 8,
              padding: '4px 10px', fontSize: 10.5, fontWeight: 700, color: 'rgba(255,255,255,0.80)',
              marginBottom: 14
            }}>
              <CreditCard style={{ width: 12, height: 12 }} />
              سداد ZATCA Q3
            </div>

            <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.55)', marginBottom: 4 }}>
              المبلغ المستحق
            </div>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1 }} suppressHydrationWarning>
              {formatSar(vatDec.netTaxPayableSar)}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.50)', marginTop: 2 }}>ريال سعودي</div>

            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { label: 'ضريبة المخرجات', val: vatDec.totalOutputVatSar },
                { label: 'خصم المدخلات', val: -vatDec.totalInputVatSar },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                  <span style={{ color: 'rgba(255,255,255,0.55)' }}>{row.label}</span>
                  <span style={{ fontWeight: 700, color: row.val < 0 ? 'var(--g-300)' : '#fff' }} suppressHydrationWarning>
                    {row.val < 0 ? '-' : ''}{formatSar(Math.abs(row.val))} ر.س
                  </span>
                </div>
              ))}
            </div>
          </div>

          {payDone ? (
            <div style={{
              marginTop: 14, display: 'flex', alignItems: 'center', gap: 6,
              justifyContent: 'center', padding: '10px', borderRadius: 10,
              background: 'rgba(45,171,101,0.25)', border: '1px solid rgba(93,198,138,0.30)',
              fontSize: 11.5, fontWeight: 700, color: 'var(--g-200)'
            }}>
              <CheckCircle2 style={{ width: 14, height: 14, color: 'var(--g-300)' }} />
              تم السداد بنجاح
            </div>
          ) : (
            <button
              type="button"
              disabled={paying}
              onClick={handlePay}
              style={{
                marginTop: 14, width: '100%', padding: '11px',
                borderRadius: 10, border: 'none', cursor: 'pointer',
                background: 'var(--gold)', color: '#fff',
                fontSize: 12.5, fontWeight: 800, fontFamily: 'inherit',
                boxShadow: '0 4px 14px rgba(200,169,81,0.40)',
                transition: 'transform 0.15s'
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              {paying ? 'جاري المعالجة...' : 'سداد الضريبة الآن'}
            </button>
          )}
        </div>
      </div>

      {/* ── Row 5: Full Invoices Table ── */}
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShieldCheck style={{ width: 15, height: 15, color: 'var(--g-600)' }} />
            <span className="card-title">سجل الفواتير — ZATCA Phase 2</span>
          </div>
          <button
            type="button"
            onClick={() => onNavigateToTab('pos_sales')}
            style={{ fontSize: 11, fontWeight: 700, color: 'var(--g-600)', background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            <span>عرض الكل</span>
            <ArrowLeft style={{ width: 12, height: 12 }} />
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ textAlign: 'right' }}>
            <thead>
              <tr>
                <th>رقم الفاتورة</th>
                <th>النوع</th>
                <th>العميل</th>
                <th>التاريخ</th>
                <th>الإجمالي</th>
                <th>الضريبة 15%</th>
                <th>حالة ZATCA</th>
                <th style={{ textAlign: 'center' }}>معاينة</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id}>
                  <td><span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 11.5 }}>{inv.invoiceNumber}</span></td>
                  <td>
                    <span className={inv.invoiceType === 'STANDARD' ? 'badge-gold' : 'badge-green'}>
                      {inv.invoiceType === 'STANDARD' ? 'B2B ضريبية' : 'B2C مبسطة'}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{inv.customerName}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{inv.issueDate}</td>
                  <td style={{ fontWeight: 800 }} suppressHydrationWarning>
                    {formatSar(inv.grandTotal)} <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 400 }}>ر.س</span>
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--g-600)' }} suppressHydrationWarning>
                    {formatSar(inv.totalVatAmount)} ر.س
                  </td>
                  <td>
                    <span className={inv.status === 'CLEARED' ? 'badge-green' : 'badge-gold'}>
                      {inv.status === 'CLEARED' ? 'معتمدة' : 'مبلغة'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      type="button"
                      onClick={() => onSelectInvoiceForPrint && onSelectInvoiceForPrint(inv)}
                      className="btn-ghost"
                      style={{ padding: '5px 12px', fontSize: 11 }}
                    >
                      <QrCode style={{ width: 12, height: 12 }} />
                      معاينة
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

