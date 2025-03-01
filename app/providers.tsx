'use client';

import { SessionProvider } from 'next-auth/react';
import React from 'react';
import { ConfigProvider } from '../config/ConfigProvider';

// NextAuth provider for authentication
export function NextAuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}

// Combined providers wrapper for the application
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider>
      <NextAuthProvider>
        {children}
      </NextAuthProvider>
    </ConfigProvider>
  );
} 