/**
 * AppTabBar 사용법
 *
 * 로그인 여부를 직접 읽어서 TabBarUser/TabBarGuest 중 알맞은 쪽을 그리고,
 * 탭 이동(검색/위시리스트/마이페이지·로그인)까지 내부에서 처리하는 하단 탭바.
 * 화면마다 isLoggedIn 분기·onTabChange 라우팅을 반복해서 작성하지 않도록
 * 이 컴포넌트 하나로 통일한다.
 *
 *   <AppTabBar activeTab="search" />
 *   <AppTabBar activeTab="wishlist" />
 *   <AppTabBar activeTab="mypage" />
 */
import { useNavigate } from 'react-router'

import TabBarGuest from '@/components/layout/TabBarGuest'
import TabBarUser from '@/components/layout/TabBarUser'
import { useAuthStore } from '@/stores/useAuthStore'

interface Props {
  activeTab: 'search' | 'wishlist' | 'mypage'
}

const AppTabBar = ({ activeTab }: Props) => {
  const navigate = useNavigate()
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)

  if (isLoggedIn) {
    return (
      <TabBarUser
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === 'search') navigate('/home')
          if (tab === 'wishlist') navigate('/wishlist')
          if (tab === 'mypage') navigate('/mypage')
        }}
      />
    )
  }

  return (
    <TabBarGuest
      // mypage는 로그인 상태에서만 쓰이는 탭이라 게스트 쪽엔 대응 탭이 없음 — search로 대체
      activeTab={activeTab === 'mypage' ? 'search' : activeTab}
      onTabChange={(tab) => {
        if (tab === 'search') navigate('/')
        if (tab === 'wishlist') navigate('/wishlist')
        if (tab === 'login') navigate('/login')
      }}
    />
  )
}

export default AppTabBar
