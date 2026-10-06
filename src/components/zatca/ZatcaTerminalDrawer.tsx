'use client';

import React from 'react';
import { Terminal, ChevronDown, ChevronUp } from 'lucide-react';

interface ZatcaTerminalDrawerProps {
  logs: string[];
  showTerminal: boolean;
  onToggle: () => void;
}

export const ZatcaTerminalDrawer: React.FC<ZatcaTerminalDrawerProps> = ({
  logs,
  showTerminal,
  onToggle
}) => {
  return (
    <div style={{ border: '1px solid #E2E8F0', borderRadius: 8, background: '#0F172A', color: '#E2E8F0', overflow: 'hidden' }}>
      <button
        type="button"
        onClick={onToggle}
        style={{
          width: '100%', padding: '12px 18px', background: 'none', border: 'none', color: '#94A3B8',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: 12, fontFamily: 'monospace'
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: '#F59E0B' }}>
          <Terminal style={{ width: 16, height: 16 }} />
          عرض سجل الاتصال المباشر (ZATCA API Live Output Trace)
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>{logs.length} سجلات</span>
          {showTerminal ? <ChevronUp style={{ width: 16, height: 16 }} /> : <ChevronDown style={{ width: 16, height: 16 }} />}
        </div>
      </button>

      {showTerminal && (
        <div style={{ padding: 18, borderTop: '1px solid #1E293B', fontFamily: 'monospace', fontSize: 12, color: '#6EE7B7', maxHeight: 220, overflow: 'auto' }}>
          <pre style={{ margin: 0, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{logs.join('\n')}</pre>
        </div>
      )}
    </div>
  );
};
