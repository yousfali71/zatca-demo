'use client';

import React from 'react';
import { SignupWizard } from '../../components/SignupWizard';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Building2 } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-xl ribbon-gradient-emerald text-white flex items-center justify-center shadow-lg shadow-emerald-900/20 font-black text-xl">
            Z
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900">
            ZATCA <span className="text-emerald-700">TaxFlow</span>
          </span>
        </div>
        <p className="text-xs text-slate-500 font-semibold">
          منظومة ربط وتكامل أصحاب الأعمال مع هيئة الزكاة والضريبة والجمارك بالمملكة العربية السعودية
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-3xl">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 sm:rounded-2xl border border-slate-200/80 sm:px-10">
          <SignupWizard
            onSuccess={() => router.push('/')}
            onSwitchToLogin={() => router.push('/login')}
          />
        </div>
      </div>
    </div>
  );
}
