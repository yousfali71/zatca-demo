'use client';

import React from 'react';
import styles from './AuthDivider.module.css';

interface AuthDividerProps {
  label?: string;
}

export const AuthDivider: React.FC<AuthDividerProps> = ({ label = 'أو بالبريد الإلكتروني' }) => {
  return (
    <div className={styles.divider}>
      <div className={styles.line} />
      <span className={styles.text}>{label}</span>
      <div className={styles.line} />
    </div>
  );
};
