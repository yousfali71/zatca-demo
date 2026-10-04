'use client';

import React from 'react';
import { SignupWizard } from '../../components/SignupWizard';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Building2 } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: '100vh', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
      {/* ── Background Image & Blur ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: 'url(/auth-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(6px) brightness(0.68) saturate(1.1)',
        transform: 'scale(1.05)',
      }} />

      {/* ── Dark Emerald Tint Overlay ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'linear-gradient(135deg, rgba(0,26,12,0.72) 0%, rgba(0,55,25,0.60) 50%, rgba(0,95,45,0.48) 100%)',
      }} />

      {/* ── Top Header Bar for Desktop ── */}
      <header
        dir="ltr"
        className="w-full absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 sm:px-12 py-6"
      >
        {/* Top Left: Logo + zakPocket text */}
        <div className="flex items-center gap-3.5">
          <img
            src="/white-zakPocket.png"
            alt="zakPocket Logo"
            className="h-9 md:h-11 w-auto object-contain drop-shadow-md"
          />
          <span className="text-2xl md:text-3xl font-black tracking-tight text-white font-sans drop-shadow-md">
            zak<span className="text-emerald-400">Pocket</span>
          </span>
        </div>

        {/* Top Right: Tagline */}
        <div dir="rtl" className="hidden sm:block text-right">
          <span className="text-white text-xs md:text-sm font-bold tracking-wide drop-shadow-md">
            ربط المنشآت السعودية مع هيئة الزكاة والضريبة والجمارك
          </span>
        </div>
      </header>

      {/* Mobile tagline */}
      <div className="sm:hidden relative z-10 mb-4 text-center px-4 pt-16">
        <p className="text-xs font-semibold text-white drop-shadow inline-block">
          ربط المنشآت السعودية مع هيئة الزكاة والضريبة والجمارك
        </p>
      </div>

      {/* ── Form Card (Sharp Corners) ── */}
      <div className="relative z-10 w-full max-w-lg px-4 my-8">
        <div
          style={{
            background: 'rgba(255,255,255,0.96)',
            backdropFilter: 'blur(24px) saturate(1.4)',
            border: '1px solid rgba(255,255,255,0.90)',
            borderTop: '4px solid #006C35',
            borderRadius: 0,
            boxShadow: '0 24px 64px rgba(0,20,10,0.35), 0 2px 8px rgba(0,0,0,0.10)',
          }}
          className="py-8 px-6 sm:px-10"
        >
          <SignupWizard
            onSuccess={() => router.push('/')}
            onSwitchToLogin={() => router.push('/login')}
          />
        </div>
      </div>

      {/* ── Footer sticking to bottom of view screen ── */}
      <footer
        dir="ltr"
        style={{
          position: 'absolute',
          bottom: 16,
          left: 0,
          right: 0,
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
        className="text-sm md:text-base font-semibold text-white/90 drop-shadow-md tracking-wide"
      >
        <span>made by</span>
        <img
          src="/whiteLogo.png"
          alt="Orqeva Logo"
          className="h-6 md:h-7 w-auto object-contain drop-shadow"
        />
        <span className="font-extrabold text-white tracking-wider">Orqeva</span>
        <span className="text-white/80 font-medium">2026</span>
      </footer>
    </div>
  );
}
