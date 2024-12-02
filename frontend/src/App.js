import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import LocationShare from './pages/locationShare';
import ErrorPage from './pages/errorPage';
import RequestForm from './pages/requestForm';
import AppTheme from './shared-theme/AppTheme';
import AppAppBar from './main/components/AppAppBar';
import FixedBottomNavigation from './main/components/BottomNavigation';
import Mission from './main/components/Mission';
import AboutUs from './main/components/AboutUs';
import Profile from './main/components/Profile';
import Signin from './main/components/Signin';
import Signup from './main/components/Signup';
import Hero from './main/components/Hero';
import logo from './main/components/assets/logo.png';
import Booking from './main/components/Booking';
import UserBookings from './main/components/UserBookings';
import Contact from './main/components/Contact';
import TokenHandler from './main/components/TokenHandler';

// Splash Screen Component
function SplashScreen() {
  return (
    <div  style={{backgroundColor:'#F4FFF1', display:'flex', justifyContent:'center', alignItems:'center', height:'100vh'}} className="splash-screen">
      <img id="splash-screen" src={logo} alt='Trash-o-Green' width='250px'/> {/* Replace with your logo */}
    </div>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

  // Use a timer to hide the splash screen after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1300); // 5 seconds
    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <div className="App">
      <AppTheme>
        <AppAppBar />
        <div className="main-content">
          <div className='pageOverlay'>
          <TokenHandler />
          <Routes>
            <Route exact path="/" element={<Hero />} />
            <Route path="/mission" element={<Mission />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/locationShare" element={<LocationShare />} />
            {/* <Route path="/requestForm" element={<RequestForm />} /> */}
            <Route path="/booking" element={<Booking />} />
            <Route path="/myBooking" element={<UserBookings />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
          </div>
        </div>
        <FixedBottomNavigation />
      </AppTheme>
    </div>
  );
}

export default App;
