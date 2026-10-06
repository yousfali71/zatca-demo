'use client';

import React from 'react';
import { AuthHeader } from './AuthHeader';
import { AuthFooter } from './AuthFooter';
import { AuthCard } from './AuthCard';
import styles from './AuthLayout.module.css';

interface AuthLayoutProps {
  children: React.ReactNode;
  cardClassName?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, cardClassName = '' }) => {
  return (
    <div className={styles.pageContainer}>
      {/* Background Image & Blur */}
      <div className={styles.bgImage} />

      {/* Dark Emerald Tint Overlay */}
      <div className={styles.tintOverlay} />

      {/* Floating Decorative Orbs */}
      <div className={styles.orbTopRight} />
      <div className={styles.orbBottomLeft} />

      {/* Top Header Bar */}
      <AuthHeader />

      {/* Form Card Container */}
      <AuthCard className={cardClassName}>
        {children}
      </AuthCard>

      {/* Sticky Bottom Footer */}
      <AuthFooter />
    </div>
  );
};

