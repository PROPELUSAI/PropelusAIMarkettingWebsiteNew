/**
 * health.controller.ts — Health check endpoint.
 * Returns server status, uptime, and MongoDB connection state.
 * Used by Vercel/Render health checks and monitoring tools.
 */
import { Request, Response } from 'express';import mongoose from 'mongoose';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';

/**
 * Health check — tests MongoDB connection
 */
export const healthCheck = asyncHandler(async (_req: Request, res: Response) => {
  const health: Record<string, any> = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: {
      mongodb: 'disconnected',
    },
  };

  // Test MongoDB
  try {
    if (mongoose.connection.readyState === 1) {
      health.database.mongodb = 'connected';
    } else {
      health.status = 'DEGRADED';
    }
  } catch {
    health.status = 'DEGRADED';
  }

  const statusCode = health.status === 'OK' ? 200 : 503;
  ApiResponse.success(res, health, health.status, statusCode);
});
