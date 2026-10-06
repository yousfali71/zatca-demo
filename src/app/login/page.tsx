'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AuthLayout, LoginForm } from '../../components/auth';

export default function LoginPage() {
  const router = useRouter();

  return (
    <AuthLayout>
      <LoginForm
        onSwitchToSignup={() => router.push('/signup')}
      />
    </AuthLayout>
  );
}
