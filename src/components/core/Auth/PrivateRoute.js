import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// This will prevent non-authenticated users from accessing this route
const PrivateRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  console.log(token);
  console.log("entered private route");
  if (token) return children;
  return <Navigate to="/" />;
};

export default PrivateRoute;
