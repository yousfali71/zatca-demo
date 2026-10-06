'use client';

import React from 'react';
import styles from './AuthCard.module.css';

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
}

export const AuthCard: React.FC<AuthCardProps> = ({ children, className = '' }) => {
  return (
    <div className={styles.cardContainer}>
      <div className={`${styles.card} ${className}`}>
        {children}
      </div>
    </div>
  );
};
