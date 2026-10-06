'use client';

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { GoogleAuthButton } from './GoogleAuthButton';
import { AuthDivider } from './AuthDivider';
import styles from './LoginForm.module.css';

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignup }) => {
  const { login } = useAuth();
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
    } catch (err: any) {
      setError(err?.message || 'تعذّر تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Form header */}
      <div className={styles.header}>
        <h2 className={styles.title}>تسجيل الدخول</h2>
        <p className={styles.subtitle}>أدخل بيانات حسابك للدخول إلى لوحة التحكم</p>
      </div>

      {/* Google sign-in */}
      <GoogleAuthButton onError={(msg) => setError(msg)} />

      {/* Divider */}
      <AuthDivider />

      {/* Email / password form */}
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && (
          <div className={styles.errorAlert}>
            {error}
          </div>
        )}
        <div className={styles.field}>
          <label className="label">البريد الإلكتروني *</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="owner@company.sa"
            className="input"
            style={{ direction: 'ltr', textAlign: 'left', borderRadius: 0 }}
          />
        </div>
        <div className={styles.field}>
          <label className="label">كلمة المرور *</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••"
            className="input"
            style={{ borderRadius: 0 }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '13px 20px', fontSize: 13.5, borderRadius: 0, marginTop: 4 }}
        >
          {loading ? 'جاري الدخول...' : 'دخول لوحة التحكم'}
        </button>
      </form>

      {/* Sign up link */}
      <div className={styles.footerLink}>
        ليس لديك حساب؟{' '}
        <button
          type="button"
          onClick={onSwitchToSignup}
          className={styles.switchButton}
        >
          أنشئ حسابك الآن
        </button>
      </div>
    </div>
  );
};
