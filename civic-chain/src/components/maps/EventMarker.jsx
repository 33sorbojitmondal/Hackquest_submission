import { useState } from 'react';
import { Marker, InfoWindow } from '@react-google-maps/api';
import { motion } from 'framer-motion';

const EventMarker = ({ event, onEventSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Marker
      position={{ lat: event.location.lat, lng: event.location.lng }}
      onClick={toggleOpen}
    >
      {isOpen && (
        <InfoWindow onCloseClick={toggleOpen}>
          <div className="p-2">
            <h6 className="fw-bold mb-1">{event.title}</h6>
            <p className="small mb-1">{event.date} • {event.time}</p>
            <p className="small mb-2">{event.location.address}</p>
            <div className="d-flex justify-content-between align-items-center">
              <span className="badge bg-primary">{event.points} points</span>
              <button 
                className="btn btn-sm btn-outline-primary"
                onClick={() => {
                  onEventSelect(event);
                  toggleOpen();
                }}
              >
                Details
              </button>
            </div>
          </div>
        </InfoWindow>
      )}
    </Marker>
  );
};

export default EventMarker;