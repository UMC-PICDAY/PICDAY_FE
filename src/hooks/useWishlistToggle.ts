import { addWishlist, removeWishlist } from '@/services/wishlist'

interface ToggleWishlistOptions {
  onError: (error: unknown) => void
}

/**
 * 찜 추가/삭제 API 호출만 공용으로 처리하는 훅. 낙관적 업데이트(로컬 state 또는
 * TanStack Query 캐시 패치)와 실패 시 되돌리기·토스트 노출은 화면마다 상태 모양이
 * 달라 호출부에서 직접 한다 — 이 훅은 "next가 true면 addWishlist, 아니면
 * removeWishlist, 실패하면 onError" 라는 반복되던 부분만 없앤다.
 *
 *   const { toggleWishlist } = useWishlistToggle()
 *   const next = !favorited
 *   setFavorited(next)
 *   await toggleWishlist(studioId, next, {
 *     onError: () => {
 *       setFavorited(!next)
 *       showToast('찜 처리에 실패했어요. 다시 시도해 주세요')
 *     },
 *   })
 */
export const useWishlistToggle = () => {
  const toggleWishlist = async (
    studioId: number,
    next: boolean,
    { onError }: ToggleWishlistOptions,
  ) => {
    try {
      if (next) {
        await addWishlist(studioId)
      } else {
        await removeWishlist(studioId)
      }
    } catch (error) {
      onError(error)
    }
  }

  return { toggleWishlist }
}
