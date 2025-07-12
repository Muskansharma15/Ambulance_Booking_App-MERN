import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Admindashboard.css";

const Admindashboard = () => {
  const [users, setUsers] = useState([]);
  const [ambulances, setAmbulances] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    fetchAmbulances();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem("adminToken");
    const response = await axios.get(`http://localhost:5000/api/admin/users`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setUsers(response.data.users);
  };

  const fetchAmbulances = async () => {
    const token = localStorage.getItem("adminToken");
    const response = await axios.get(`http://localhost:5000/api/admin/ambulances`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setAmbulances(response.data.ambulances);
  };
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login");
};

  const handleApprove = async (ambulanceId) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.put(`http://localhost:5000/api/admin/ambulance/${ambulanceId}/status`,
        { status: "approved" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Ambulance Approved!");
      fetchAmbulances();
    } catch (err) {
      console.error(err);
      alert("Error approving ambulance");
    }
  };

  const handleDeleteAmbulance = async (ambulanceId) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`http://localhost:5000/api/admin/ambulance/${ambulanceId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Ambulance Deleted!");
      fetchAmbulances();
    } catch (err) {
      console.error(err);
      alert("Error deleting ambulance");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`http://localhost:5000/api/admin/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("User Deleted!");
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Error deleting user");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <button
    onClick={handleLogout}
    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
  >
    Logout
  </button>
      {/* Users Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Users</h2>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td className="py-2 px-4 border-b">{user.name}</td>
                <td className="py-2 px-4 border-b">{user.email}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Ambulances Section */}
      <div>
        <h2 className="text-xl font-semibold mb-2">All Ambulances</h2>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Driver Name</th>
              <th className="py-2 px-4 border-b">City</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ambulances.map(ambulance => (
              <tr key={ambulance._id}>
                <td className="py-2 px-4 border-b">{ambulance.driverName}</td>
                <td className="py-2 px-4 border-b">{ambulance.city}</td>
                <td className="py-2 px-4 border-b">{ambulance.status}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleApprove(ambulance._id)}
                    className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleDeleteAmbulance(ambulance._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Admindashboard;
