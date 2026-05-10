import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { PageViewTracker } from '@/components/PageViewTracker';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CredMaster — AI Spend Auditor',
  description:
    'Find out where your team is wasting money ' +
    'on AI tools. Free 60-second audit. ' +
    'No login required.',
  openGraph: {
    title: 'CredMaster — AI Spend Auditor',
    description:
      'Find out where your team is wasting money ' +
      'on AI tools. Free 60-second audit.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CredMaster — AI Spend Auditor',
    description:
      'Find out where your team is wasting money ' +
      'on AI tools. Free 60-second audit.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className={inter.className}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only
                     focus:absolute focus:top-4
                     focus:left-4 focus:z-50
                     bg-brand-500 text-white
                     px-4 py-2 rounded-lg"
        >
          Skip to content
        </a>
        <PageViewTracker />
        {children}
      </body>
    </html>
  );
}
