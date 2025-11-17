import { collection, addDoc, query, where, orderBy, limit, getDocs, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Track a link click event
 * @param {string} placeId - The place document ID
 * @param {string} linkType - Type of link: 'booking' | 'social' | 'support'
 * @param {number} linkIndex - Index of the link in the array
 * @param {string} linkPlatform - Platform name (e.g., 'Booking.com', 'Instagram')
 * @param {string} linkUrl - The URL that was clicked
 */
export async function trackLinkClick(placeId, linkType, linkIndex, linkPlatform, linkUrl) {
  try {
    const analyticsRef = collection(db, 'places', placeId, 'analytics');
    await addDoc(analyticsRef, {
      linkType,
      linkIndex,
      linkPlatform,
      linkUrl,
      timestamp: serverTimestamp(),
      eventType: 'link_click'
    });
  } catch (error) {
    console.error('Error tracking link click:', error);
  }
}

/**
 * Track a profile view event
 * @param {string} placeId - The place document ID
 * @param {string} userAgent - Browser user agent
 * @param {string} referrer - Referrer URL
 */
export async function trackProfileView(placeId, userAgent = '', referrer = '') {
  try {
    const analyticsRef = collection(db, 'places', placeId, 'analytics');
    await addDoc(analyticsRef, {
      eventType: 'profile_view',
      userAgent,
      referrer,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error('Error tracking profile view:', error);
  }
}

/**
 * Get analytics for a specific time range
 * @param {string} placeId - The place document ID
 * @param {number} days - Number of days to look back (default: 30)
 * @returns {Promise<Array>} Array of analytics events
 */
export async function getAnalytics(placeId, days = 30) {
  try {
    const analyticsRef = collection(db, 'places', placeId, 'analytics');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const q = query(
      analyticsRef,
      where('timestamp', '>=', Timestamp.fromDate(startDate)),
      orderBy('timestamp', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return [];
  }
}

/**
 * Get aggregated analytics summary
 * @param {string} placeId - The place document ID
 * @param {number} days - Number of days to look back
 * @returns {Promise<Object>} Analytics summary with counts and trends
 */
export async function getAnalyticsSummary(placeId, days = 30) {
  const events = await getAnalytics(placeId, days);

  const summary = {
    totalClicks: 0,
    totalViews: 0,
    clicksByLink: {},
    clicksByDay: {},
    viewsByDay: {},
    topLinks: [],
    recentEvents: events.slice(0, 10)
  };

  events.forEach(event => {
    if (event.eventType === 'link_click') {
      summary.totalClicks++;

      // Count by link
      const linkKey = `${event.linkType}-${event.linkIndex}`;
      if (!summary.clicksByLink[linkKey]) {
        summary.clicksByLink[linkKey] = {
          platform: event.linkPlatform,
          url: event.linkUrl,
          type: event.linkType,
          count: 0
        };
      }
      summary.clicksByLink[linkKey].count++;

      // Count by day
      if (event.timestamp) {
        const date = event.timestamp.toDate().toISOString().split('T')[0];
        summary.clicksByDay[date] = (summary.clicksByDay[date] || 0) + 1;
      }
    } else if (event.eventType === 'profile_view') {
      summary.totalViews++;

      // Count by day
      if (event.timestamp) {
        const date = event.timestamp.toDate().toISOString().split('T')[0];
        summary.viewsByDay[date] = (summary.viewsByDay[date] || 0) + 1;
      }
    }
  });

  // Get top links
  summary.topLinks = Object.entries(summary.clicksByLink)
    .map(([key, value]) => value)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return summary;
}

/**
 * Get click-through rate (CTR)
 * @param {string} placeId - The place document ID
 * @param {number} days - Number of days to look back
 * @returns {Promise<number>} CTR percentage
 */
export async function getClickThroughRate(placeId, days = 30) {
  const summary = await getAnalyticsSummary(placeId, days);

  if (summary.totalViews === 0) return 0;

  return ((summary.totalClicks / summary.totalViews) * 100).toFixed(2);
}
