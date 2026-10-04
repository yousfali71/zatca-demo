'use client';

import React, { useState, useEffect } from 'react';
import { Users, Loader2 } from 'lucide-react';
import { Customer, Supplier } from '../types/zatcaErp';
import { formatSar } from '../utils/format';
import { apiClient } from '../services/apiClient';

function mapCustomer(c: any): Customer {
  return {
    id: c.id,
    name: c.name || 'عميل',
    email: c.email || '',
    phone: c.phone || '',
    vatNumber: c.vatNumber || '',
    crNumber: c.crNumber || '',
    address: c.address || '',
    city: c.city || 'الرياض',
    customerType: c.vatNumber ? 'B2B' : 'B2C',
    totalPurchasesSar: Number(c.totalPurchasesSar || c.totalSales || 0)
  };
}

function mapSupplier(s: any): Supplier {
  return {
    id: s.id,
    name: s.name || s.companyName || 'مورد',
    companyName: s.companyName || s.name || 'مورد',
    email: s.email || '',
    phone: s.phone || '',
    vatNumber: s.vatNumber || '',
    crNumber: s.crNumber || '',
    address: s.address || '',
    city: s.city || 'الرياض',
    balanceDueSar: Number(s.balanceDueSar || s.balance || 0)
  };
}

export const StakeholdersPortal: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'customers' | 'suppliers'>('customers');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [cRes, sRes] = await Promise.allSettled([
          apiClient.getCustomers(),
          apiClient.getSuppliers()
        ]);

        if (cRes.status === 'fulfilled' && Array.isArray(cRes.value)) {
          setCustomers(cRes.value.map(mapCustomer));
        }
        if (sRes.status === 'fulfilled' && Array.isArray(sRes.value)) {
          setSuppliers(sRes.value.map(mapSupplier));
        }
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="fade-up">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users style={{ width: 22, height: 22, color: 'var(--g-600)' }} />
            <span>إدارة الأطراف الخارجية (العملاء والموردين)</span>
          </h1>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            سجل العملاء التجاريين (B2B)، الأفراد (B2C)، والموردين المعتمدين ضريبياً لـ ZATCA (مباشرة من الباك إند)
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', background: '#E2E8F0', padding: 3, borderRadius: 10 }}>
          <button
            type="button"
            onClick={() => setView('customers')}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: view === 'customers' ? 'var(--g-600)' : 'transparent',
              color: view === 'customers' ? '#FFF' : 'var(--text-primary)',
              transition: 'all 0.15s ease'
            }}
          >
            العملاء ({customers.length})
          </button>
          <button
            type="button"
            onClick={() => setView('suppliers')}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: view === 'suppliers' ? 'var(--g-600)' : 'transparent',
              color: view === 'suppliers' ? '#FFF' : 'var(--text-primary)',
              transition: 'all 0.15s ease'
            }}
          >
            الموردين ({suppliers.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
          <Loader2 style={{ width: 24, height: 24, animation: 'spin 1s linear infinite' }} />
          <span>جاري تحميل العملاء والموردين من الخادم...</span>
        </div>
      ) : view === 'customers' ? (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {customers.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
              لا يوجد عملاء مسجلين حالياً في الباك إند.
            </div>
          ) : (
            <table className="data-table" style={{ width: '100%', textAlign: 'right' }}>
              <thead>
                <tr>
                  <th>اسم العميل / المؤسسة</th>
                  <th>النوع</th>
                  <th>الرقم الضريبي VAT ID</th>
                  <th>رقم السجل التجاري CR</th>
                  <th>الجوال والمدينة</th>
                  <th>إجمالي المبيعات</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{c.name}</td>
                    <td>
                      <span className={c.customerType === 'B2B' ? 'badge-green' : 'badge-grey'}>
                        {c.customerType === 'B2B' ? 'تجاري B2B' : 'تجزئة B2C'}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>{c.vatNumber || '-'}</td>
                    <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>{c.crNumber || '-'}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{c.phone} ({c.city})</td>
                    <td style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--g-600)' }} suppressHydrationWarning>{formatSar(c.totalPurchasesSar)} ر.س</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {suppliers.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
              لا يوجد موردين مسجلين حالياً في الباك إند.
            </div>
          ) : (
            <table className="data-table" style={{ width: '100%', textAlign: 'right' }}>
              <thead>
                <tr>
                  <th>اسم المورد</th>
                  <th>الرقم الضريبي (15 رقم)</th>
                  <th>رقم السجل التجاري</th>
                  <th>التواصل والبريد</th>
                  <th>الرصيد المستحق</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((s) => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{s.companyName}</td>
                    <td style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--g-600)' }}>{s.vatNumber || '-'}</td>
                    <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>{s.crNumber || '-'}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{s.phone} • {s.email}</td>
                    <td style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--text-primary)' }} suppressHydrationWarning>{formatSar(s.balanceDueSar)} ر.س</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};


