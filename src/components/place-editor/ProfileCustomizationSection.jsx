import React from 'react';
import { usePlaceEditor } from './PlaceEditorContext';

const ProfileCustomizationSection = () => {
  const { 
    formData,
    handleChange,
    error
  } = usePlaceEditor();

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Customization</h2>
      
      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-6 space-y-4">
        <h3 className="text-md font-medium text-gray-900">Appearance Customization</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="color" className="block text-sm font-medium text-gray-700">
              Primary Color
            </label>
            <div className="mt-1 flex items-center space-x-2">
              <div 
                className="w-8 h-8 rounded-full border border-gray-300" 
                style={{ backgroundColor: formData.color }}
              ></div>
              <input
                type="color"
                id="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="h-8 cursor-pointer"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Button background color</p>
          </div>
          
          <div>
            <label htmlFor="backgroundColor" className="block text-sm font-medium text-gray-700">
              Background Color
            </label>
            <div className="mt-1 flex items-center space-x-2">
              <div 
                className="w-8 h-8 rounded-full border border-gray-300" 
                style={{ backgroundColor: formData.backgroundColor }}
              ></div>
              <input
                type="color"
                id="backgroundColor"
                name="backgroundColor"
                value={formData.backgroundColor}
                onChange={handleChange}
                className="h-8 cursor-pointer"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Page background</p>
          </div>
          
          <div>
            <label htmlFor="fontColor" className="block text-sm font-medium text-gray-700">
              Text Color
            </label>
            <div className="mt-1 flex items-center space-x-2">
              <div 
                className="w-8 h-8 rounded-full border border-gray-300" 
                style={{ backgroundColor: formData.fontColor || "#000000" }}
              ></div>
              <input
                type="color"
                id="fontColor"
                name="fontColor"
                value={formData.fontColor || "#000000"}
                onChange={handleChange}
                className="h-8 cursor-pointer"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Headings & paragraph text</p>
          </div>
          
          <div>
            <label htmlFor="buttonTextColor" className="block text-sm font-medium text-gray-700">
              Button Text Color
            </label>
            <div className="mt-1 flex items-center space-x-2">
              <div 
                className="w-8 h-8 rounded-full border border-gray-300" 
                style={{ backgroundColor: formData.buttonTextColor || "#FFFFFF" }}
              ></div>
              <input
                type="color"
                id="buttonTextColor"
                name="buttonTextColor"
                value={formData.buttonTextColor || "#FFFFFF"}
                onChange={handleChange}
                className="h-8 cursor-pointer"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Text inside buttons</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="p-3 bg-gray-50 rounded-md">
            <div className="text-sm text-gray-700">
              <span className="font-medium">Preview:</span>
              
              <div className="mt-2 p-4 rounded-md border border-gray-200" style={{ backgroundColor: formData.backgroundColor }}>
                <h4 className="font-medium" style={{ color: formData.fontColor }}>Headings will use this text color</h4>
                <p className="text-sm mt-1 mb-3" style={{ color: formData.fontColor }}>
                  Paragraphs and section labels will use this text color
                </p>
                
                <div className="flex items-center space-x-2">
                  <button 
                    className={`px-4 py-2 rounded-md text-sm ${formData.linkStyle === 'outline' ? 'border-2' : ''}`}
                    style={{ 
                      backgroundColor: formData.linkStyle === 'outline' ? 'transparent' : formData.color,
                      color: formData.linkStyle === 'outline' ? formData.color : formData.buttonTextColor,
                      borderColor: formData.color,
                      borderRadius: 
                        formData.linkStyle === 'pill' ? '9999px' : 
                        formData.linkStyle === 'square' ? '0' : 
                        '0.375rem'
                    }}
                  >
                    Button with custom colors
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label htmlFor="linkStyle" className="block text-sm font-medium text-gray-700">
              Link Style
            </label>
            <select
              id="linkStyle"
              name="linkStyle"
              value={formData.linkStyle}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="rounded">Rounded</option>
              <option value="pill">Pill</option>
              <option value="square">Square</option>
              <option value="outline">Outline</option>
            </select>
          </div>

          <div>
            <label htmlFor="fontFamily" className="block text-sm font-medium text-gray-700">
              Font Style
            </label>
            <div className="mt-1 flex items-center">
              <p className="text-sm text-gray-600">Using system fonts for optimal performance</p>
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Auto-optimized
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Using your visitor's system fonts improves page load times significantly
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCustomizationSection;