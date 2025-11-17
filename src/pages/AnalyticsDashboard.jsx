import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth';
import { getAnalyticsSummary, getClickThroughRate } from '../utils/analytics';
import { BarChart2, TrendingUp, Eye, MousePointer, Calendar, ArrowLeft } from 'lucide-react';

const AnalyticsDashboard = () => {
  const { placeId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [place, setPlace] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [ctr, setCtr] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState(30); // days

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      setLoading(true);
      try {
        // Fetch place data
        const placeRef = doc(db, 'places', placeId);
        const placeSnap = await getDoc(placeRef);

        if (!placeSnap.exists()) {
          setError('Place not found');
          return;
        }

        const placeData = placeSnap.data();

        // Check ownership
        if (placeData.userId !== user.uid) {
          setError('Unauthorized access');
          return;
        }

        setPlace({ id: placeSnap.id, ...placeData });

        // Fetch analytics
        const analyticsData = await getAnalyticsSummary(placeId, timeRange);
        setAnalytics(analyticsData);

        const ctrValue = await getClickThroughRate(placeId, timeRange);
        setCtr(ctrValue);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [placeId, user, navigate, timeRange]);

  const handleTimeRangeChange = (days) => {
    setTimeRange(days);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse text-gray-500">Loading analytics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
          <p className="text-lg text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  // Prepare chart data
  const days = [];
  const clicksData = [];
  const viewsData = [];

  for (let i = timeRange - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    days.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    clicksData.push(analytics.clicksByDay[dateStr] || 0);
    viewsData.push(analytics.viewsByDay[dateStr] || 0);
  }

  const maxValue = Math.max(...clicksData, ...viewsData, 1);

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Back to dashboard"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
                <p className="text-gray-600 mt-1">{place?.name}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleTimeRangeChange(7)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === 7
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                7 days
              </button>
              <button
                onClick={() => handleTimeRangeChange(30)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === 30
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                30 days
              </button>
              <button
                onClick={() => handleTimeRangeChange(90)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === 90
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                90 days
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.totalViews}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.totalClicks}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <MousePointer className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Click-Through Rate</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{ctr}%</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Time Period</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{timeRange}d</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Views and Clicks Over Time */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-6">
              <BarChart2 className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Views & Clicks Over Time</h2>
            </div>
            <div className="space-y-4">
              {days.map((day, index) => (
                <div key={day} className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 w-16">{day}</span>
                  <div className="flex-1 flex gap-1">
                    <div className="relative flex-1">
                      <div
                        className="bg-blue-500 h-6 rounded transition-all"
                        style={{ width: `${(viewsData[index] / maxValue) * 100}%`, minWidth: viewsData[index] > 0 ? '20px' : '0' }}
                      >
                        {viewsData[index] > 0 && (
                          <span className="absolute inset-0 flex items-center justify-center text-xs text-white font-medium">
                            {viewsData[index]}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="relative flex-1">
                      <div
                        className="bg-green-500 h-6 rounded transition-all"
                        style={{ width: `${(clicksData[index] / maxValue) * 100}%`, minWidth: clicksData[index] > 0 ? '20px' : '0' }}
                      >
                        {clicksData[index] > 0 && (
                          <span className="absolute inset-0 flex items-center justify-center text-xs text-white font-medium">
                            {clicksData[index]}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Views</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Clicks</span>
              </div>
            </div>
          </div>

          {/* Top Performing Links */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-6">
              <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Top Performing Links</h2>
            </div>
            <div className="space-y-4">
              {analytics.topLinks.length > 0 ? (
                analytics.topLinks.map((link, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{link.platform}</p>
                      <p className="text-xs text-gray-500 capitalize">{link.type}</p>
                    </div>
                    <div className="ml-4 flex items-center">
                      <span className="text-lg font-bold text-blue-600">{link.count}</span>
                      <span className="text-xs text-gray-500 ml-1">clicks</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MousePointer className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No link clicks yet</p>
                  <p className="text-sm mt-1">Share your profile to start tracking clicks</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-3">
            {analytics.recentEvents.length > 0 ? (
              analytics.recentEvents.map((event, index) => (
                <div key={index} className="flex items-center justify-between p-3 border-l-4 border-blue-500 bg-gray-50 rounded">
                  <div className="flex items-center">
                    {event.eventType === 'link_click' ? (
                      <MousePointer className="w-4 h-4 text-blue-600 mr-3" />
                    ) : (
                      <Eye className="w-4 h-4 text-green-600 mr-3" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {event.eventType === 'link_click'
                          ? `${event.linkPlatform} link clicked`
                          : 'Profile viewed'}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">{event.linkType}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {event.timestamp?.toDate().toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BarChart2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No activity yet</p>
                <p className="text-sm mt-1">Activity will appear here when visitors interact with your profile</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
