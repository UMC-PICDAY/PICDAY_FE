import { useState } from 'react'
import { useNavigate } from 'react-router'

import FilterChip from '@/components/common/FilterChip'
import RangeSlider from '@/components/common/RangeSlider'
import NavigationBar from '@/components/layout/NavigationBar'

const PURPOSES = ['증명', '프로필', '개인화보', '취업', '가족', '우정']
const SERVICES = ['헤어·메이크업 연계', '의상비치', '주차가능']
const RATINGS = ['전체', '★4.0이상', '★4.5이상', '★4.8이상']

const PRICE_MIN = 30000
const PRICE_MAX = 150000

const formatKRW = (value: number) => `₩${value.toLocaleString('ko-KR')}`

const toggle = (list: string[], value: string) =>
  list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value]

const FilterPage = () => {
  const navigate = useNavigate()
  const [purposes, setPurposes] = useState<string[]>(['증명'])
  const [services, setServices] = useState<string[]>(['헤어·메이크업 연계'])
  const [rating, setRating] = useState('전체')
  const [price, setPrice] = useState<[number, number]>([PRICE_MIN, PRICE_MAX])

  const handleReset = () => {
    setPurposes([])
    setServices([])
    setRating('전체')
    setPrice([PRICE_MIN, PRICE_MAX])
  }

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <NavigationBar variant="default" title="필터" showLeft={false} />

      <main className="flex-1 px-5 pb-6 pt-2">
        {/* 촬영 목적 */}
        <section className="pb-5">
          <h2 className="pb-3 font-b5 text-black">촬영 목적</h2>
          <div className="grid grid-cols-3 gap-2">
            {PURPOSES.map((purpose) => (
              <FilterChip
                key={purpose}
                label={purpose}
                size="large"
                selected={purposes.includes(purpose)}
                onClick={() => setPurposes((prev) => toggle(prev, purpose))}
                className="w-full"
              />
            ))}
          </div>
        </section>

        {/* 가격 범위 */}
        <section className="pb-5">
          <h2 className="font-b5 text-black">가격 범위</h2>
          <p className="pb-3 font-b8 text-gray-40">모든 추가금 포함</p>
          <div className="mb-3 flex items-center justify-center rounded-lg bg-brand-20 px-3 py-2">
            <span className="font-b7 text-black">
              {formatKRW(price[0])} ~ {formatKRW(price[1])}
            </span>
          </div>
          <RangeSlider
            variant="active"
            min={PRICE_MIN}
            max={PRICE_MAX}
            value={price}
            onValueChange={setPrice}
          />
        </section>

        {/* 연계 서비스 */}
        <section className="pb-5">
          <h2 className="pb-3 font-b5 text-black">연계 서비스</h2>
          <div className="flex flex-wrap gap-2">
            {SERVICES.map((service) => (
              <FilterChip
                key={service}
                label={service}
                size="large"
                selected={services.includes(service)}
                onClick={() => setServices((prev) => toggle(prev, service))}
              />
            ))}
          </div>
        </section>

        {/* 별점 */}
        <section className="pb-5">
          <h2 className="pb-3 font-b5 text-black">별점</h2>
          <div className="flex flex-wrap gap-2">
            {RATINGS.map((item) => (
              <FilterChip
                key={item}
                label={item}
                size="large"
                selected={rating === item}
                onClick={() => setRating(item)}
              />
            ))}
          </div>
        </section>
      </main>

      <div className="flex items-center justify-between px-5 pb-4">
        <button
          type="button"
          onClick={handleReset}
          className="font-cap1 text-gray-40"
        >
          전체 해제
        </button>
        <button
          type="button"
          onClick={() => navigate('/studios')}
          className="flex h-12 items-center justify-center rounded-lg bg-brand-100 px-8 font-b5 text-white"
        >
          사진관 24곳 보기
        </button>
      </div>
    </div>
  )
}

export default FilterPage
