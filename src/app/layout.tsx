
import './globals.css';
import React from 'react';
import { Providers } from './providers';
import { Toaster } from '@/components/ui/toaster';
import { ClientLayout } from './client-layout';
import { FirebaseClientProvider } from '@/firebase';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Best of Street View</title>
        <meta
          name="description"
          content="Discover and share the best of Google Street View at bestofstreetview.com."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased overflow-hidden">
        <Providers>
          <FirebaseClientProvider>
            <ClientLayout>{children}</ClientLayout>
          </FirebaseClientProvider>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
