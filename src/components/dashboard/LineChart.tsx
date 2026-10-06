'use client';

import React from 'react';

const LINE_POINTS = [28, 42, 35, 55, 48, 66, 58, 72, 63, 80, 74, 88];

export const LineChart: React.FC = () => {
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
};
