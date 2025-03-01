/**
 * EventMaker Application Setup Configuration
 * This file handles initial setup and configuration when the application is first loaded
 */

import { PrismaClient } from '@prisma/client';
import { type Session } from 'next-auth';

// Initialize Prisma client
const prisma = new PrismaClient();

// Environment configuration with defaults
export const config = {
  // Application
  appName: process.env.APP_NAME || 'EventMaker',
  environment: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  
  // Database
  databaseUrl: process.env.DATABASE_URL,
  
  // Authentication
  authSecret: process.env.AUTH_SECRET,
  
  // Email
  emailServer: {
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT) || 587,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  },
  emailFrom: process.env.EMAIL_FROM || 'noreply@eventmaker.example.com',
  
  // Features
  enablePublicRegistration: process.env.ENABLE_PUBLIC_REGISTRATION === 'true' || true,
  maxEventsPerUser: Number(process.env.MAX_EVENTS_PER_USER) || 10,
  defaultEventCapacity: Number(process.env.DEFAULT_EVENT_CAPACITY) || 50,
};

// Check if database is connected
export async function checkDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Database connection established');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

// Utility to get current user information
export function getCurrentUser(session: Session | null) {
  return session?.user || null;
}

// Function to check if environment is properly configured
export function checkRequiredEnvironment() {
  const requiredVars = [
    'DATABASE_URL',
    'AUTH_SECRET'
  ];
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn(`⚠️ Missing required environment variables: ${missingVars.join(', ')}`);
    return false;
  }
  
  return true;
}

// Initialize application
export async function initializeApp() {
  console.log(`🚀 Starting ${config.appName} in ${config.environment} mode`);
  
  const isEnvConfigured = checkRequiredEnvironment();
  if (!isEnvConfigured) {
    console.warn('⚠️ Application may not function correctly due to missing configuration');
  }
  
  const isDatabaseConnected = await checkDatabaseConnection();
  if (!isDatabaseConnected) {
    console.error('❌ Application startup issue: Database connection failed');
  }
  
  return {
    ready: isEnvConfigured && isDatabaseConnected,
    config
  };
} 