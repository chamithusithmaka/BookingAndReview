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
    </Routes>
  </Router>
   
  )
}

export default App
