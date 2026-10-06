'use client';

import React from 'react';
import { formatSar } from '../../utils/format';

interface DonutChartProps {
  output: number;
  input: number;
  net: number;
}

export const DonutChart: React.FC<DonutChartProps> = ({ output, input, net }) => {
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
    const pct = total > 0 ? s.value / total : 0;
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
};
