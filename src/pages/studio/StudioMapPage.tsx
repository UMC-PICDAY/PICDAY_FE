import { useSearchParams } from 'react-router'

import FilterBar2 from '@/components/common/FilterBar2'
import { IcFilter, IcPin } from '@/components/icons'
import NavigationBar from '@/components/layout/NavigationBar'

import BottomSheet from '@/pages/studio/components/BottomSheet'
import ErrorNotice from '@/pages/studio/components/ErrorNotice'

const SORT_ITEMS = [
  { value: 'recommended', label: '추천순' },
  { value: 'lowest-price', label: '가격낮은순' },
  { value: 'rating', label: '별점순' },
  { value: 'reviews', label: '리뷰많은순' },
  { value: 'hair-makeup', label: '헤어·메이크업' },
  { value: 'parking', label: '주차' },
]

const StudioMapPage = () => {
  const [searchParams] = useSearchParams()
  const isError = searchParams.get('state') === 'error'

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <NavigationBar
        variant="chip"
        chipLabel="프로필·홍대·6월25일"
        rightNode={<IcFilter width={24} height={24} />}
      />
      <FilterBar2 items={SORT_ITEMS} />

      {isError ? (
        <div className="flex flex-1 items-center justify-center">
          <ErrorNotice
            icon={<IcPin width={48} height={48} className="text-brand-80" />}
            title="지도를 불러오지 못했어요"
          />
        </div>
      ) : (
        <div className="relative flex-1 bg-gray-10">
          <div className="flex h-full items-start justify-center pt-[100px]">
            <span className="font-b8 text-gray-60">지도 영역</span>
          </div>

          <div className="absolute inset-x-0 bottom-0">
            <BottomSheet className="pb-6 shadow-[0px_-4px_24px_rgba(206,206,206,0.12)]">
              <div className="h-2" />
            </BottomSheet>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudioMapPage
