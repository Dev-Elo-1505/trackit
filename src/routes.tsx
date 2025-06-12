// src/routes.tsx
import { createBrowserRouter } from "react-router-dom";
import LandingLayout from "./layouts/LandingLayout";
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ErrorPage from "./pages/ErrorPage";
import ProtectedRoute from "./components/ProtectedRoute";
import SignUpPage from "./pages/SignUpPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignUpPage /> },
    ],
  },
  {
    path: "/",
    element: <ProtectedRoute />, 
    children: [
      {
        path: "dashboard",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
        ],
      },
    ],
  },
]);

export default router;
