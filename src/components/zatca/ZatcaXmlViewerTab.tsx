'use client';

import React from 'react';
import { Copy } from 'lucide-react';

interface ZatcaXmlViewerTabProps {
  sampleXml: string;
  copiedXml: boolean;
  onCopy: (text: string) => void;
}

export const ZatcaXmlViewerTab: React.FC<ZatcaXmlViewerTabProps> = ({
  sampleXml,
  copiedXml,
  onCopy
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', margin: 0 }}>معاينة بنية ملف XML (UBL 2.1 Standard)</h3>
        <button type="button" onClick={() => onCopy(sampleXml)} style={{ background: 'none', border: '1px solid #CBD5E1', padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Copy style={{ width: 14, height: 14 }} />
          <span>{copiedXml ? 'تم النسخ!' : 'نسخ كـ XML'}</span>
        </button>
      </div>
      <div style={{ background: '#0F172A', color: '#6EE7B7', padding: 20, borderRadius: 8, fontFamily: 'monospace', fontSize: 12, maxHeight: 450, overflow: 'auto' }}>
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{sampleXml}</pre>
      </div>
    </div>
  );
};
