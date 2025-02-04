import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import LocationShare from './pages/locationShare';
import ErrorPage from './pages/errorPage';
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
import { CssBaseline, useMediaQuery } from '@mui/material';
import Products from './main/components/Products';
import Bag from './main/components/Products/Bag';
import CoinsPage from './main/components/CoinsPage';
import Orders from './main/components/Products/orders';
import ProceedPickup from './main/components/TrashMan/proceedPickup';
import ForgotPassword from './main/components/ForgotPassword';
import ResetPassword from './main/components/ResetPassword';
import ScheduledPickups from './main/components/TrashMan/scheduledPickups';
import Completed from './main/components/TrashMan/Completed';
// import ProcedureResults from './mskvy/ClusterBase_LOA_Details';
// import { AdminRouteWrapper } from './main/components/Admin/RouteAdmin';

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
  const isMobileView = useMediaQuery('(max-width:600px)');
  // Use a timer to hide the splash screen after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 300);
    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);
  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <div className="App">
      <AppTheme >
      <CssBaseline enableColorScheme />
        <AppAppBar />
        <div>
          <TokenHandler />
          <Routes>
            <Route exact path="/" element={<Hero />} />
            <Route path="/mission" element={<Mission />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgotPassword" element={<ForgotPassword />} />
            <Route path="/resetPassword" element={<ResetPassword />} />
            <Route path="/locationShare" element={<LocationShare />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/bag" element={<Bag />} />
            <Route path="/orders" element={<Orders />} />
            
            {/* <Route path="/requestForm" element={<RequestForm />} /> */}
            <Route path="/booking" element={<Booking />} />
            <Route path="/myBooking" element={<UserBookings />} />
           {/* For only Admin */}
           {/* <Route path="/admin" element={<Admin />} /> */}
           <Route path='mycoins' element={<CoinsPage />}/>
            <Route path="*" element={<ErrorPage />} />

            <Route path='/proceedPickup' element={<ProceedPickup />}/>
            <Route path='/scheduledPickups' element={<ScheduledPickups />}/>
            <Route path='/completedBookings' element={<Completed />}/>
            
            {/* <Route path='/clusterLoa' element={<ProcedureResults />}/> */}

          </Routes>
          </div>
          {isMobileView && (
            <FixedBottomNavigation />
          )}
      </AppTheme>
    </div>
  );
}

export default App;
