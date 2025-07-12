import React, { useState } from "react";

const DropLocation = ({ setDropLatitude, setDropLongitude }) => {
  const [selectedLocation, setSelectedLocation] = useState("");

  const locations = [
    { name: "City General Hospital", lat: 23.033863, lng: 72.585022 },
    { name: "Green Valley Medical Center", lat: 28.613939, lng: 77.209023 },
    { name: "Sunrise Multispecialty Hospital", lat: 19.076090, lng: 72.877426 },
    { name: "Lifeline Emergency Care", lat: 12.971599, lng: 77.594566 },
    { name: "Apollo Clinic", lat: 13.082680, lng: 80.270721 },
    { name: "Medanta Super Specialty Hospital", lat: 28.459497, lng: 77.026638 },
    { name: "Fortis Healthcare", lat: 22.572645, lng: 88.363892 },
    { name: "Max Smart Super Specialty Hospital", lat: 30.733315, lng: 76.779419 }
  ];

  const handleLocationSelect = (e) => {
    const selected = locations.find(loc => loc.name === e.target.value);
    setSelectedLocation(selected.name);
    
    if (selected) {
      setDropLatitude(selected.lat);
      setDropLongitude(selected.lng);
    }
  };

  return (
    <div className="location-selector">
      <label htmlFor="dropLocation">Drop Location:</label>
      <select
        id="dropLocation"
        value={selectedLocation}
        onChange={handleLocationSelect}
      >
        <option value="">Select a Location</option>
        {locations.map((loc, index) => (
          <option key={index} value={loc.name}>
            {loc.name}
          </option>
        ))}
      </select>

      <div className="coordinates">
        <p>Latitude: {selectedLocation && locations.find(loc => loc.name === selectedLocation)?.lat}</p>
        <p>Longitude: {selectedLocation && locations.find(loc => loc.name === selectedLocation)?.lng}</p>
      </div>
    </div>
  );
};

export default DropLocation;
