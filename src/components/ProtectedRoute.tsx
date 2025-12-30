import type { ReactNode } from "react"
import { useAuth } from "../context/AuthContext"
import { Navigate } from "react-router-dom";
import Spinner from "./Spinner";


const ProtectedRoute = ({ children }: {children : ReactNode}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Spinner />;
  }

  if(!user) return <Navigate to="/auth/login" />
  return (
    <>{children}</>
  )
}

export default ProtectedRoute