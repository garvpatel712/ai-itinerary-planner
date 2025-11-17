import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    // Simple test endpoint to verify admin access
    return NextResponse.json({
      message: 'Admin API is working',
      timestamp: new Date().toISOString(),
      test: true
    })
  } catch (error) {
    console.error('Test API error:', error)
    return NextResponse.json({ 
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}