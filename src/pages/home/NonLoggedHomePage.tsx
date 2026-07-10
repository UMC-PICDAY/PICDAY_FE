import { useEffect } from 'react'
import { useNavigate } from 'react-router'

import TabBarGuest from '@/components/layout/TabBarGuest'
import HomeFeed from '@/pages/home/HomeFeed'
import { useAuthStore } from '@/stores/useAuthStore'

const NonLoggedHomePage = () => {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)

  useEffect(() => {
    logout()
  }, [logout])

  return (
    <div className="relative flex min-h-dvh w-full flex-col bg-white">
      <HomeFeed />

      <div className="sticky bottom-0 mt-auto w-full">
        <TabBarGuest
          activeTab="search"
          onTabChange={(tab) => {
            if (tab === 'wishlist') navigate('/wishlist')
            if (tab === 'login') navigate('/login')
          }}
        />
      </div>
    </div>
  )
}

export default NonLoggedHomePage
