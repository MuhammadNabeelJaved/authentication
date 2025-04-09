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
    element: <App />,
    children: [
      {
        path: "/",
        element: <App />,
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
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
