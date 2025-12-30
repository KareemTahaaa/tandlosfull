import type { Metadata } from 'next';
import { Outfit, Oswald } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import { CartProvider } from '@/context/CartContext';
import GoogleAnalytics from '@/components/GoogleAnalytics';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-oswald',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Tandlos | Streetwear',
  description: 'Premium streetwear for the authentic.',
};

import NavigationWrapper from '@/components/NavigationWrapper';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${oswald.variable}`} suppressHydrationWarning>
      <body>
        <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''} />
        <CartProvider>
          <NavigationWrapper>
            {children}
          </NavigationWrapper>
        </CartProvider>
      </body>
    </html>
  );
}
