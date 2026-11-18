import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AppShell } from '@/components/AppShell';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://learn-dsa-silk.vercel.app'),
  title: 'DSA Patterns | Master DSA Without Watching 500 Videos',
  description:
    'Learn Data Structures & Algorithms through core algorithmic patterns, deep intuitions, step-by-step walkthroughs, and verified live LeetCode sync.',
  icons: {
    icon: [
      { url: '/favicon.ico?v=4' },
      { url: '/favicon.png?v=4', type: 'image/png' },
      { url: '/favicon-32x32.png?v=4', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico?v=4',
    apple: [
      { url: '/apple-touch-icon.png?v=4', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'DSA Patterns | Master DSA Without Watching 500 Videos',
    description:
      'Learn Data Structures & Algorithms through core algorithmic patterns, deep intuitions, step-by-step walkthroughs, and verified live LeetCode sync.',
    images: [
      {
        url: '/images/logo.png',
        width: 512,
        height: 512,
        alt: 'DSA Patterns Logo',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'DSA Patterns | Master DSA Without Watching 500 Videos',
    description:
      'Learn Data Structures & Algorithms through core algorithmic patterns, deep intuitions, step-by-step walkthroughs, and verified live LeetCode sync.',
    images: ['/images/logo.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased bg-stone-50 dark:bg-zinc-950 text-stone-900 dark:text-zinc-100 min-h-screen overflow-x-hidden">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
