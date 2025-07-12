import axios from 'axios';

export const geocode = async (address) => {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&addressdetails=1&limit=1`;

    try {
        const response = await axios.get(url);
        if (response.data.length > 0) {
            const location = response.data[0];
            return {
                latitude: location.lat,
                longitude: location.lon,
            };
        } else {
            throw new Error('Geocoding failed');
        }
    } catch (error) {
        console.error('Error occurred while geocoding:', error);
        throw error;
    }
};

import NodeGeocoder from 'node-geocoder';

const options = {
  provider: 'openstreetmap',   // Use OpenStreetMap for geocoding
};
const geocoder = NodeGeocoder(options);

export const reverseGeocode = async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ message: "Latitude and Longitude are required" });
  }

  try {
    const geoData = await geocoder.reverse({ lat, lon: lng });
    if (geoData.length > 0) {
      res.json({
        address: geoData[0].formattedAddress,
        city: geoData[0].city,
        country: geoData[0].country,
      });
    } else {
      res.status(404).json({ message: "No address found" });
    }
  } catch (error) {
    console.error("Geocoding Error:", error);
    res.status(500).json({ message: "Failed to get address", error: error.message });
  }
};
