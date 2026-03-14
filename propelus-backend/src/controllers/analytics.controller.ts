/**
 * analytics.controller.ts — Analytics event tracking and metrics endpoints.
 * Public: track events. Admin: query events by type and view dashboard metrics.
 */
import { Request, Response } from 'express';import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { analyticsService } from '../services/analytics.service';
import { AuthRequest } from '../types';

/**
 * Track an analytics event (public)
 */
export const trackEvent = asyncHandler(async (req: Request, res: Response) => {
  const { event_type, event_data } = req.body;

  await analyticsService.trackEvent(event_type, event_data || {}, {
    sessionId: req.headers['x-session-id'] as string,
    userAgent: req.headers['user-agent'],
    ipAddress: req.ip,
  });

  ApiResponse.created(res, null, 'Event tracked');
});

/**
 * Get events by type (admin)
 */
export const getEventsByType = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { eventType } = req.params;
  const { start_date, end_date } = req.query;

  const events = await analyticsService.getEventsByType(
    eventType as string,
    start_date ? new Date(start_date as string) : undefined,
    end_date ? new Date(end_date as string) : undefined
  );

  ApiResponse.success(res, events);
});

/**
 * Get dashboard metrics (admin)
 */
export const getDashboardMetrics = asyncHandler(async (req: AuthRequest, res: Response) => {
  const days = parseInt(req.query.days as string) || 30;
  const metrics = await analyticsService.getDashboardMetrics(days);

  ApiResponse.success(res, metrics);
});
