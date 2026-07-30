import { Navigate, Outlet } from 'react-router'

import { useAuthStore } from '@/stores/useAuthStore'

const RequireAuth = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default RequireAuth
