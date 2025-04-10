// AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("User ki details", user);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
  
    console.log("Client Access Token:", accessToken);
    console.log("Client Refresh Token:", refreshToken);
  
    if (!(accessToken && refreshToken)) {
      console.log("No tokens found");
      return;
    }
  
    const isLoggedIn = async () => {
      try {
        const response = await axios.post(
          `http://localhost:3000/api/v1/users/refresh-token`,
          { refreshToken }
        );
        console.log("Tokens Response data", response);
        setUser(response.data?.data);
        setLoading(false);
      } catch (error) {
        console.log("Error in useEffect", error);
      }
    };
  
    isLoggedIn();
  }, []);
  

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
      // setUser(response.data?.data);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data);
    }
  };

  const signIn = async (email, password) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/users/login`,
        {
          email,
          password,
        }
      );
      
      setUser(response);
      console.log("SignIn Response", response.data?.data);
      localStorage.setItem("accessToken", response.data?.data?.accessToken);
      localStorage.setItem("refreshToken", response.data?.data?.refreshToken);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data);
      console.log("SignIn Error", error.response?.data);
    }
  };

  const signOut = async () => {
    try {
      await axios.post(`http://localhost:3000/api/v1/users/login`);
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
