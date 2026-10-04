'use client';

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Building2, UserCheck } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      router.push('/');
    } catch (err: any) {
      setError(err?.message || 'تعذّر تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-xl ribbon-gradient-emerald text-white flex items-center justify-center font-black text-xl shadow-lg shadow-emerald-900/20">
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

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 sm:rounded-2xl border border-slate-200/80 sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-5 text-right">
            <div className="text-center">
              <h2 className="text-xl font-black text-slate-900">تسجيل الدخول لمنصة ZATCA</h2>
              <p className="text-xs text-slate-500 mt-0.5">أدخل البريد الإلكتروني الخاص بمالك المنشأة</p>
            </div>

            {error && (
              <div className="p-3 rounded-lg text-xs font-semibold" style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C' }}>
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">البريد الإلكتروني الرسمي *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@saudi-solutions.sa"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm dir-ltr text-right bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">كلمة المرور *</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm transition shadow-md shadow-emerald-900/10"
            >
              {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول للنظام'}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-200 text-center mt-6">
            <p className="text-xs text-slate-600">
              منشأة جديدة؟{' '}
              <Link href="/signup" className="font-bold text-emerald-700 hover:underline">
                أنشئ حسابك الآن
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
