import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from 'next-themes';
import { AppProvider } from '@/contexts/AppContext';
import { NavigationBar } from '@/components/NavigationBar';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Focusly - Gestion TDAH & HPI',
  description: 'Application mobile pour aider les personnes atteintes de TDA/TDAH et HPI à gérer leur attention, concentration et bien-être.',
  manifest: '/manifest.json',
  themeColor: '#000000',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Focusly',
  },
  icons: {
    icon: '/icon-192x192.png',
    apple: '/icon-192x192.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Focusly" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <AppProvider>
              <div className="min-h-screen bg-background text-foreground">
                {/* Contenu principal avec padding pour la navigation */}
                <main className="pb-20 min-h-screen">
                  {children}
                </main>
                
                {/* Navigation fixe en bas */}
                <NavigationBar />
              </div>
              
              {/* Notifications toast */}
              <Toaster />
            </AppProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
