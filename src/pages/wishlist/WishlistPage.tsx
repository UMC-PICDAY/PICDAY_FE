import { useNavigate } from 'react-router'

import NavigationBar from '@/components/layout/NavigationBar'
import TabBarUser from '@/components/layout/TabBarUser'
import TabBarGuest from '@/components/layout/TabBarGuest'
import CardStudioFavorite from '@/components/cards/CardStudioFavorite'
import NoticeLogin from '@/components/common/NoticeLogin'
import { IcFavorite } from '@/components/icons'
import { useAuthStore } from '@/stores/useAuthStore'

// API 명세가 아직 없어서 목업 데이터로 대체 (실제 API 연동 시 찜한 사진관 목록으로 교체)
const WISHLIST_ITEMS = [
  { name: '데이지 스튜디오', location: '홍대', category: '개인화보', price: '₩30,000~' },
  { name: '데이지 스튜디오', location: '홍대', category: '개인화보', price: '₩30,000~' },
  { name: '데이지 스튜디오', location: '홍대', category: '개인화보', price: '₩30,000~' },
  { name: '데이지 스튜디오', location: '홍대', category: '개인화보', price: '₩30,000~' },
  { name: '데이지 스튜디오', location: '홍대', category: '개인화보', price: '₩30,000~' },
]

const WishlistPage = () => {
  const navigate = useNavigate()
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)

  return (
    <div className="relative flex min-h-dvh w-full flex-col bg-white">
      <NavigationBar title="위시리스트" showLeft={false} showRight={false} />

      {!isLoggedIn ? (
        <div className="flex flex-1 flex-col items-center justify-center p-[10px]">
          <NoticeLogin onLoginClick={() => navigate('/login')} />
        </div>
      ) : WISHLIST_ITEMS.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-5 p-[10px]">
          <div className="flex size-[76px] items-center justify-center rounded-full bg-[rgba(254,228,235,0.4)]">
            <IcFavorite width={36} height={36} className="text-brand-40" />
          </div>
          <p className="whitespace-nowrap font-b3 text-black">저장한 사진관이 없어요</p>
          <button
            type="button"
            className="cursor-pointer rounded-lg border border-brand-20 bg-white px-6 py-[10px] font-b7 text-brand-80"
            onClick={() => navigate('/home')}
          >
            사진관 찾아보기
          </button>
        </div>
      ) : (
        <div className="grid w-full grid-cols-2 gap-4 px-5 py-[10px]">
          {WISHLIST_ITEMS.map((item, index) => (
            <CardStudioFavorite
              key={index}
              variant="active"
              name={item.name}
              location={item.location}
              category={item.category}
              price={item.price}
              className="relative flex w-full flex-col items-start overflow-hidden rounded-[12px] border border-[rgba(238,238,238,0.6)] shadow-[0px_15px_48px_0px_rgba(252,200,215,0.1)] backdrop-blur-[10px]"
            />
          ))}
        </div>
      )}

      <div className="sticky bottom-0 mt-auto w-full">
        {isLoggedIn ? (
          <TabBarUser
            activeTab="wishlist"
            onTabChange={(tab) => {
              if (tab === 'search') navigate('/home')
              if (tab === 'wishlist') navigate('/wishlist')
              if (tab === 'mypage') navigate('/mypage')
            }}
          />
        ) : (
          <TabBarGuest
            activeTab="wishlist"
            onTabChange={(tab) => {
              if (tab === 'search') navigate('/')
              if (tab === 'wishlist') navigate('/wishlist')
              if (tab === 'login') navigate('/login')
            }}
          />
        )}
      </div>
    </div>
  )
}

export default WishlistPage
