import CardStudioPreview from '@/components/cards/CardStudioPreview'
import CompareActionBar from '@/components/common/CompareActionBar'
import FilterBar2 from '@/components/common/FilterBar2'
import MapButton from '@/components/common/MapButton'
import { IcFilter } from '@/components/icons'
import NavigationBar from '@/components/layout/NavigationBar'
import TabBarUser from '@/components/layout/TabBarUser'

const SORT_ITEMS = [
  { value: 'recommended', label: '추천순' },
  { value: 'lowest-price', label: '가격낮은순' },
  { value: 'rating', label: '별점순' },
  { value: 'reviews', label: '리뷰많은순' },
  { value: 'hair-makeup', label: '헤어·메이크업' },
  { value: 'parking', label: '주차' },
]

const STUDIOS = ['데이지스튜디오', '타임스튜디오', '보노스튜디오', '레이스튜디오', '무드스튜디오']

const StudioListFullPage = () => (
  <div className="flex min-h-dvh flex-col bg-white">
    <NavigationBar
      variant="chip"
      chipLabel="프로필·홍대·6월25일"
      rightNode={<IcFilter width={24} height={24} />}
    />
    <FilterBar2 items={SORT_ITEMS} />

    <main className="flex flex-1 flex-col items-center rounded-t-[20px] border border-gray-10/60 bg-white/75 px-5 pb-6 pt-5">
      <div className="h-1 w-11 rounded-full bg-gray-20" />
      <p className="py-2.5 font-b8 text-gray-60">사진관 24 곳</p>

      <div className="flex w-full flex-col gap-5">
        {STUDIOS.map((name) => (
          <CardStudioPreview
            key={name}
            name={name}
            category=""
            secondaryCategory=""
            showCompareButton
            className="relative w-full rounded-[20px] border border-[rgba(254,228,235,0.4)] bg-white/75 p-[10px] shadow-[0px_15px_48px_0px_rgba(252,200,215,0.1)] backdrop-blur-[10px]"
          />
        ))}
      </div>
    </main>

    <div className="flex flex-col items-center">
      <div className="py-5">
        <MapButton />
      </div>
      <CompareActionBar
        selectedLabels={['데이지', '타임']}
        maxSlots={3}
        className="flex w-full flex-col items-start"
      />
      <TabBarUser activeTab="search" />
    </div>
  </div>
)

export default StudioListFullPage
