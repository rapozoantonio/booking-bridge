import React from 'react';
import { usePlaceEditor } from './PlaceEditorContext';

const CustomDomainSection = () => {
  const { formData, handleChange } = usePlaceEditor();

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Custom Domain</h2>
      <p className="text-sm text-gray-500 mb-4">Connect your own domain to your place's link page</p>
      
      <div>
        <label htmlFor="customDomain" className="block text-sm font-medium text-gray-700">
          Domain Name
        </label>
        <div className="mt-1 flex shadow-sm">
          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
            https://
          </span>
          <input
            type="text"
            id="customDomain"
            name="customDomain"
            placeholder="yourdomain.com"
            value={formData.customDomain}
            onChange={handleChange}
            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Enter your domain without "https://" or "www."
        </p>
      </div>
      
      <div className="mt-4 bg-blue-50 p-4 rounded-md">
        <h3 className="text-sm font-medium text-blue-800">Domain Setup Instructions:</h3>
        <ol className="mt-2 text-sm text-blue-700 list-decimal list-inside">
          <li>Go to your domain registrar (like GoDaddy, Namecheap, etc.)</li>
          <li>Find the DNS settings section</li>
          <li>Create a CNAME record with host '@' pointing to 'bookingbridgelink.web.app'</li>
          <li>Add another CNAME record with host 'www' pointing to 'bookingbridgelink.web.app'</li>
          <li>Wait up to 48 hours for DNS propagation to complete</li>
        </ol>
        <p className="mt-2 text-sm text-blue-700">
          <strong>Note:</strong> Your domain must be verified before it can be used. We'll automatically verify it once DNS records are properly set.
        </p>
      </div>
    </div>
  );
};

export default CustomDomainSection;