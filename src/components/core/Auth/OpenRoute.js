// imports from packages
import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// this will prevent authenticated users from accessing this route
const OpenRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  if (token === null) return children;
  else return <Navigate to="/" />;
};

export default OpenRoute;
