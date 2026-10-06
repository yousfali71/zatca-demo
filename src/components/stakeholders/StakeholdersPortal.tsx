'use client';

import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Customer, Supplier } from '../../types/zatcaErp';
import { apiClient } from '../../services/apiClient';

import { StakeholdersHeader } from './StakeholdersHeader';
import { CustomersTable } from './CustomersTable';
import { SuppliersTable } from './SuppliersTable';

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
      <StakeholdersHeader
        view={view}
        onViewChange={setView}
        customersCount={customers.length}
        suppliersCount={suppliers.length}
      />

      {loading ? (
        <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
          <Loader2 style={{ width: 24, height: 24, animation: 'spin 1s linear infinite' }} />
          <span>جاري تحميل العملاء والموردين من الخادم...</span>
        </div>
      ) : view === 'customers' ? (
        <CustomersTable customers={customers} />
      ) : (
        <SuppliersTable suppliers={suppliers} />
      )}
    </div>
  );
};
