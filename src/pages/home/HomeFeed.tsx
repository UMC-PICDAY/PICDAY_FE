import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useQuery } from '@tanstack/react-query'

import TopAppBar from '@/components/layout/TopAppBar'
import SearchField from '@/components/common/SearchField'
import Title from '@/components/common/Title'
import CardStudioLarge from '@/components/cards/CardStudioLarge'
import CardStudio from '@/components/cards/CardStudio'
import { getLocationLabel } from '@/constants/locationCategory'
import HomeSkeleton from '@/pages/home/components/HomeSkeleton'
import { getHome } from '@/services/studio'
import type { StudioSummary } from '@/types/studio'

const HORIZONTAL_SCROLL_CLASS =
  'flex w-full gap-3 overflow-x-auto px-5 pb-[10px] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'

const formatPrice = (minPrice: number | null) =>
  minPrice === null ? '가격 정보 없음' : `₩${minPrice.toLocaleString()}~`

// 앞뒤로 마지막/첫 배너를 하나씩 복제해 무한 순환처럼 보이게 함 (index 0 = 복제된 마지막, 1~N = 실제, N+1 = 복제된 1번)
const getRealCardNumber = (renderedIndex: number, bannerCount: number) => {
  if (renderedIndex === 0) return bannerCount
  if (renderedIndex === bannerCount + 1) return 1
  return renderedIndex
}

const getLargeCardElements = (container: HTMLDivElement | null) => {
  const wrapper = container?.firstElementChild as HTMLElement | null | undefined
  if (!wrapper) return []
  return Array.from(wrapper.children) as HTMLElement[]
}

const centerItemAt = (container: HTMLDivElement, renderedIndex: number) => {
  const target = getLargeCardElements(container)[renderedIndex]
  if (!target) return
  container.scrollLeft = target.offsetLeft + target.offsetWidth / 2 - container.clientWidth / 2
}

/**
 * Figma A-1(비로그인 홈)/B-1(로그인 후 홈) 공통 컨텐츠 (검색창 + 캐러셀 + 사진관 리스트 3종)
 * 두 홈은 하단 탭바만 다르고 이 영역은 동일해서 공유함
 */
const GEOLOCATION_TIMEOUT_MS = 3000

