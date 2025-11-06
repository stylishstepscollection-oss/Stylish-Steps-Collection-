import type { Metadata, Viewport } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import SessionProvider from '@/components/providers/SessionProvider';
import { ThemeProvider } from '@/components/providers/ThemeProviders';
import { Toaster } from "@/components/ui/sonner"
import PWAInstallPrompt from '@/components/shared/PWAInstallPrompt';
import OfflineIndicator from '@/components/shared/OfflineIndicator';
import SplashScreen from '@/components/shared/SplashScreen';

const inter = Inter({ subsets: ['latin'] });


export const metadata: Metadata = {
  title: 'Stylish Style Collection Collection',
  description: 'Step into Style - Premium clothing and accessories',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Stylish Style Collection',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'Stylish Style Collection Collection',
    title: 'Stylish Style Collection Collection',
    description: 'Step into Style - Premium clothing and accessories',
  },
  twitter: {
    card: 'summary',
    title: 'Stylish Style Collection Collection',
    description: 'Step into Style - Premium clothing and accessories',
  },
};

export const viewport: Viewport = {
  themeColor: '#D4AF37',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
     <html lang="en" suppressHydrationWarning>
      <head>
       <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={inter.className}>
       <SplashScreen />

        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <OfflineIndicator />

            <Toaster />
                        <PWAInstallPrompt />

            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
