import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProviders } from './providers';
import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import AppInitializer to ensure it runs on the client
const AppInitializer = dynamic(() => import('./components/AppInitializer'), {
  ssr: false,
});

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
          <AppInitializer>
            {children}
          </AppInitializer>
        </AppProviders>
      </body>
    </html>
  );
} 