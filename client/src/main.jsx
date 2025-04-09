import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import SignUpForm from "./components/Signup.jsx";
import SignInForm from "./components/Signin.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    Component: <App />,
    children: [
      { index: true, Component: SignIn },
      { path: "login", Component: <SignInForm /> },
      { path: "signup", Component: <SignUpForm /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
