'use client';

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/zatcaErp';
import { X, UserCheck, CheckCircle2 } from 'lucide-react';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, switchRole } = useAuth();
  if (!isOpen) return null;

  const roles: { role: UserRole; title: string; desc: string }[] = [
    {
      role: 'OWNER',
      title: 'مالك المنشأة (Business Owner)',
      desc: 'كامل صلاحيات النظام والإقرارات الضريبية وربط ZATCA والإحصائيات.'
    },
    {
      role: 'FINANCE_MANAGER',
      title: 'مديرة الحسابات والضرائب (Finance Manager)',
      desc: 'إعداد الإقرارات الضريبية، خصم ضريبة المدخلات، وسداد مبالغ ZATCA.'
    },
    {
      role: 'STORE_KEEPER',
      title: 'أمين المستودع الرئيسي (Store Keeper)',
      desc: 'إدارة مخزون البضاعة، استلام الشحنات، والتسويات الجردية.'
    },
    {
      role: 'CASHIER',
      title: 'كاشير نقاط البيع (POS Cashier)',
      desc: 'إصدار الفواتير المبسطة B2C وطباعة إيصالات ZATCA QR.'
    }
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 99, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', padding: 16 }} className="fade-up">
      <div className="card" style={{ width: '100%', maxWidth: 450, padding: 24, display: 'flex', flexDirection: 'column', gap: 16, background: '#FFF' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <UserCheck style={{ width: 20, height: 20, color: 'var(--g-600)' }} />
            <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>تغيير دور المستخدم التجريبي</h3>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {roles.map((item) => {
            const isSelected = currentUser?.role === item.role;
            return (
              <button
                key={item.role}
                type="button"
                onClick={() => {
                  switchRole(item.role);
                  onClose();
                }}
                style={{
                  width: '100%',
                  padding: 14,
                  borderRadius: 10,
                  textAlign: 'right',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: 12,
                  border: isSelected ? '1px solid var(--g-600)' : '1px solid var(--border)',
                  backgroundColor: isSelected ? 'var(--g-50)' : '#FFF',
                  transition: 'all 0.15s ease'
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>{item.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{item.desc}</div>
                </div>

                {isSelected && (
                  <CheckCircle2 style={{ width: 18, height: 18, color: 'var(--g-600)', flexShrink: 0, marginTop: 2 }} />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

