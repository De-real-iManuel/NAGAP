import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse?.json(
    {
      status: 'ok',
      service: 'NAGAP Portal API',
      version: '1.0.0',
      timestamp: new Date()?.toISOString(),
      environment: process.env.NODE_ENV ?? 'development',
    },
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}