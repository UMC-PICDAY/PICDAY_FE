/** Figma B-1 로그인 후 홈 (라우트: /home) */
import AppTabBar from '@/components/layout/AppTabBar'
import HomeFeed from '@/pages/home/HomeFeed'

const HomePage = () => {
  return (
    <div className="relative flex min-h-dvh w-full flex-col bg-white">
      <HomeFeed />

      <div className="sticky bottom-0 mt-auto w-full">
        <AppTabBar activeTab="search" />
      </div>
    </div>
  )
}

export default HomePage
