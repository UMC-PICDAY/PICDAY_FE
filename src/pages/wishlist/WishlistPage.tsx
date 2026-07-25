/**
 * Figma G-1 위시리스트 (라우트: /wishlist) — 비로그인 유도/빈 목록/카드 목록 3가지 상태를 한 페이지에서 분기
 */
import { useNavigate } from 'react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import AppTabBar from '@/components/layout/AppTabBar'
import NavigationBar from '@/components/layout/NavigationBar'
import CardStudioFavorite from '@/components/cards/CardStudioFavorite'
import NoticeLogin from '@/components/common/NoticeLogin'
import { IcFavorite } from '@/components/icons'
import { useAuthStore } from '@/stores/useAuthStore'
import { getWishlists, removeWishlist } from '@/services/wishlist'
import type { WishlistResult } from '@/types/wishlist'

const WISHLIST_QUERY_KEY = ['wishlists']

const formatPrice = (minPrice: number | null) =>
  minPrice === null ? undefined : `₩${minPrice.toLocaleString()}~`

const WishlistPage = () => {
  const navigate = useNavigate()
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: WISHLIST_QUERY_KEY,
    queryFn: () => getWishlists(),
    enabled: isLoggedIn,
  })

  const wishlistItems = data?.items ?? []

  const handleRemove = async (studioId: number) => {
    queryClient.setQueryData<WishlistResult>(WISHLIST_QUERY_KEY, (prev) =>
      prev ? { ...prev, items: prev.items.filter((item) => item.studioId !== studioId) } : prev,
    )

    try {
      await removeWishlist(studioId)
    } catch {
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY })
    }
  }

  return (
    <div className="relative flex min-h-dvh w-full flex-col bg-white">
      <NavigationBar title="위시리스트" showLeft={false} showRight={false} />

      {!isLoggedIn ? (
        // G-1 비로그인 로그인 유도
        <div className="flex flex-1 flex-col items-center justify-center p-[10px]">
          <NoticeLogin onLoginClick={() => navigate('/login')} />
        </div>
      ) : wishlistItems.length === 0 ? (
        // G-1 위시리스트 비어있음
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
          {wishlistItems.map((item) => (
            <CardStudioFavorite
              key={item.wishlistId}
              variant="active"
              imageSrc={item.thumbnail}
              name={item.studioName}
              location={item.region ?? undefined}
              price={formatPrice(item.minPrice)}
              className="relative flex w-full flex-col items-start overflow-hidden rounded-[12px] border border-[rgba(238,238,238,0.6)] shadow-[0px_15px_48px_0px_rgba(252,200,215,0.1)] backdrop-blur-[10px] cursor-pointer"
              onClick={() => navigate(`/studios/${item.studioId}`)} // C-5 사진관 상세로 이동
              onFavoriteClick={() => handleRemove(item.studioId)}
            />
          ))}
        </div>
      )}

      <div className="sticky bottom-0 mt-auto w-full">
        <AppTabBar activeTab="wishlist" />
      </div>
    </div>
  )
}

export default WishlistPage
