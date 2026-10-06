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
  title: 'zakPocket | بوابتك الذكية للفوترة الإلكترونية',
  description: 'منصتك المتكاملة لإدارة المبيعات والمشتريات والربط المباشر مع هيئة الزكاة والضريبة والجمارك (ZATCA Phase 2).',
  icons: {
    icon: '/green-zakPocket.png',
    shortcut: '/green-zakPocket.png',
    apple: '/green-zakPocket.png',
  },
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