const HomeFeed = () => {
  const navigate = useNavigate()
  const largeCardScrollRef = useRef<HTMLDivElement>(null)
  const [activeRenderedIndex, setActiveRenderedIndex] = useState(1)
  const activeRenderedIndexRef = useRef(1)

  // 위치 권한이 없거나 응답이 늦어도 홈이 무한정 안 뜨지 않도록, 짧은 타임아웃 안에 시도만 하고
  // 못 받으면 좌표 없이(기본 지역 기준) 먼저 홈을 요청한다.
  // getCurrentPosition의 timeout 옵션은 권한 팝업이 떠 있는 동안은 안 흐르는 브라우저가 있어서
  // (사용자가 팝업에 응답을 안 하면 콜백도 timeout도 영영 안 옴), 별도 타이머로 locationSettled만
  // 강제로 풀어준다. coords는 이 타이머와 무관하게 승인 응답이 오면 그때 반영 — 늦게 승인해도
  // queryKey가 바뀌면서 위치 기준으로 자동 재조회된다.
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null)
  const [locationSettled, setLocationSettled] = useState(false)

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationSettled(true)
      return
    }

    const fallbackTimer = window.setTimeout(() => setLocationSettled(true), GEOLOCATION_TIMEOUT_MS)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
        setLocationSettled(true)
      },
      () => setLocationSettled(true),
      { timeout: GEOLOCATION_TIMEOUT_MS },
    )

    return () => window.clearTimeout(fallbackTimer)
  }, [])

  const { data } = useQuery({
    queryKey: ['home', coords],
    queryFn: () => getHome(coords ?? undefined),
    enabled: locationSettled,
  })

  const bannerStudios = data?.bannerStudios ?? []
  // recentStudios는 로그인 사용자에게만 응답에 포함됨 — 없으면 섹션 자체를 숨김
  const recentStudios = data?.recentStudios ?? []
  const popularStudios = data?.popularStudios ?? []
  const regionalStudios = data?.regionalStudios

  const bannerCount = bannerStudios.length
  const paddedCount = bannerCount + 2
  const firstRealIndex = 1
  const lastRealIndex = bannerCount

  useEffect(() => {
    activeRenderedIndexRef.current = activeRenderedIndex
  }, [activeRenderedIndex])

  const largeCardItems = Array.from({ length: paddedCount }, (_, renderedIndex) => {
    const banner = bannerStudios[getRealCardNumber(renderedIndex, bannerCount) - 1]
    return {
      variant: (renderedIndex === activeRenderedIndex ? 'center' : 'default') as 'center' | 'default',
      imageSrc: banner?.thumbnailUrl,
      name: banner?.studioName,
      location: banner ? getLocationLabel(banner.locationCategory) : undefined,
      countCurrent: String(getRealCardNumber(renderedIndex, bannerCount)).padStart(2, '0'),
      countTotal: String(bannerCount).padStart(2, '0'),
      onClick: banner ? () => navigate(`/studios/${banner.studioId}`) : undefined,
    }
  })

  const updateActiveLargeCard = useCallback(() => {
    const container = largeCardScrollRef.current
    if (!container) return
    const items = getLargeCardElements(container)
    if (items.length === 0) return

    const containerCenter = container.scrollLeft + container.clientWidth / 2

    let closestIndex = 0
    let closestDistance = Infinity
    items.forEach((el, index) => {
      const itemCenter = el.offsetLeft + el.offsetWidth / 2
      const distance = Math.abs(itemCenter - containerCenter)
      if (distance < closestDistance) {
        closestDistance = distance
        closestIndex = index
      }
    })

    setActiveRenderedIndex((prev) => (prev === closestIndex ? prev : closestIndex))
  }, [])

  useEffect(() => {
    const container = largeCardScrollRef.current
    if (!container || bannerCount === 0) return

    let frame: number
    let settleTimer: ReturnType<typeof setTimeout>

    const handleScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(updateActiveLargeCard)

      // 스크롤이 멈췄을 때 복제 카드(맨 앞/뒤)에 있으면 진짜 카드 위치로 순간 이동시켜 순환 착시를 만듦
      clearTimeout(settleTimer)
      settleTimer = setTimeout(() => {
        const current = activeRenderedIndexRef.current
        let targetIndex: number | null = null

        if (current === 0) targetIndex = lastRealIndex
        else if (current === paddedCount - 1) targetIndex = firstRealIndex

        if (targetIndex === null) return

        centerItemAt(container, targetIndex)
        setActiveRenderedIndex(targetIndex)
      }, 150)
    }

    container.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      container.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(frame)
      clearTimeout(settleTimer)
    }
  }, [updateActiveLargeCard, bannerCount, paddedCount, firstRealIndex, lastRealIndex])

  useEffect(() => {
    const container = largeCardScrollRef.current
    if (!container || bannerCount === 0) return
    centerItemAt(container, firstRealIndex)
    setActiveRenderedIndex(firstRealIndex)
  }, [bannerCount, firstRealIndex])

  const renderStudioRow = (studios: StudioSummary[]) =>
    studios.map((studio) => (
      <div className="shrink-0" key={studio.studioId}>
        <CardStudio
          imageSrc={studio.thumbnailUrl}
          name={studio.studioName}
          location={getLocationLabel(studio.locationCategory)}
          price={formatPrice(studio.minPrice)}
          rating={studio.rating.toFixed(1)}
          onClick={() => navigate(`/studios/${studio.studioId}`)}
        />
      </div>
    ))

  return (
    <>
      <div className="sticky top-0 z-10 w-full bg-white">
        <TopAppBar />

        <div className="flex w-full flex-col items-center px-5 py-[10px]">
          <div className="w-full cursor-pointer" onClick={() => navigate('/search')}>
            <SearchField variant="input" value="" placeholder="사진관을 검색해 보세요" />
          </div>
        </div>
      </div>

      {!data ? (
        <HomeSkeleton />
      ) : (
        <>
          {bannerCount > 0 && (
            <div
              ref={largeCardScrollRef}
              className="w-full overflow-x-auto py-[10px] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <CardStudioLarge items={largeCardItems} className="relative flex items-center gap-[20px]" />
            </div>
          )}

          {recentStudios.length > 0 && (
            <>
              <Title variant="onlyTitle" title="최근 본 사진관" />
              <div className={HORIZONTAL_SCROLL_CLASS}>{renderStudioRow(recentStudios)}</div>
            </>
          )}

          <Title variant="onlyTitle" title="지금 인기 있는 사진관" />
          <div className={HORIZONTAL_SCROLL_CLASS}>{renderStudioRow(popularStudios)}</div>

          {regionalStudios && (
            <>
              <Title
                variant="onlyTitle"
                title={`${getLocationLabel(regionalStudios.locationCategory)}의 사진관`}
              />
              <div className={HORIZONTAL_SCROLL_CLASS}>{renderStudioRow(regionalStudios.studios)}</div>
            </>
          )}
        </>
      )}
    </>
  )
}

export default HomeFeed
