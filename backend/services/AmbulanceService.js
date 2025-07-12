import Ambulance from '../models/Ambulance.js';  // Import the Ambulance model

// Function to create an ambulance
export const createAmbulance = async ({
  name, email, password, phone_number, vehicle_number, location
}) => {
  if (!name || !email || !password || !phone_number || !vehicle_number || !location) {
    throw new Error('All fields are required');
  }

  const ambulance = await Ambulance.create({
    name,
    email,
    password,
    phone_number,
    vehicle_number,
    location: {
      lat: location.lat,
      long: location.long,
    }
  });

  return ambulance;
};

// Function to get nearby ambulances based on user location


// Function to get nearby ambulances based on user location
export const getNearbyAmbulances = async ({ lat, long }) => {
  console.log("📍 Searching ambulances near:", lat, long);

  const ambulances = await Ambulance.find({
    location: {
      $near: {
        $geometry: { type: "Point", coordinates: [long, lat] },
        $maxDistance: 5000  // 5 km radius
      }
    },
  
  });

  console.log("🚑 Found ambulances:", ambulances);
  return ambulances;
};


