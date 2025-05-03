import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { auth, db } from '../firebase';
import PlaceCard from '../components/PlaceCard';

const Dashboard = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
    <div className="bg-white shadow-md rounded-lg p-6 text-center">
      <h3 className="text-lg font-medium text-gray-900 mb-2">No places yet</h3>
      <p className="text-gray-500 mb-4">
        Create your first place to get started with Booking Bridge Link
      </p>
      <Link
        to="/place/new"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Add a Place
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Places</h1>
        <Link
          to="/place/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          + Add New Place
        </Link>
      </div>

      {error && <ErrorMessage />}
      {loading ? <LoadingState /> : places.length === 0 ? <EmptyState /> : <PlacesGrid />}
    </div>
  );
};

export default Dashboard;