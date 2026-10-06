'use client';

import React from 'react';
import { formatSar } from '../../utils/format';

export const BAR_MONTHS = [
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

export const BarChart: React.FC = () => {
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
};
