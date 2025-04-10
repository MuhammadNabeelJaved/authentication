// ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router";
import { useAuth } from "./AuthContext.jsx";

const ProtectedRoute = ({ element }) => {
  const { user } = useAuth();

  return user ? element : <Navigate to="/signin" />;
};

export default ProtectedRoute;
