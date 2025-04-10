// AuthContext.jsx
import React, { createContext, useState, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("User ki details", user);

  const register = async (username, email, password) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/users/signup`,
        {
          username,
          email,
          password,
        }
      );
      if (!response) {
        throw new Error("Invalid response from server");
      }
      console.log("Register Response", response);
      setUser(response.data?.data);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data);
    }
  };

  const signIn = async (email, password) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/users/signin`,
        {
          email,
          password,
        }
      );
      setUser(response.data.user);
      setLoading(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const signOut = async () => {
    try {
      await axios.post(`http://localhost:3000/api/v1/users/signout`);
      setUser(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const value = {
    user,
    loading,
    register,
    signIn,
    signOut,
    setUser,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthContext };
