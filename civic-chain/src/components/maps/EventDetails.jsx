import { motion } from 'framer-motion';

const EventDetails = ({ event, onClose }) => {
  if (!event) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="card"
    >
      <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Event Details</h5>
        <button 
          type="button" 
          className="btn-close btn-close-white" 
          onClick={onClose}
          aria-label="Close"
        ></button>
      </div>
      <div className="card-body">
        <h5 className="card-title">{event.title}</h5>
        <p className="card-text">{event.description}</p>
        
        <div className="mb-3">
          <div className="d-flex align-items-center mb-2">
            <i className="bi bi-calendar me-2"></i>
            <span>{event.date}</span>
          </div>
          <div className="d-flex align-items-center mb-2">
            <i className="bi bi-clock me-2"></i>
            <span>{event.time}</span>
          </div>
          <div className="d-flex align-items-center mb-2">
            <i className="bi bi-geo-alt me-2"></i>
            <span>{event.location.address}</span>
          </div>
        </div>
        
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="badge bg-primary p-2">
            <i className="bi bi-star-fill me-1"></i>
            {event.points} points
          </div>
          <div className="badge bg-secondary p-2">
            <i className="bi bi-people-fill me-1"></i>
            {event.participants} participants
          </div>
        </div>
        
        <div className="d-grid gap-2">
          <button className="btn btn-primary">Register for Event</button>
          <button className="btn btn-outline-secondary">Add to Calendar</button>
        </div>
      </div>
    </motion.div>
  );
};

export default EventDetails;