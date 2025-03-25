import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Vehicle from './components/vehicles/vehicles';
import Bookings from './components/Bookings/Bookings';
import BookingDetail from './components/Bookings/BookingDetails';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
    <Routes>
      {/* Add a route for the VehicleDetailPage */}
      <Route path="/" element={<Bookings />} />
      <Route path="/booking/:id" element={<BookingDetail />} />
     
    </Routes>
  </Router>
   
  )
}

export default App
