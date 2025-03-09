import { useState, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { motion } from 'framer-motion';
import EventMarker from './EventMarker';
import EventDetails from './EventDetails';
import { communityEventsData } from '../../data/communityEventsDetails.js';



const containerStyle = {
  width: '100%',
  height: '600px'
};

const center = {
  lat: 40.7128,
  lng: -74.0060
};

const CommunityMap = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [map, setMap] = useState(null);
  
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "YOUR_API_KEY" // Replace with your actual API key
  });

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    communityEventsData.forEach(event => {
      bounds.extend(new window.google.maps.LatLng(event.location.lat, event.location.lng));
    });
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
  };

  const handleCloseDetails = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="position-relative">
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={12}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true,
            zoomControl: true,
          }}
        >
          {communityEventsData.map(event => (
            <EventMarker 
              key={event.id} 
              event={event} 
              onEventSelect={handleEventSelect} 
            />
          ))}
        </GoogleMap>
      ) : (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '600px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      
      {selectedEvent && (
        <div className="position-absolute top-0 end-0 m-3" style={{ width: '350px', zIndex: 10 }}>
          <EventDetails event={selectedEvent} onClose={handleCloseDetails} />
        </div>
      )}
      
      <div className="card mt-4">
        <div className="card-body">
          <h5 className="card-title fw-bold">Upcoming Community Events</h5>
          <div className="row mt-3">
            {communityEventsData.map(event => (
              <div key={event.id} className="col-md-6 col-lg-3 mb-3">
                <motion.div 
                  className="card h-100"
                  whileHover={{ y: -5 }}
                  onClick={() => handleEventSelect(event)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="card-body">
                    <h6 className="card-title">{event.title}</h6>
                    <p className="card-text small text-muted mb-2">{event.date}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="badge bg-primary">{event.points} points</span>
                      <small className="text-muted">{event.participants} participants</small>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityMap;