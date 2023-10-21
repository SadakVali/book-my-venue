// import css
import "./App.css";

// import from packages
import { Routes, Route } from "react-router-dom";

// import pages
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import VenueDetails from "./pages/VenueDetails";
import CustomerBookings from "./pages/CustomerBookings";
import CustomerReciept from "./pages/CustomerReciept";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import VenueForm from "./pages/VenueForm";
import Error from "./pages/Error";

// import components
import Navbar from "./components/common/Navbar";
import OpenRoute from "./components/core/Auth/OpenRoute";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import PaymentDueTodayBookings from "./components/core/Dashboard/PaymentDueTodayBookings";
import SignupSidebar from "./components/common/SignupSidebar";
import { useSelector } from "react-redux";
import BookingInfoForm from "./pages/BookingInfoForm";
import WelcomeScreen from "./components/core/Home/WelcomeScreen";
import { useEffect, useState } from "react";
import ForgotPassword from "./components/core/Auth/ForgotPassword";
import ManagerReciept from "./pages/ManagerReciept";

const App = () => {
  const { sidebarFlag } = useSelector((state) => state.auth);
  const [disableWelcomeScreen, setDisableWelcomeScreen] = useState(false);

  useEffect(() => {
    // Set a timeout to disable the WelcomeScreen image after 3 seconds
    const timeout = setTimeout(() => {
      setDisableWelcomeScreen(true);
    }, 3000);
    // }, 100);
    // Clear the timeout when the component unmounts to avoid memory leaks
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return !disableWelcomeScreen ? (
    <WelcomeScreen disableWelcomeScreen={disableWelcomeScreen} />
  ) : (
    <div className="min-h-screen flex flex-col bg-[#ECEFF4]">
      <Navbar />
      {sidebarFlag && <SignupSidebar />}
      <Routes>
        {/* routes for any type of users */}
        <Route path="/" element=<Home /> />
        <Route path="/about" element=<About /> />
        <Route path="/contact" element=<Contact /> />
        <Route path="/venues/:venueId" element=<VenueDetails /> />
        <Route path="/customer-bookings" element=<CustomerBookings /> />
        <Route
          path="/customer-bookings/:bookingId"
          element=<CustomerReciept />
        />
        {/* routes for stricktly un-authorized managers */}
        <Route
          path="/signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />
        <Route
          path="/login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />
        {/* routes only for authorized managers */}
        <Route
          path="/booking-info-form"
          element={
            <PrivateRoute>
              <BookingInfoForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/venue-form"
          element={
            <PrivateRoute>
              <VenueForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/payment-due-today-bookings"
          element={
            <PrivateRoute>
              <PaymentDueTodayBookings />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/payment-due-today-bookings/:bookingId"
          element={
            <PrivateRoute>
              <ManagerReciept />
            </PrivateRoute>
          }
        />
        {/* 404 Error Page */}
        <Route path="*" element=<Error /> />
      </Routes>
    </div>
  );
};

export default App;
