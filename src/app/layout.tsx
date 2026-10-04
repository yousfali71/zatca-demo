import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-cairo',
});

export const metadata: Metadata = {
  title: 'منظومة ZATCA TaxFlow - منصة حساب وحسابات الضرائب والفوترة الإلكترونية في السعودية',
  description: 'منظومة متكاملة لربط المنشآت والشركات السعودية مع هيئة الزكاة والضريبة والجمارك (ZATCA Phase 2) وإدارة المبيعات والمخزون والإقرارات الضريبية.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="h-full">
      <body
        className={`${cairo.variable} font-cairo antialiased h-full`}
        style={{ background: '#F3F5F4', color: '#0D2118', overflowX: 'hidden' }}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
