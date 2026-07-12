import { useState } from 'react'
import { useSearchParams } from 'react-router'

import CardStudioSmall from '@/components/cards/CardStudioSmall'
import CompareActionBar from '@/components/common/CompareActionBar'
import FilterBar2 from '@/components/common/FilterBar2'
import MapButton from '@/components/common/MapButton'
import Notice2 from '@/components/common/Notice2'
import { IcFilter, IcPin } from '@/components/icons'
import NavigationBar from '@/components/layout/NavigationBar'
import TabBarUser from '@/components/layout/TabBarUser'

import ErrorNotice from '@/pages/studio/components/ErrorNotice'
import StudioMapCanvas from '@/pages/studio/components/StudioMapCanvas'
import StudioResultsBottomSheet from '@/pages/studio/components/StudioResultsBottomSheet'
import StudioResultsList from '@/pages/studio/components/StudioResultsList'
import { useBottomSheetSnap } from '@/pages/studio/hooks/useBottomSheetSnap'
import type { SheetSnap } from '@/pages/studio/hooks/useBottomSheetSnap'

import cardImage1 from '@/assets/images/CardImage1.png'
import cardImage2 from '@/assets/images/CardImage2.png'
import cardImage3 from '@/assets/images/CardImage3.png'

type ResultStatus = 'loading' | 'success' | 'empty' | 'map-error'

const SORT_ITEMS = [
  { value: 'recommended', label: '추천순' },
  { value: 'lowest-price', label: '가격낮은순' },
  { value: 'rating', label: '별점순' },
  { value: 'reviews', label: '리뷰많은순' },
  { value: 'hair-makeup', label: '헤어·메이크업' },
  { value: 'parking', label: '주차' },
]

const RECOMMENDATIONS = [
  { name: '데이지 스튜디오', image: cardImage1 },
  { name: '타임 스튜디오', image: cardImage2 },
  { name: '보노 스튜디오', image: cardImage3 },
]

const resolveStatus = (state: string | null): ResultStatus => {
  if (state === 'empty') return 'empty'
  if (state === 'error') return 'map-error'
  return 'success'
}

const isSheetSnap = (value: string | null): value is SheetSnap =>
  value === 'collapsed' || value === 'half' || value === 'expanded'

const StudioSearchPage = () => {
  const [searchParams] = useSearchParams()
  const status = resolveStatus(searchParams.get('state'))
  const snapParam = searchParams.get('snap')
  const initialSnap: SheetSnap = isSheetSnap(snapParam)
    ? snapParam
    : status === 'empty'
      ? 'expanded'
      : 'half'

  const [snap, setSnap] = useState<SheetSnap>(initialSnap)
  const {
    containerRef,
    listRef,
    translateY,
    isDragging,
    handleHandlers,
    listHandlers,
  } = useBottomSheetSnap({ snap, onSnapChange: setSnap })

  const sheetShellProps = {
    snap,
    translateY,
    isDragging,
    handleHandlers,
    listHandlers,
    listRef,
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-white">
      <NavigationBar
        variant="chip"
        chipLabel="프로필·홍대·6월25일"
        rightNode={<IcFilter width={24} height={24} />}
      />
      <FilterBar2 items={SORT_ITEMS} />

      <div ref={containerRef} className="relative flex-1 overflow-hidden">
        <StudioMapCanvas interactive={!isDragging} />

        {status === 'map-error' ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-10">
            <ErrorNotice
              icon={<IcPin width={48} height={48} className="text-brand-80" />}
              title="지도를 불러오지 못했어요"
            />
          </div>
        ) : status === 'empty' ? (
          <StudioResultsBottomSheet
            {...sheetShellProps}
            header={<p className="py-2.5 font-b10 text-gray-40">검색 결과 0곳</p>}
            footer={<TabBarUser activeTab="search" />}
          >
            <div className="flex flex-col pb-6">
              <div className="flex justify-center pb-[50px] pt-2.5">
                <Notice2 />
              </div>
              <section>
                <h2 className="pb-3 font-b5 text-black">이런 사진관은 어때요?</h2>
                <div className="flex gap-3 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {RECOMMENDATIONS.map((studio) => (
                    <CardStudioSmall
                      key={studio.name}
                      name={studio.name}
                      imageSrc={studio.image}
                      location="홍대"
                      category="프로필"
                      secondaryCategory="프로필"
                    />
                  ))}
                </div>
              </section>
            </div>
          </StudioResultsBottomSheet>
        ) : (
          <StudioResultsBottomSheet
            {...sheetShellProps}
            header={<p className="py-2.5 font-b8 text-gray-60">사진관 24 곳</p>}
            footer={
              <div className="relative">
                <div className="pointer-events-none absolute inset-x-0 -top-14 flex justify-center">
                  <div className="pointer-events-auto">
                    <MapButton onClick={() => setSnap('collapsed')} />
                  </div>
                </div>
                <CompareActionBar
                  selectedLabels={['데이지', '타임']}
                  maxSlots={3}
                  className="flex w-full flex-col items-start"
                />
                <TabBarUser activeTab="search" />
              </div>
            }
          >
            <StudioResultsList showCompareButton={snap === 'expanded'} />
          </StudioResultsBottomSheet>
        )}
      </div>
    </div>
  )
}

export default StudioSearchPage
