import React from 'react';
import { Link } from 'react-router-dom';

const PropertyCard = ({ property }) => {
  // Count active links - ensure we're always filtering arrays
  const activeBookingLinks = Array.isArray(property.bookingLinks) 
    ? property.bookingLinks.filter(link => link.isActive)?.length 
    : 0;
    
  const activeSocialLinks = Array.isArray(property.socialLinks) 
    ? property.socialLinks.filter(link => link.isActive)?.length 
    : 0;
    
  const totalActiveLinks = activeBookingLinks + activeSocialLinks;
  
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="relative h-48">
        <div className="w-full h-full bg-gray-200 flex justify-center items-center">
          <p className="text-gray-400">{property.name || 'Property'}</p>
        </div>
        {property.isActive === false && (
          <div className="absolute top-0 right-0 m-2 px-2 py-1 bg-gray-800 text-white text-xs rounded">
            Inactive
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900">{property.name}</h3>
          <p className="text-sm text-gray-500">
            {property.location || 'No location specified'}
          </p>
        </div>
        
        <div className="space-y-3 mb-3">
          {property.customDomain && (
            <div className="flex items-center text-xs text-gray-500">
              <svg className="h-4 w-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="truncate">https://{property.customDomain}</span>
            </div>
          )}
          
          <div className="flex items-center text-xs text-gray-500">
            <svg className="h-4 w-4 text-blue-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span>{totalActiveLinks} active link{totalActiveLinks !== 1 ? 's' : ''}</span>
          </div>
        </div>
        
        {Array.isArray(property.bookingLinks) && property.bookingLinks.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1">Available on:</p>
            <div className="flex flex-wrap gap-1">
              {property.bookingLinks.filter(link => link.isActive).slice(0, 3).map((link, index) => (
                <div key={index} className="inline-flex items-center bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {link.icon ? (
                    <img src={link.icon} alt={link.platform} className="w-3 h-3 mr-1" />
                  ) : null}
                  <span>{link.platform}</span>
                </div>
              ))}
              {activeBookingLinks > 3 && (
                <div className="inline-flex items-center bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  +{activeBookingLinks - 3} more
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="flex justify-between mt-4">
          <Link
            to={`/property/edit/${property.id}`}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            Edit Property
          </Link>
          <Link
            to={`/p/${property.id}`}
            className="text-sm text-gray-600 hover:text-gray-500"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Public Page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;