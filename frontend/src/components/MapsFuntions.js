import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import socket from "../socket";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";

const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149059.png",
  iconSize: [35, 35],
  iconAnchor: [17, 34],
});

const ambulanceIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/6581/6581960.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});
const hospitalIcon = new L.Icon({
  iconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKWeHZaYhbhmGSDirN7yQr9f8dzktSXxc3pw&s",
  iconSize: [35, 35],
  iconAnchor: [17, 34],
});

const Routing = ({ pickupCoords, dropoffCoords }) => {
  const map = useMap();
  const routingRef = useRef(null);

  useEffect(() => {
    if (!pickupCoords || !dropoffCoords || !map) return;
  
    // Remove existing route
    const cleanup = () => {
      if (routingRef.current && map.hasLayer(routingRef.current)) {
        try {
          map.removeLayer(routingRef.current);  // ✅ Proper way
        } catch (err) {
          console.warn('Routing cleanup failed:', err);
        }
        routingRef.current = null;
      }
      
    };
  
    cleanup(); // Directly call cleanup before adding the new route
  
    const control = L.Routing.control({
      waypoints: [
        L.latLng(pickupCoords.lat, pickupCoords.lng),
        L.latLng(dropoffCoords.lat, dropoffCoords.lng),
      ],
      routeWhileDragging: false,
      addWaypoints: false,
      createMarker: () => null,
      show: false,
    }).addTo(map);
  
    routingRef.current = control;
  
    return () => {
      cleanup();
    };
  }, [pickupCoords, dropoffCoords, map]);
  
  return null;
};





const FitBounds = ({ location, ambulances }) => {
  const map = useMap();

  useEffect(() => {
    if (location.lat && location.lng && ambulances.length > 0) {
      const bounds = L.latLngBounds([
        ...ambulances.map((amb) => [
          amb.location.coordinates[1],
          amb.location.coordinates[0],
        ]),
        [location.lat, location.lng],
      ]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [location, ambulances, map]);

  return null;
};

const MapsFunctions = ({ pickup = {}, nearbyAmbulances = [], dropoff = {} }) => {


  
const userLat = pickup?.lat || 20.5937;
const userLng = pickup?.lng || 78.9629;


 //console.log("pickup", pickup.lat, pickup.lng);
//console.log("dropoff", dropoff.lat, dropoff.lng);

const handleBooking = async (ambulanceId) => {
  const userId = localStorage.getItem("userId");

  if (!pickup?.name || !pickup?.lat || !pickup?.lng ||
      !dropoff?.name || !dropoff?.lat || !dropoff?.lng || !userId) {
    alert("Please make sure pickup and drop-off locations are selected.");
    return;
  }

  console.log("Book Now clicked for ambulance:", ambulanceId);
  console.log("Booking request details", {
    userId,
    ambulanceId,
    pickup,
    dropoff,
  });

  try {
    const response = await axios.post(`${process.env.REACT_APP_API_BASE}/api/bookings/create`, {
      userId,
      ambulanceId,
      pickup,
      dropoff,
    });
     console.log("Booking response:", response.data);

    if (response.data.booking) {
      console.log("📤 Emitting booking request with data:", { ambulanceId, userId, pickup, dropoff });
      socket.emit("bookingRequest", {
        ambulanceId,
        userId,
        pickup,
        dropoff,
      });
      
      console.log("Booking request sent to ambulance:", ambulanceId);
      alert("Booking request sent to ambulance!");
    }
  } catch (err) {
    console.error("Booking failed", err);
   
  
    alert("Booking failed. Please try again.");
  }
};



return (
    <MapContainer center={[userLat, userLng]} zoom={13} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {pickup.lat && pickup.lng && (
        <Marker position={[pickup.lat, pickup.lng]} icon={userIcon}>
          <Popup>Your Location</Popup>
        </Marker>
      )}
      {dropoff?.lat && dropoff?.lng && (
        <Marker position={[dropoff.lat, dropoff.lng]} icon={hospitalIcon}>
  <Popup>🏥 Drop-off Location: {dropoff.name}</Popup>
</Marker>

)}


      {nearbyAmbulances.map((amb, idx) => (
        <Marker
          key={idx}
          position={[amb.location.coordinates[1], amb.location.coordinates[0]]}
          icon={ambulanceIcon}
        >
        <Popup>
  <div>
    <strong>{amb.name}</strong><br />
    📞 {amb.phone_number}<br />
    📍 {amb.email}<br />
    <button
      className="book-btn"
      onClick={(e) => {
        e.preventDefault(); // prevent leaflet from swallowing the click
        handleBooking(amb._id);
      }}
    >
      🚑 Book Now
    </button>
  </div>
</Popup>

        </Marker>
        
      ))}

      {pickup?.lat && pickup?.lng && dropoff?.lat && dropoff?.lng && (
        <Routing
          pickupCoords={{ lat: pickup.lat, lng: pickup.lng }}
          dropoffCoords={{ lat: dropoff.lat, lng: dropoff.lng }}
        />
        
      )}

      <FitBounds location={pickup} ambulances={nearbyAmbulances} />

    </MapContainer>
  );
};

export default MapsFunctions;
