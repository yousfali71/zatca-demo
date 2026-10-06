'use client';

import React from 'react';
import styles from './AuthFooter.module.css';

export const AuthFooter: React.FC = () => {
  return (
    <footer dir="ltr" className={styles.footer}>
      <span>made by</span>
      <img
        src="/whiteLogo.png"
        alt="Orqeva Logo"
        className={styles.companyLogo}
      />
      <span className={styles.companyName}>Orqeva</span>
      <span className={styles.year}>2026</span>
    </footer>
  );
};
