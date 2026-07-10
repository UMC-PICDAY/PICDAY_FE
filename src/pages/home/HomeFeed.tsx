import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'

import TopAppBar from '@/components/layout/TopAppBar'
import SearchField from '@/components/common/SearchField'
import Title from '@/components/common/Title'
import CardStudioLarge from '@/components/cards/CardStudioLarge'
import CardStudio from '@/components/cards/CardStudio'

const HORIZONTAL_SCROLL_CLASS =
  'flex w-full gap-3 overflow-x-auto px-5 pb-[10px] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'

// API 명세가 아직 없어서 지역은 목업으로 랜덤 노출 (추후 실제 위치 기반 API 연동 시 교체)
const REGIONS = ['홍대', '연남', '합정', '성수', '건대', '이태원', '강남', '압구정', '신촌', '여의도']
const RECENT_CARD_COUNT = 3
const POPULAR_CARD_COUNT = 7
const REGION_CARD_COUNT = 7

const pickRandomRegion = () => REGIONS[Math.floor(Math.random() * REGIONS.length)]
const pickRandomRegions = (count: number) => Array.from({ length: count }, pickRandomRegion)

const LARGE_CARD_COUNT = 5
// 앞뒤로 마지막/첫 카드를 하나씩 복제해 무한 순환처럼 보이게 함 (index 0 = 복제된 마지막, 1~N = 실제, N+1 = 복제된 1번)
const PADDED_CARD_COUNT = LARGE_CARD_COUNT + 2
const FIRST_REAL_INDEX = 1
const LAST_REAL_INDEX = LARGE_CARD_COUNT

const getRealCardNumber = (renderedIndex: number) => {
  if (renderedIndex === 0) return LARGE_CARD_COUNT
  if (renderedIndex === PADDED_CARD_COUNT - 1) return 1
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
 * 홈 화면 공통 컨텐츠 (검색창 + 캐러셀 + 사진관 리스트 3종)
 * 로그인/비로그인 홈은 하단 탭바만 다르고 이 영역은 동일해서 공유함
 */
const HomeFeed = () => {
  const navigate = useNavigate()
  const largeCardScrollRef = useRef<HTMLDivElement>(null)
  const [activeRenderedIndex, setActiveRenderedIndex] = useState(FIRST_REAL_INDEX)
  const activeRenderedIndexRef = useRef(FIRST_REAL_INDEX)

  const regionTitle = useMemo(() => pickRandomRegion(), [])
  // 최근 본 사진관은 로그인 여부와 무관하게(로컬 방문 기록 기준) 노출됨 — 0개면 섹션 자체를 숨김
  const recentLocations = useMemo(() => pickRandomRegions(RECENT_CARD_COUNT), [])
  const popularLocations = useMemo(() => pickRandomRegions(POPULAR_CARD_COUNT), [])
  const regionLocations = useMemo(() => pickRandomRegions(REGION_CARD_COUNT), [])

  useEffect(() => {
    activeRenderedIndexRef.current = activeRenderedIndex
  }, [activeRenderedIndex])

  const largeCardItems = Array.from({ length: PADDED_CARD_COUNT }, (_, renderedIndex) => ({
    variant: (renderedIndex === activeRenderedIndex ? 'center' : 'default') as 'center' | 'default',
    countCurrent: String(getRealCardNumber(renderedIndex)).padStart(2, '0'),
    countTotal: String(LARGE_CARD_COUNT).padStart(2, '0'),
  }))

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
    if (!container) return

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

        if (current === 0) targetIndex = LAST_REAL_INDEX
        else if (current === PADDED_CARD_COUNT - 1) targetIndex = FIRST_REAL_INDEX

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
  }, [updateActiveLargeCard])

  useEffect(() => {
    const container = largeCardScrollRef.current
    if (!container) return
    centerItemAt(container, FIRST_REAL_INDEX)
  }, [])

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

      <div
        ref={largeCardScrollRef}
        className="w-full overflow-x-auto py-[10px] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <CardStudioLarge items={largeCardItems} className="relative flex items-center gap-[20px]" />
      </div>

      {recentLocations.length > 0 && (
        <>
          <Title variant="onlyTitle" title="최근 본 사진관" />
          <div className={HORIZONTAL_SCROLL_CLASS}>
            {recentLocations.map((location, index) => (
              <div className="shrink-0" key={index}>
                <CardStudio location={location} />
              </div>
            ))}
          </div>
        </>
      )}

      <Title variant="onlyTitle" title="지금 인기 있는 사진관" />
      <div className={HORIZONTAL_SCROLL_CLASS}>
        {popularLocations.map((location, index) => (
          <div className="shrink-0" key={index}>
            <CardStudio location={location} />
          </div>
        ))}
      </div>

      <Title variant="onlyTitle" title={`${regionTitle}의 사진관`} />
      <div className={HORIZONTAL_SCROLL_CLASS}>
        {regionLocations.map((location, index) => (
          <div className="shrink-0" key={index}>
            <CardStudio location={location} />
          </div>
        ))}
      </div>
    </>
  )
}

export default HomeFeed
