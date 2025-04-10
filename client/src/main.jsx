import React, { useContext } from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import SignUpForm from "./components/Signup.jsx";
import SignInForm from "./components/Signin.jsx";
import HomePage from "./components/Home.jsx";
import { AuthContext } from "./components/AuthContext.jsx";
import { AuthProvider } from "./components/AuthContext.jsx";
import { useAuth } from "./components/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoutes.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SignUpForm />,
    children: [
      {
        path: "/",
        element: <SignUpForm />,
      },
    ],
  },
  {
    path: "/signin",
    element: <SignInForm />,
    children: [
      // {
      //   path: "/signin",
      //   element: <SignInForm />,
      // },
    ],
  },
  {
    path: "/signup",
    element: <SignUpForm />,
    children: [
      // {
      //   path: "/signin",
      //   element: <SignInForm />,
      // },
    ],
  },
  {
    path: "/home",
    element: <ProtectedRoute element={<HomePage />} />,
    children: [
      // {
      //   path: "/signin",
      //   element: <SignInForm />,
      // },
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
