// main.jsx
import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import SignUpForm from "./components/Signup.jsx";
import SignInForm from "./components/Signin.jsx";
import HomePage from "./components/Home.jsx";
import OTPVerification from "./components/Otp.jsx";
import { AuthProvider } from "./components/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoutes.jsx";
import App from "./App.jsx"; // Import the App component

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // Use App as the layout component
    children: [
      {
        path: "/",
        element: <SignUpForm />,
      },
      {
        path: "/signin",
        element: <SignInForm />,
      },
      {
        path: "/signup",
        element: <SignUpForm />,
      },
      {
        path: "/home",
        element: <ProtectedRoute element={<HomePage />} />,
      },
      {
        path: "/verify-account",
        element: <OTPVerification />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
