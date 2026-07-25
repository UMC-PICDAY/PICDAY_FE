import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'

import FilterChip from '@/components/common/FilterChip'
import RangeSlider from '@/components/common/RangeSlider'
import NavigationBar from '@/components/layout/NavigationBar'
import {
  hasBaseSearchCondition,
  parseStudioSearchParams,
  serializeStudioSearchParams,
  STUDIO_PURPOSES,
  STUDIO_SERVICE_OPTIONS,
  type StudioServiceTag,
} from '@/utils/studioSearchParams'

const RATINGS = [
  { value: undefined, label: '전체' },
  { value: 4, label: '★4.0이상' },
  { value: 4.5, label: '★4.5이상' },
  { value: 4.8, label: '★4.8이상' },
] as const

const PRICE_MIN = 30000
const PRICE_MAX = 150000

const formatKRW = (value: number) => `₩${value.toLocaleString('ko-KR')}`

const toggle = <T extends string>(list: T[], value: T) =>
  list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value]

const FilterPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialFilters = parseStudioSearchParams(searchParams)
  const [purposes, setPurposes] = useState<string[]>(initialFilters.concepts)
  const [services, setServices] = useState<StudioServiceTag[]>(initialFilters.services)
  const [rating, setRating] = useState<number | undefined>(initialFilters.minRating)
  const [price, setPrice] = useState<[number, number]>([
    Math.max(PRICE_MIN, initialFilters.minPrice ?? PRICE_MIN),
    Math.min(PRICE_MAX, initialFilters.maxPrice ?? PRICE_MAX),
  ])

  const canApply = hasBaseSearchCondition({ ...initialFilters, concepts: purposes })

  const handleReset = () => {
    setPurposes([])
    setServices([])
    setRating(undefined)
    setPrice([PRICE_MIN, PRICE_MAX])
  }

  const handleApply = () => {
    if (!canApply) return

    const nextFilters = {
      ...initialFilters,
      concepts: purposes,
      services,
      minRating: rating,
      minPrice: price[0] === PRICE_MIN ? undefined : price[0],
      maxPrice: price[1] === PRICE_MAX ? undefined : price[1],
    }
    const params = serializeStudioSearchParams(nextFilters, searchParams)
    navigate({ pathname: '/studios', search: `?${params.toString()}` })
  }

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <NavigationBar
        variant="default"
        title="필터"
        showLeft={false}
        onClose={() => navigate(-1)}
      />

      <main className="flex-1 px-5 pb-6 pt-2">
        {/* 촬영 목적 */}
        <section className="pb-5">
          <h2 className="pb-3 font-b5 text-black">촬영 목적</h2>
          <div className="grid grid-cols-3 gap-2">
            {STUDIO_PURPOSES.map((purpose) => (
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
            {STUDIO_SERVICE_OPTIONS.map((service) => (
              <FilterChip
                key={service.value}
                label={service.label}
                size="large"
                selected={services.includes(service.value)}
                onClick={() => setServices((prev) => toggle(prev, service.value))}
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
                key={item.label}
                label={item.label}
                size="large"
                selected={rating === item.value}
                onClick={() => setRating(item.value)}
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
          onClick={handleApply}
          disabled={!canApply}
          className="flex h-12 items-center justify-center rounded-lg bg-brand-100 px-8 font-b5 text-white disabled:cursor-not-allowed disabled:bg-gray-20"
        >
          사진관 24곳 보기
        </button>
      </div>
    </div>
  )
}

export default FilterPage
