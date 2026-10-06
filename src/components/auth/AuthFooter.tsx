'use client';

import React from 'react';
import styles from './AuthFooter.module.css';

export const AuthFooter: React.FC = () => {
  return (
    <footer dir="ltr" className={styles.footer}>
      <div className={styles.premiumBadge}>
        <span className={styles.madeByText}>Powered by</span>
        <div className={styles.logoGroup}>
          <img
            src="/whiteLogo.png"
            alt="Orqeva Logo"
            className={styles.companyLogo}
          />
          <span className={styles.companyName}>Orqeva</span>
        </div>
        <div className={styles.divider} />
        <span className={styles.year}>&copy; 2026</span>
      </div>
    </footer>
  );
};
