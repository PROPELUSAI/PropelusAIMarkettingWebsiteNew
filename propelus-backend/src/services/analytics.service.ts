/**
 * analytics.service.ts — Analytics event tracking and reporting.
 * Tracks form submissions, page views, and custom events in MongoDB.
 * Provides dashboard metrics and event queries for admin reporting.
 */
import { AnalyticsEvent } from '../db/mongodb/models/AnalyticsEvent';
import { logger } from '../utils/logger';

/**
 * Track a generic analytics event
 */
export async function trackEvent(
  eventType: string,
  eventData: Record<string, any> = {},
  meta?: { userId?: string; sessionId?: string; pageUrl?: string; userAgent?: string; ipAddress?: string }
): Promise<void> {
  try {
    await AnalyticsEvent.create({
      eventType,
      userId: meta?.userId,
      sessionId: meta?.sessionId,
      pageUrl: meta?.pageUrl,
      eventData,
      userAgent: meta?.userAgent,
      ipAddress: meta?.ipAddress,
    });
  } catch (error) {
    logger.error('Analytics tracking failed:', error);
    // Don't throw — analytics should never break the main flow
  }
}

/**
 * Track a page view
 */
export async function trackPageView(
  pageUrl: string,
  meta?: { userId?: string; sessionId?: string; userAgent?: string; ipAddress?: string }
): Promise<void> {
  await trackEvent('page_view', { pageUrl }, { ...meta, pageUrl });
}

/**
 * Track a form submission
 */
export async function trackFormSubmission(
  formType: string,
  data: Record<string, any>
): Promise<void> {
  await trackEvent('form_submission', { formType, ...data });
}

/**
 * Get events by type within a date range
 */
export async function getEventsByType(
  eventType: string,
  startDate?: Date,
  endDate?: Date
) {
  const query: Record<string, any> = { eventType };
  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) query.timestamp.$gte = startDate;
    if (endDate) query.timestamp.$lte = endDate;
  }
  return AnalyticsEvent.find(query).sort({ timestamp: -1 }).limit(1000);
}

/**
 * Get dashboard metrics
 */
export async function getDashboardMetrics(days = 30) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const [totalEvents, eventsByType, dailyCounts] = await Promise.all([
    AnalyticsEvent.countDocuments({ timestamp: { $gte: since } }),
    AnalyticsEvent.aggregate([
      { $match: { timestamp: { $gte: since } } },
      { $group: { _id: '$eventType', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    AnalyticsEvent.aggregate([
      { $match: { timestamp: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  return {
    totalEvents,
    eventsByType: Object.fromEntries(eventsByType.map((e) => [e._id, e.count])),
    dailyCounts: dailyCounts.map((d) => ({ date: d._id, count: d.count })),
    period: `${days} days`,
  };
}

export const analyticsService = {
  trackEvent,
  trackPageView,
  trackFormSubmission,
  getEventsByType,
  getDashboardMetrics,
};
