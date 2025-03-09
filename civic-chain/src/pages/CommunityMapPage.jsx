import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useUser } from '../context/UserContext';

// Fix for Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const CommunityMapPage = () => {
  const { currentUser } = useUser();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [mapCenter, setMapCenter] = useState([40.7128, -74.0060]); // New York by default
  
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        // In a real app, you would fetch this data from your API
        // For now, we'll use mock data
        const mockActivities = [
          {
            id: 1,
            title: 'Community Clean-up',
            description: 'Join us for a neighborhood clean-up event',
            category: 'Environmental',
            points: 50,
            date: '2023-06-20',
            location: 'Central Park',
            coordinates: [40.7812, -73.9665],
            participants: 12
          },
          {
            id: 2,
            title: 'Food Bank Volunteering',
            description: 'Help distribute food to those in need',
            category: 'Community Service',
            points: 75,
            date: '2023-06-22',
            location: 'Downtown Food Bank',
            coordinates: [40.7128, -74.0060],
            participants: 8
          },
          {
            id: 3,
            title: 'Voter Registration Drive',
            description: 'Help register voters for the upcoming election',
            category: 'Governance',
            points: 60,
            date: '2023-06-25',
            location: 'City Hall',
            coordinates: [40.7127, -74.0059],
            participants: 5
          },
          {
            id: 4,
            title: 'Coding Workshop for Kids',
            description: 'Teach basic programming to children',
            category: 'Education',
            points: 80,
            date: '2023-06-28',
            location: 'Public Library',
            coordinates: [40.7532, -73.9822],
            participants: 15
          },
          {
            id: 5,
            title: 'Health Awareness Campaign',
            description: 'Distribute information about healthy living',
            category: 'Health',
            points: 45,
            date: '2023-07-01',
            location: 'Community Center',
            coordinates: [40.7282, -73.9942],
            participants: 10
          }
        ];
        
        setActivities(mockActivities);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError('Failed to load activities. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchActivities();
  }, []);
  
  const categories = ['All', 'Community Service', 'Environmental', 'Education', 'Health', 'Governance', 'Innovation'];
  
  const filteredActivities = selectedCategory === 'All' 
    ? activities 
    : activities.filter(activity => activity.category === selectedCategory);
  
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading community activities...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Community Map</h1>
        <Link to="/activities/new" className="btn btn-primary">
          <i className="bi bi-plus-lg me-2"></i>
          Create Activity
        </Link>
      </div>
      
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
              <MapContainer 
                center={mapCenter} 
                zoom={13} 
                style={{ height: '500px', width: '100%', zIndex: 0 }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                {filteredActivities.map(activity => (
                  <Marker 
                    key={activity.id} 
                    position={activity.coordinates}
                  >
                    <Popup>
                      <div>
                        <h6>{activity.title}</h6>
                        <p className="mb-1">{activity.description}</p>
                        <p className="mb-1"><strong>Category:</strong> {activity.category}</p>
                        <p className="mb-1"><strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}</p>
                        <p className="mb-1"><strong>Location:</strong> {activity.location}</p>
                        <p className="mb-1"><strong>Points:</strong> {activity.points}</p>
                        <p className="mb-2"><strong>Participants:</strong> {activity.participants}</p>
                        <Link to={`/activities/${activity.id}`} className="btn btn-sm btn-primary">View Details</Link>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        </div>
        
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title mb-3">Filter Activities</h5>
              
              <div className="mb-3">
                <label className="form-label">Category</label>
                <select 
                  className="form-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">Upcoming Activities</h5>
              
              {filteredActivities.length > 0 ? (
                <div className="list-group list-group-flush">
                  {filteredActivities.map(activity => (
                    <Link 
                      key={activity.id} 
                      to={`/activities/${activity.id}`}
                      className="list-group-item list-group-item-action px-0 py-3 border-bottom"
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1">{activity.title}</h6>
                          <p className="mb-1 small text-muted">{activity.location}</p>
                          <p className="mb-0 small text-muted">{new Date(activity.date).toLocaleDateString()}</p>
                        </div>
                        <span className="badge bg-primary">{activity.points} pts</span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted my-4">No activities found for the selected category.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityMapPage;