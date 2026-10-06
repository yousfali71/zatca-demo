'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AuthLayout, SignupWizard } from '../../components/auth';

export default function SignupPage() {
  const router = useRouter();

  return (
    <AuthLayout>
      <SignupWizard
        onSuccess={() => router.push('/')}
        onSwitchToLogin={() => router.push('/login')}
      />
    </AuthLayout>
  );
}

