'use client';

import React from 'react';
import styles from './AuthHeader.module.css';

export const AuthHeader: React.FC = () => {
  return (
    <>
      <header dir="ltr" className={styles.header}>
        {/* Top Left: Logo + zakPocket text */}
        <div className={styles.brandWrap}>
          <img
            src="/white-zakPocket.png"
            alt="zakPocket Logo"
            className={styles.logo}
          />
          <span className={styles.brandTitle}>
            zak<span className={styles.highlight}>Pocket</span>
          </span>
        </div>

        {/* Top Right: Tagline */}
        <div dir="rtl" className={styles.taglineDesktop}>
          <span className={styles.taglineText}>
            ربط المنشآت السعودية مع هيئة الزكاة والضريبة والجمارك
          </span>
        </div>
      </header>

      {/* Mobile tagline */}
      <div className={styles.taglineMobile}>
        <p className={styles.taglineText}>
          ربط المنشآت السعودية مع هيئة الزكاة والضريبة والجمارك
        </p>
      </div>
    </>
  );
};
