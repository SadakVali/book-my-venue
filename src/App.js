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
import ManagerHome from "./pages/ManagerHome";
import VenueForm from "./pages/VenueForm";
import Dashboard from "./pages/Dashboard";
import Error from "./pages/Error";

// import components
import Navbar from "./components/common/Navbar";
import OpenRoute from "./components/core/Auth/OpenRoute";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import PaymentDueTodayBookings from "./components/core/Dashboard/PaymentDueTodayBookings";
import ManagerReciept from "./components/core/Dashboard/ManagerReciept";
import CancelledBookings from "./components/core/Dashboard/CancelledBookings";
import AdvancePaidBookings from "./components/core/Dashboard/AdvancePaidBookings";
import BookedBookings from "./components/core/Dashboard/BookedBookings";
import SignupSidebar from "./components/common/SignupSidebar";
import { useSelector } from "react-redux";

const App = () => {
  const { sidebarFlag } = useSelector((state) => state.auth);
  const { token } = useSelector((state) => state.auth);

  return (
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
        {/* routes for stricktly non-authorized managers */}
        <Route
          path="/signup"
          element={
            <OpenRoute>
              <Signup />
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
        {!!token && (
          <Route
            path="/manager-home"
            element={
              <PrivateRoute>
                <ManagerHome />
              </PrivateRoute>
            }
          />
        )}
        <Route
          path="/venue-form"
          element={
            <PrivateRoute>
              <VenueForm />
            </PrivateRoute>
          }
        />
        <Route
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route
            path="/dashboard/payment-due-today-bookings"
            element=<PaymentDueTodayBookings />
          />
          <Route
            path="/dashboard/payment-due-today-bookings/:bookingId"
            element=<ManagerReciept />
          />
          <Route
            path="/dashboard/cancelled-bookings"
            element=<CancelledBookings />
          />
          <Route
            path="/dashboard/cancelled-bookings/:bookingId"
            element=<ManagerReciept />
          />
          <Route
            path="/dashboard/advance-paid-bookings"
            element=<AdvancePaidBookings />
          />
          <Route
            path="/dashboard/advance-paid-bookings/:bookingId"
            element=<ManagerReciept />
          />
          <Route
            path="/dashboard/completely-paid-bookings"
            element=<BookedBookings />
          />
          <Route
            path="/dashboard/completely-paid-bookings/:bookingId"
            element=<ManagerReciept />
          />
        </Route>
        {/* 404 Error Page */}
        <Route path="*" element=<Error /> />
      </Routes>
    </div>
  );
};

export default App;
