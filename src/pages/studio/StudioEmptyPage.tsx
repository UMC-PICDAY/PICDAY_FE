import CardStudioSmall from '@/components/cards/CardStudioSmall'
import FilterBar2 from '@/components/common/FilterBar2'
import Notice2 from '@/components/common/Notice2'
import { IcFilter } from '@/components/icons'
import NavigationBar from '@/components/layout/NavigationBar'
import TabBarUser from '@/components/layout/TabBarUser'

import cardImage1 from '@/assets/images/CardImage1.png'
import cardImage2 from '@/assets/images/CardImage2.png'
import cardImage3 from '@/assets/images/CardImage3.png'

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

const StudioEmptyPage = () => (
  <div className="flex min-h-dvh flex-col bg-white">
    <NavigationBar
      variant="chip"
      chipLabel="프로필·홍대·6월25일"
      rightNode={<IcFilter width={24} height={24} />}
    />
    <FilterBar2 items={SORT_ITEMS} />

    <main className="flex flex-1 flex-col">
      <p className="px-5 py-2.5 font-b10 text-gray-40">검색 결과 0곳</p>

      <div className="flex justify-center px-5 pb-[50px] pt-2.5">
        <Notice2 />
      </div>

      <section>
        <h2 className="px-2.5 pb-3 font-b5 text-black">이런 사진관은 어때요?</h2>
        <div className="flex gap-3 overflow-x-auto px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
    </main>

    <TabBarUser activeTab="search" />
  </div>
)

export default StudioEmptyPage
