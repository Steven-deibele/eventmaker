import { NextResponse } from 'next/server';
import { checkAppReadiness } from '../../../../config/init';

/**
 * API endpoint for system initialization
 * GET /api/system/init - checks system status and readiness
 */
export async function GET() {
  try {
    // Check system readiness
    const status = await checkAppReadiness();
    
    // Return status information
    return NextResponse.json({
      status: 'success',
      data: {
        ready: status.ready,
        checks: {
          database: status.database ? 'connected' : 'disconnected',
          environment: status.environment ? 'configured' : 'missing-config',
        },
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('System initialization API error:', error);
    
    // Return error response
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to initialize system',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
} 