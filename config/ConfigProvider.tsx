'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { config } from './setup';

// Define the AppConfig type
type AppConfig = typeof config & {
  isReady: boolean;
  isInitialized: boolean;
};

// Create an initial state with default values
const initialConfig: AppConfig = {
  ...config,
  isReady: false,
  isInitialized: false,
};

// Create the context
const ConfigContext = createContext<{
  config: AppConfig;
  setReady: (isReady: boolean) => void;
}>({
  config: initialConfig,
  setReady: () => {},
});

// Custom hook to use the config
export const useConfig = () => useContext(ConfigContext);

// Provider component
export function ConfigProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const [appConfig, setAppConfig] = useState<AppConfig>(initialConfig);
  
  // Function to mark app as ready
  const setReady = (isReady: boolean) => {
    setAppConfig(prev => ({
      ...prev,
      isReady,
    }));
  };
  
  // Initialize the app on mount
  useEffect(() => {
    const initApp = async () => {
      try {
        // In a real implementation, you would call the initialization API here
        // For now, we'll just simulate the initialization process
        console.log('🔄 Initializing application...');
        
        // Simulate API call to check readiness
        // In production: const response = await fetch('/api/system/init');
        const isReady = true; // Simulated response for test site
        
        // Update state with initialization results
        setAppConfig(prev => ({
          ...prev,
          isReady,
          isInitialized: true,
        }));
        
        console.log('✅ Application initialized');
      } catch (error) {
        console.error('❌ Failed to initialize app:', error);
        setAppConfig(prev => ({
          ...prev,
          isReady: false,
          isInitialized: true,
        }));
      }
    };
    
    if (!appConfig.isInitialized) {
      initApp();
    }
  }, [appConfig.isInitialized]);
  
  // Provide the config to all children
  return (
    <ConfigContext.Provider value={{ config: appConfig, setReady }}>
      {children}
    </ConfigContext.Provider>
  );
} 