import React, { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ExternalLink, Edit3, Link as LinkIcon, QrCode, BarChart2 } from 'lucide-react';
import QRCodeModal from './QRCodeModal';

const PlaceCard = ({ place }) => {
  const [showQRModal, setShowQRModal] = useState(false);

  // Count active links - ensure we're always filtering arrays
  const activeBookingLinks = Array.isArray(place.bookingLinks)
    ? place.bookingLinks.filter(link => link.isActive)?.length
    : 0;

  const activeSocialLinks = Array.isArray(place.socialLinks)
    ? place.socialLinks.filter(link => link.isActive)?.length
    : 0;

  const totalActiveLinks = activeBookingLinks + activeSocialLinks;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-indigo-200 transform hover:scale-[1.02]">
      {/* Header with gradient */}
      <div className="relative h-32" style={{
        background: place.color
          ? `linear-gradient(135deg, ${place.color} 0%, ${place.backgroundColor || '#ffffff'} 100%)`
          : 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)'
      }}>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white drop-shadow-lg px-4">
              {place.name || 'Place'}
            </h3>
          </div>
        </div>

        {/* Status badge */}
        {place.isActive === false && (
          <div className="absolute top-3 right-3 px-3 py-1 bg-gray-900/80 backdrop-blur-sm text-white text-xs font-medium rounded-full">
            Inactive
          </div>
        )}
        {place.isActive !== false && (
          <div className="absolute top-3 right-3 px-3 py-1 bg-green-500/80 backdrop-blur-sm text-white text-xs font-medium rounded-full flex items-center">
            <span className="w-1.5 h-1.5 bg-white rounded-full mr-1.5 animate-pulse"></span>
            Live
          </div>
        )}
      </div>

      <div className="p-6">
        {/* Location */}
        {place.location && (
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <MapPin className="w-4 h-4 mr-2 text-indigo-500" />
            <span className="truncate">{place.location}</span>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
          <div className="flex items-center text-sm">
            <LinkIcon className="w-4 h-4 mr-2 text-indigo-500" />
            <span className="font-semibold text-gray-700">{totalActiveLinks}</span>
            <span className="text-gray-500 ml-1">active link{totalActiveLinks !== 1 ? 's' : ''}</span>
          </div>

          {place.customDomain && (
            <div className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Custom domain
            </div>
          )}
        </div>

        {/* Platform badges */}
        {Array.isArray(place.bookingLinks) && place.bookingLinks.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Platforms</p>
            <div className="flex flex-wrap gap-2">
              {place.bookingLinks.filter(link => link.isActive).slice(0, 3).map((link, index) => (
                <div key={index} className="inline-flex items-center bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 text-xs px-3 py-1.5 rounded-lg font-medium border border-indigo-100">
                  {link.icon ? (
                    <img src={link.icon} alt={link.platform} className="w-3.5 h-3.5 mr-1.5" />
                  ) : null}
                  <span>{link.platform}</span>
                </div>
              ))}
              {activeBookingLinks > 3 && (
                <div className="inline-flex items-center bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-lg font-medium">
                  +{activeBookingLinks - 3} more
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3 mt-5">
          <div className="flex gap-3">
            <Link
              to={`/place/edit/${place.id}`}
              className="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit
            </Link>
            <Link
              to={`/p/${place.id}`}
              className="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-white border-2 border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View
            </Link>
          </div>
          <div className="flex gap-3">
            <Link
              to={`/analytics/${place.id}`}
              className="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-green-600 to-teal-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              <BarChart2 className="w-4 h-4 mr-2" />
              Analytics
            </Link>
            <button
              onClick={() => setShowQRModal(true)}
              className="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              <QrCode className="w-4 h-4 mr-2" />
              QR Code
            </button>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        placeId={place.id}
        placeName={place.name}
      />
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(PlaceCard);