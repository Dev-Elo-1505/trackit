import type { ReactNode } from "react"
import { useAuth } from "../context/AuthContext"
import { Navigate } from "react-router-dom";


const ProtectedRoute = ({ children }: {children : ReactNode}) => {
  const { user } = useAuth();

  if(!user) return <Navigate to="/auth/login" />
  return (
    <>{children}</>
  )
}

export default ProtectedRoute