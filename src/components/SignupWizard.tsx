'use client';

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, UserCheck, CheckCircle2, Zap } from 'lucide-react';

interface SignupWizardProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

/**
 * PHASE 1 — account creation only.
 * Fields mirror swagger POST /auth/register: name, email, password, phone (optional), roleId.
 * ZATCA linking is a separate, later phase (activated from the sidebar after login).
 */
export const SignupWizard: React.FC<SignupWizardProps> = ({ onSuccess, onSwitchToLogin }) => {
  const { registerAccount } = useAuth();

  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (formData.name.trim().length < 2) return 'يرجى إدخال الاسم الكامل';
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) return 'يرجى إدخال بريد إلكتروني صحيح';
    if (formData.password.length < 6) return 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const err = validate();
    if (err) { setErrorMsg(err); return; }
    setLoading(true);
    try {
      await registerAccount({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        password: formData.password
      });
      setDone(true);
      if (onSuccess) setTimeout(onSuccess, 1500);
    } catch (e: any) {
      setErrorMsg(e?.message || 'حدث خطأ أثناء إنشاء الحساب');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="text-center py-10 space-y-4 animate-scale-in">
        <div
          className="w-16 h-16 rounded-full mx-auto flex items-center justify-center"
          style={{ background: '#EEFAF3', border: '2px solid #A3DEB9' }}
        >
          <CheckCircle2 className="w-9 h-9" style={{ color: '#006C35' }} />
        </div>
        <h2 className="text-2xl font-black text-slate-900">تم إنشاء حسابك بنجاح!</h2>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          يمكنك الآن استخدام النظام. لتفعيل الفوترة الإلكترونية، افتح <b>ربط ZATCA</b> من القائمة الجانبية في أي وقت.
        </p>
        <div
          className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full"
          style={{ background: '#FFF8E1', color: '#8A6100', border: '1px solid #F2D27A' }}
        >
          <Zap className="w-4 h-4" />
          <span>ZATCA · يحتاج تفعيل</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-black text-slate-900">إنشاء حساب جديد</h1>
        <p className="text-xs text-slate-500 mt-1">
          بيانات الحساب فقط — ربط ZATCA يتم لاحقاً بعد الدخول
        </p>
      </div>

      {errorMsg && (
        <div
          className="mb-5 p-3.5 rounded-xl text-sm flex items-center justify-between"
          style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C' }}
        >
          <span>{errorMsg}</span>
          <button type="button" onClick={() => setErrorMsg(null)} className="font-bold text-sm">✕</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="pb-2 border-b" style={{ borderColor: '#E5EDE9' }}>
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <UserCheck className="w-4 h-4" style={{ color: '#006C35' }} />
            بيانات الحساب
          </h3>
        </div>

        <div>
          <label className="label">الاسم الكامل *</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange}
            placeholder="مثال: أحمد علي" className="input" />
        </div>
        <div>
          <label className="label">البريد الإلكتروني *</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange}
            placeholder="owner@company.sa" className="input" style={{ direction: 'ltr', textAlign: 'left' }} />
        </div>
        <div>
          <label className="label">رقم الجوال (اختياري)</label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
            placeholder="+966501234567" className="input" style={{ direction: 'ltr', textAlign: 'left' }} />
        </div>
        <div>
          <label className="label">كلمة المرور *</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange}
            placeholder="••••••••••••" className="input" />
        </div>



        <div
          className="flex items-start gap-2 p-3 rounded-xl text-[11px]"
          style={{ background: '#F3F5F4', border: '1px solid #E5EDE9', color: '#4A6357' }}
        >
          <ShieldCheck className="w-4 h-4 flex-shrink-0" style={{ color: '#006C35' }} />
          <span>لن نطلب السجل التجاري أو الرقم الضريبي أو OTP الآن — ستُدخلها عند تفعيل ZATCA لاحقاً.</span>
        </div>

        <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid #E5EDE9' }}>
          <button type="button" onClick={onSwitchToLogin} className="text-xs font-semibold" style={{ color: '#4A6357' }}>
            لديك حساب؟ تسجيل الدخول
          </button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? <span>جاري إنشاء الحساب...</span> : (
              <>
                <span>إنشاء الحساب</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
