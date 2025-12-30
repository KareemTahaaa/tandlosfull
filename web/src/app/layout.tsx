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
          {/* Conditionally render Navbar/Footer. 
              Ideally, we should use Route Groups (e.g. (marketing)/layout.tsx), 
              but for now we'll just hide them on the home page since it's the waiting list. 
              The Waiting List page (page.tsx) handles its own layout. 
          */}
          {/* We can't use usePathname in server component RootLayout easily without making it client or middleware. 
              Actually, simplest temporary fix: 
              We'll keep Navbar/Footer but hide them via CSS or just remove them if this is strictly a coming soon site.
              
              BETTER APPROACH: 
              Move existing layout logic to a standard-layout component and use per-page layouts? 
              No, Next.js 13 App Router nests layouts. 
              
              Let's make RootLayout simple and move Navbar/Footer to a template or specific sub-layout? 
              No, that requires moving all other pages.
              
              Let's just COMMENT OUT the Navbar/Footer for now since the WHOLE site is "Coming Soon". 
              The user said "landing screen is not available", implying they want ONLY the landing screen.
          */}

          {/* <Navbar /> */}
          <main style={{ minHeight: '100vh', padding: 0 }}>
            {children}
          </main>
          {/* <Footer /> */}
        </CartProvider>
      </body>
    </html>
  );
}
