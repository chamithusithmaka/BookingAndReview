import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Vehicle from './components/vehicles/vehicles';
import Bookings from './components/Bookings/Bookings';
import BookingDetail from './components/Bookings/BookingDetails';
import AdminBookings from './components/Admin/AdminBookings';
import Vehicles from './components/vehicles/vehicles';
import BookingForm from './components/Bookings/CreateBooking';
import SpecificBooking from "./components/Admin/specificBooking";
import AdminNotifications from './components/Admin/AdminNotification';
import AdminReviews from './components/Admin/AdminReviews';
import AdminVehicles from './pages/vehicle/AdminVehicles';
import SummaryReport from './components/Admin/SummaryReport';
import VehicleDetails from './pages/vehicle/vehicleDetailPage';
function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
    <Routes>
      {/* Add a route for the VehicleDetailPage */}
      <Route path="/" element={<Bookings />} />
      <Route path="/admin" element={<AdminBookings />} />
      <Route path="/booking/:id" element={<BookingDetail />} />
     <Route path="/vehicles" element={<Vehicles />} />
     <Route path="/bookings/:vehicleId" element={<BookingForm />} />
     <Route path="/admin/bookings/:id" element={<SpecificBooking />} />
      <Route path="/admin/notifications" element={<AdminNotifications />} />
      <Route path="/admin/reviews" element={<AdminReviews />} />
      <Route path="/vehicles/:id" element={<VehicleDetails />} /> {/* Add this route */}
      <Route path="/admin/vehicles" element={<AdminVehicles />} />
      <Route path="/admin/report" element={<SummaryReport />} />
    </Routes>
  </Router>
   
  )
}

export default App
