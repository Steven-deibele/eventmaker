'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import AppInitializer to ensure it runs on the client
const AppInitializer = dynamic(() => import('./AppInitializer'), {
  ssr: false,
});

export default function ClientAppInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppInitializer>{children}</AppInitializer>;
} 