import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { ThemeProvider } from './components/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TapPay - Send Crypto via Telegram',
  description: 'Send crypto as easy as sending a message—just tap their Telegram username.',
  openGraph: {
    title: 'TapPay - Send Crypto via Telegram',
    description: 'Send crypto as easy as sending a message—just tap their Telegram username.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
