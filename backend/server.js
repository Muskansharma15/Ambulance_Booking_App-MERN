import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http'; // Needed to create server manually
//import bodyparser from 'body-parser';
// Import routes
import ambulanceRoutes from './routes/AmbulanceRoutes.js';
import userRoutes from './routes/userRoutes.js';
import mapRoutes from './routes/MapRoutes.js';
import bookingRoutes from './routes/BookingRoutes.js';
import adminRoutes from './routes/AdminRoutes.js'; 
import Ambulance from './models/Ambulance.js';
import Booking from './models/Booking.js';

dotenv.config();

const app = express();
const server = http.createServer(app); // Create HTTP server manually
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Frontend  default origin
    methods: ["GET", "POST"],
    credentials: true,
  },
});
const onlineUsers = {};
export {io, onlineUsers}; // Export io and onlineUsers for use in other files
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth/users', userRoutes);
app.use('/api/auth/ambulances', ambulanceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/maps', mapRoutes);
app.use('/api/admin',adminRoutes)
// Endpoint to get all contact messages
app.get('/contact/messages', (req, res) => {
  fs.readFile('messages.json', (err, data) => {
      if (err) {
          return res.status(500).send('Error reading messages');
      }

      const messages = JSON.parse(data); // Parse the JSON data
      res.status(200).json(messages); // Send messages as JSON response
  });
});

/*app.get('/test-booking', async (req, res) => {
  try {
    const testBooking = new Booking({
      userId: new mongoose.Types.ObjectId('67d86c3c34085e559a569ed6'),
      ambulanceId: new mongoose.Types.ObjectId('67ebca732fa9c2691b855b74'),
      pickup: {
        name: 'Pickup Location',
        lat: 28.6139,
        lng: 77.2090
      },
      dropoff: {
        name: 'Dropoff Location',
        lat: 28.7041,
        lng: 77.1025
      }
    });

    await testBooking.save();
    res.status(201).json({ message: 'Test booking created', booking: testBooking });
  } catch (error) {
    console.error('❌ Error saving test booking:', error);
    res.status(500).json({ message: 'Failed to create test booking', error });
  }
});*/

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(' MongoDB Connection Error:', err));

// Socket.io events and real time communication logics btw ambulances and users
io.on("connection", (socket) => {
  console.log("New socket connected:", socket.id);

  socket.on('ambulanceOnline', async ({ ambulanceId }) => {
    try {
      const ambulance = await Ambulance.findByIdAndUpdate(
        ambulanceId,
        {
          isOnline: true,
          socketId: socket.id
        },
        { new: true }
      );
  
      if (ambulance) {
        console.log(`✅ Ambulance ${ambulanceId} is now online with socket ${socket.id}`);
        socket.emit("ambulanceOnlineConfirmed", { success: true });  // ✅ Notify client
      } else {
        console.log(`🚫 Ambulance not found with ID: ${ambulanceId}`);
        socket.emit("ambulanceOnlineConfirmed", { success: false });
      }
    } catch (err) {
      console.error(`❌ Error in ambulanceOnline for ID ${ambulanceId}:`, err);
      socket.emit("ambulanceOnlineConfirmed", { success: false });
    }
  });
  
  

  socket.on("userOnline", async ({ userId }) => {
    const User = (await import('./models/User.js')).default;
    await User.findByIdAndUpdate(userId, { socketId: socket.id });
    onlineUsers[userId] = socket.id; // 👈 Store mapping
    console.log("User online:", userId);
  });
  

  socket.on('disconnect', async () => {
    try {
      const ambulance = await Ambulance.findOne({ socketId: socket.id });
      if (ambulance && ambulance.socketId === socket.id) {
        ambulance.isOnline = false;
        ambulance.socketId = null;
        await ambulance.save();
        console.log(`✅ Ambulance marked offline: ${ambulance._id}`);
      } else {
        console.log(`⚠️ Disconnect ignored for stale socket: ${socket.id}`);
      }
    } catch (err) {
      console.error('Disconnect error:', err);
    }

    for (const [userId, socketId] of Object.entries(onlineUsers)) {
      if (socketId === socket.id) {
        delete onlineUsers[userId];
        console.log(`User ${userId} disconnected`);
      }
    }
  });
  
  
  socket.on("bookingRequest", async ({ ambulanceId, userId, pickup, dropoff }) => {
   console.log("Booking request received:", {
      ambulanceId,
      userId,
      pickup,
      dropoff,
    });
    try {
      const ambulance = await Ambulance.findById(ambulanceId);
  
      if (!ambulance || !ambulance.socketId) {
        console.log("🚫 Ambulance is offline or not found.");
        return;
      }
  
      // Create booking in DB
      const booking = new Booking({
        ambulanceId,
        userId,
        pickup,
        dropoff,
        status: "pending",
      });
    console.log("Booking object:", booking); // logging booking details before saving
      await booking.save();
  
      // Send booking request to ambulance via its socket
      io.to(ambulance.socketId).emit("newBookingRequest", {
        _id: booking._id,
        userId,
        pickup,
        dropoff,
      });
  
      console.log("📤 Booking sent to ambulance:", ambulance.socketId);
    } catch (err) {
      console.error("❌ Error handling booking request:", err);
    }
  });
  
// When ambulance accepts the ride
// When ambulance accepts the ride
socket.on('confirmRide', ({ userId, bookingId }) => { 
  const userSocketId = onlineUsers[userId]; 
  if (userSocketId) {
    io.to(userSocketId).emit('bookingStatusUpdate', { 
      bookingId, 
      status: 'approved', 
      message: 'Your ride request has been accepted and the ride will start shortly.' 
    });
    console.log(`Ride confirmed for user ${userId}`);
  }
});



  
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
