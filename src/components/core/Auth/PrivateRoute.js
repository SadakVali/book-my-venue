import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// This will prevent non-authenticated users from accessing this route
const PrivateRoute = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  if (user.token !== null) return children;
  else return <Navigate to="/" />;
};

export default PrivateRoute;
