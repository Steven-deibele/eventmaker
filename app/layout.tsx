import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProviders } from './providers';
import React from 'react';
import ClientAppInitializer from './components/ClientAppInitializer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EventMaker - Easily Create and Join Events',
  description: 'A modern platform for organizing and attending events with simple email-based authentication',
  keywords: ['events', 'event management', 'event platform', 'event organizer'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProviders>
          <ClientAppInitializer>
            {children}
          </ClientAppInitializer>
        </AppProviders>
      </body>
    </html>
  );
} 