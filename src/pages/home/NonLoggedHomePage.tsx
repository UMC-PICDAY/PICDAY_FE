/**
 * Figma A-1 비로그인 홈 (라우트: /)
 * 검색창·캐러셀·사진관 리스트는 HomeFeed로 로그인 홈(B-1 HomePage)과 공유하고, 하단 탭바만 Guest용으로 다름
 */
import { useNavigate } from 'react-router'

import TabBarGuest from '@/components/layout/TabBarGuest'
import HomeFeed from '@/pages/home/HomeFeed'

const NonLoggedHomePage = () => {
  const navigate = useNavigate()

  return (
    <div className="relative flex min-h-dvh w-full flex-col bg-white">
      <HomeFeed />

      <div className="sticky bottom-0 mt-auto w-full">
        <TabBarGuest
          activeTab="search"
          onTabChange={(tab) => {
            if (tab === 'search') navigate('/search')
            if (tab === 'wishlist') navigate('/wishlist')
            if (tab === 'login') navigate('/login')
          }}
        />
      </div>
    </div>
  )
}

export default NonLoggedHomePage
