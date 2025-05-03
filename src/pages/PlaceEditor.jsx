import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlaceEditorProvider, usePlaceEditor } from '../components/place-editor/PlaceEditorContext';

// Form section components
import BasicInfoSection from '../components/place-editor/BasicInfoSection';
import ProfileCustomizationSection from '../components/place-editor/ProfileCustomizationSection';
import CustomDomainSection from '../components/place-editor/CustomDomainSection';
import PlaceImagesSection from '../components/place-editor/PlaceImagesSection';
import LinksManagementSection from '../components/place-editor/LinksManagementSection';

const PlaceEditorForm = () => {
  const { handleSubmit, loading, isEditMode, error, uploadStatus } = usePlaceEditor();
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        {isEditMode ? 'Edit Place' : 'Create New Place'}
      </h1>
      
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Form sections */}
        <BasicInfoSection />
        <ProfileCustomizationSection />
        <PlaceImagesSection />
        <CustomDomainSection />
        <LinksManagementSection />
        
        {/* Form actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={loading || uploadStatus?.isUploading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || uploadStatus?.isUploading}
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading || uploadStatus?.isUploading ? 
              (uploadStatus?.isUploading ? 'Uploading...' : 'Saving...') : 
              (isEditMode ? 'Update Place' : 'Create Place')}
          </button>
        </div>
        
        {/* Show overall progress when uploading/saving */}
        {(loading || uploadStatus?.isUploading) && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: uploadStatus?.isUploading ? `${uploadStatus.progress}%` : '100%' }}
              ></div>
            </div>
            <p className="mt-2 text-sm text-center text-gray-500">
              {uploadStatus?.isUploading 
                ? `${uploadStatus.currentFile || 'Uploading'} (${uploadStatus.progress}%)` 
                : 'Saving place data...'}
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

// Main component that provides context
const PlaceEditor = () => {
  return (
    <PlaceEditorProvider>
      <PlaceEditorForm />
    </PlaceEditorProvider>
  );
};

export default PlaceEditor;