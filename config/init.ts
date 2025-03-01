/**
 * Application Initialization Script
 * This file is responsible for initializing the application on first load
 * It runs necessary setup tasks and ensures required services are available
 */

import { PrismaClient } from '@prisma/client';
import { initializeApp, config } from './setup';

// Database client for initialization tasks
const prisma = new PrismaClient();

/**
 * Performs initial database checks and setups
 */
async function setupDatabase() {
  try {
    // Check if the database exists and has tables
    const tableCount = await prisma.$queryRaw`
      SELECT count(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    console.log('🔍 Database tables check completed');
    
    // Check if we need to seed the database
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      console.log('🌱 No users found. Database may need seeding.');
      
      // In a real app, you might auto-seed initial data here
      // For a test app, we'll log a message
      console.log('ℹ️ For a test instance, you can manually seed data or create initial users through the UI');
    } else {
      console.log(`✅ Database has ${userCount} users`);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Database setup error:', error);
    return false;
  }
}

/**
 * Checks application readiness by verifying all required services
 */
async function checkAppReadiness() {
  const checks = {
    database: false,
    environment: false,
    ready: false
  };
  
  try {
    // Initialize the app and get status
    const { ready } = await initializeApp();
    checks.ready = ready;
    
    // Detailed database check
    checks.database = await setupDatabase();
    
    // Check environment variables
    checks.environment = [
      'DATABASE_URL',
      'AUTH_SECRET'
    ].every(key => !!process.env[key]);
    
    // Log app readiness status
    if (checks.ready) {
      console.log('✅ Application is ready to use');
    } else {
      console.warn('⚠️ Application is not fully configured. Some features may not work properly.');
    }
    
    return checks;
  } catch (error) {
    console.error('❌ Application readiness check failed:', error);
    return checks;
  } finally {
    await prisma.$disconnect();
  }
}

// Only export what's needed for external modules
export {
  checkAppReadiness,
  config
}; 