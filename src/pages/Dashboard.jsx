import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { auth, db } from '../firebase';
import PlaceCard from '../components/PlaceCard';
import { exportPlaceToJSON, importPlaceFromJSON } from '../utils/importExport';

const Dashboard = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPlaceForExport, setSelectedPlaceForExport] = useState(null);
  const importFileRef = useRef(null);

  const handleExport = (place) => {
    exportPlaceToJSON(place, place.name);
    setSelectedPlaceForExport(null);
  };

  const handleImportClick = () => {
    importFileRef.current?.click();
  };

  const handleImportFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const importedData = await importPlaceFromJSON(file);
      // For now, just alert the user. In a full implementation, this would create a new place
      alert(`Import successful! Place "${importedData.name}" is ready. Full import functionality coming soon.`);
      event.target.value = ''; // Reset input
    } catch (err) {
      alert(`Import failed: ${err.message}`);
      event.target.value = ''; // Reset input
    }
  };

  const fetchPlaces = useCallback(async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      const placesRef = collection(db, 'places');
      const q = query(
        placesRef, 
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const placesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setPlaces(placesList);
    } catch (err) {
      console.error('Error fetching places:', err);
      setError('Failed to load your places. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlaces();
  }, [fetchPlaces]);

  // Extracted components for cleaner render
  const ErrorMessage = () => (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
      <div className="flex">
        <div className="ml-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    </div>
  );

  const LoadingState = () => (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  const EmptyState = () => (
    <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-12 text-center border border-gray-200">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full mb-6">
        <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">No places yet</h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Create your first place to start connecting your guests to all your booking platforms and services
      </p>
      <Link
        to="/place/new"
        className="inline-flex items-center px-8 py-4 border border-transparent text-base font-semibold rounded-xl shadow-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-xl transform hover:scale-105 transition-all duration-200"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Create Your First Place
      </Link>
    </div>
  );

  const PlacesGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {places.map((place) => (
        <PlaceCard key={place.id} place={place} />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">My Places</h1>
              <p className="text-gray-600">Manage your hospitality link hubs</p>
            </div>
            <Link
              to="/place/new"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Place
            </Link>
          </div>

          {/* Stats bar */}
          {places.length > 0 && !loading && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center">
                  <div className="p-3 bg-indigo-100 rounded-lg">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Places</p>
                    <p className="text-2xl font-bold text-gray-900">{places.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {places.filter(p => p.isActive !== false).length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Links</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {places.reduce((acc, place) => {
                        const bookingLinks = Array.isArray(place.bookingLinks) ? place.bookingLinks.filter(l => l.isActive).length : 0;
                        const socialLinks = Array.isArray(place.socialLinks) ? place.socialLinks.filter(l => l.isActive).length : 0;
                        return acc + bookingLinks + socialLinks;
                      }, 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Minimal Import Button */}
          {places.length > 0 && !loading && (
            <div className="mt-4">
              <input
                ref={importFileRef}
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
              <button
                onClick={handleImportClick}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Import Place
              </button>
            </div>
          )}
        </div>

        {error && <ErrorMessage />}
        {loading ? <LoadingState /> : places.length === 0 ? <EmptyState /> : <PlacesGrid />}
      </div>
    </div>
  );
};

export default Dashboard;