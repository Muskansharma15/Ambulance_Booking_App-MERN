import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import AmbulanceSignup from "./pages/AmbulanceSignup";
import PrivateRoute from "./components/PrivateRoute";
import Bookingform from "./pages/Bookingform";
import AmbulanceDashboard from "./pages/Ambulancedashboard";
import Profile from "./pages/Profile";
import AmbulanceProfile from "./pages/AmbulanceProfile";
//import Admindashboard from "./pages/Admindashboard";
import { FindAmbulances, FindAmbulanceswithoutmap } from "./pages/FindAmbulances";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./admin/Adminpages/Dashboard";
import UserAboutUs from "./pages/UserAboutus";
import AmbulanceAboutus from "./pages/AmbulanceAboutus";
import Contactus from "./pages/Contactus";
import Usermessages from "./admin/Adminpages/Usermessages";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/ambulance-signup" element={<AmbulanceSignup />} />
        <Route path="/booking" element={<Bookingform />} />
        <Route path="/find-ambulance" element={<FindAmbulances />} />
        <Route path="/booking/:ambulanceId" element={<Bookingform />} />
        <Route path="/find-ambulances" element={<FindAmbulanceswithoutmap />} />
        <Route path="/admin-login" element={<AdminLogin />} /> {/* Admin Login Route */}
          <Route path="/aboutus" element={<UserAboutUs />} />
        <Route path="/ambulance-aboutus" element={<AmbulanceAboutus />} />
        <Route path="/contactus" element={<Contactus />} />
        <Route path="/admin/messages" component={Usermessages} />
        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/account"
          element={
            <PrivateRoute>
              <Profile tab="account" />
            </PrivateRoute>
          }
        />
        <Route
          path="/history"
          element={
            <PrivateRoute>
              <Profile tab="bookings" />
            </PrivateRoute>
          }
        />
        <Route
          path="/ambulance-account"
          element={
            <PrivateRoute>
              <AmbulanceProfile tab="account" />
            </PrivateRoute>
          }
        />
        <Route
          path="/ambulance-history"
          element={
            <PrivateRoute>
              <AmbulanceProfile tab="bookings" />
            </PrivateRoute>
          }
        />
        <Route
          path="/ambulance-dashboard"
          element={
            <PrivateRoute>
              <AmbulanceDashboard />
            </PrivateRoute>
          }
        />
        {/* Admin Dashboard Route */}
        
          <Route path="/admin/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
