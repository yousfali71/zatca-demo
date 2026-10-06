'use client';

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, UserCheck, CheckCircle2, Zap } from 'lucide-react';
import styles from './SignupWizard.module.css';

interface SignupWizardProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

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
      <div className={styles.successCard}>
        <div className={styles.successIcon}>
          <CheckCircle2 className="w-9 h-9" style={{ color: '#006C35' }} />
        </div>
        <h2 className={styles.successTitle}>تم إنشاء حسابك بنجاح!</h2>
        <p className={styles.successText}>
          يمكنك الآن استخدام النظام. لتفعيل الفوترة الإلكترونية، افتح <b>ربط ZATCA</b> من القائمة الجانبية في أي وقت.
        </p>
        <div className={styles.badge}>
          <Zap className="w-4 h-4" />
          <span>ZATCA · يحتاج تفعيل</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1 className={styles.title}>إنشاء حساب جديد</h1>
        <p className={styles.subtitle}>
          بيانات الحساب فقط — ربط ZATCA يتم لاحقاً بعد الدخول
        </p>
      </div>

      {errorMsg && (
        <div className={styles.errorAlert}>
          <span>{errorMsg}</span>
          <button type="button" onClick={() => setErrorMsg(null)} className="font-bold text-sm">✕</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>
            <UserCheck className="w-4 h-4" style={{ color: '#006C35' }} />
            بيانات الحساب
          </h3>
        </div>

        <div>
          <label className="label">الاسم الكامل *</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange}
            placeholder="مثال: أحمد علي" className="input" style={{ borderRadius: 0 }} />
        </div>
        <div>
          <label className="label">البريد الإلكتروني *</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange}
            placeholder="owner@company.sa" className="input" style={{ direction: 'ltr', textAlign: 'left', borderRadius: 0 }} />
        </div>
        <div>
          <label className="label">رقم الجوال (اختياري)</label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
            placeholder="+966501234567" className="input" style={{ direction: 'ltr', textAlign: 'left', borderRadius: 0 }} />
        </div>
        <div>
          <label className="label">كلمة المرور *</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange}
            placeholder="••••••••••••" className="input" style={{ borderRadius: 0 }} />
        </div>

        <div className={styles.infoNotice}>
          <ShieldCheck className="w-4 h-4 flex-shrink-0" style={{ color: '#006C35' }} />
          <span>لن نطلب السجل التجاري أو الرقم الضريبي أو OTP الآن — ستُدخلها عند تفعيل ZATCA لاحقاً.</span>
        </div>

        <div className={styles.actionRow}>
          <button type="button" onClick={onSwitchToLogin} className={styles.switchButton}>
            لديك حساب؟ تسجيل الدخول
          </button>
          <button type="submit" disabled={loading} className="btn-primary" style={{ borderRadius: 0 }}>
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
