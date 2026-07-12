/**
 * Figma B-1 로그인 후 홈 (라우트: /home)
 * 실제 로그인 API가 없어서, 이 라우트 진입 자체를 로그인 완료 신호로 보고 useAuthStore.login()을 호출함
 */
import { useEffect } from 'react'
import { useNavigate } from 'react-router'

import TabBarUser from '@/components/layout/TabBarUser'
import HomeFeed from '@/pages/home/HomeFeed'
import { useAuthStore } from '@/stores/useAuthStore'

const HomePage = () => {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)

  useEffect(() => {
    login()
  }, [login])

  return (
    <div className="relative flex min-h-dvh w-full flex-col bg-white">
      <HomeFeed />

      <div className="sticky bottom-0 mt-auto w-full">
        <TabBarUser
          activeTab="search"
          onTabChange={(tab) => {
            if (tab === 'wishlist') navigate('/wishlist')
            if (tab === 'mypage') navigate('/mypage')
          }}
        />
      </div>
    </div>
  )
}

export default HomePage
