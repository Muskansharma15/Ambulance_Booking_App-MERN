import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  { month: "Jan", bookings: 5 },
  { month: "Feb", bookings: 8 },
  { month: "Mar", bookings: 12 },
  { month: "Apr", bookings: 7 },
  { month: "May", bookings: 9 },
];

const DashboardChart = () => {
  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="bookings" fill="#6b4ca6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DashboardChart;
