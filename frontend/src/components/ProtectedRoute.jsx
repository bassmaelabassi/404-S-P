import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const ProtectedRoute = ({
  children,
  allowedRoles = [],
  requireEmailVerification = false,
  requirePhoneVerification = false,
}) => {
  const { user, loading, authChecked } = useAuth()
  const location = useLocation()

  if (loading || !authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (requireEmailVerification && !user.emailVerified) {
    return <Navigate to="/verify-email" state={{ from: location.pathname }} replace />
  }

  if (requirePhoneVerification && !user.phoneVerified) {
    return <Navigate to="/verify-phone" state={{ from: location.pathname }} replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute