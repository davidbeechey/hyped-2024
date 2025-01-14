import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Providers from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HYPED 2024 - App',
  description: 'View realtime data for our pod... Poddington',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
     
      <body className={`${inter.className} dark:bg-black bg-white`}>
        <Providers>{children}</Providers>
       
      </body>
    </html>
  );
}
