import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'

import FilterChip from '@/components/common/FilterChip'
import RangeSlider from '@/components/common/RangeSlider'
import NavigationBar from '@/components/layout/NavigationBar'
import { hasBaseSearchCondition, useStudioSearch } from '@/hooks/useStudio'
import { SHOOTING_CATEGORY_LABEL } from '@/constants/shootingCategory'
import {
  getStudioServiceLabel,
  STUDIO_SERVICE_FILTER_CODES,
} from '@/constants/studioService'
import {
  parseStudioSearchParams,
  serializeStudioSearchParams,
} from '@/utils/studioSearchParams'
import type { StudioServiceTag } from '@/types/studio'

const RATINGS = [
  { value: undefined, label: '전체' },
  { value: 4, label: '★4.0이상' },
  { value: 4.5, label: '★4.5이상' },
  { value: 4.8, label: '★4.8이상' },
] as const

const PRICE_MIN = 0
const PRICE_MAX = 150000

const formatKRW = (value: number) => `₩${value.toLocaleString('ko-KR')}`

// 상한이 최대치면 maxPrice를 보내지 않아 실제로는 상한이 없다. 슬라이더 눈금과 같게 +를 붙인다.
const formatUpperKRW = (value: number) =>
  value === PRICE_MAX ? `${formatKRW(value)}+` : formatKRW(value)

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

  // 선택 중인 필터를 그대로 반영한 조건 — 결과 수 미리보기와 적용에 함께 쓴다.
  const draftFilters = {
    ...initialFilters,
    concepts: purposes,
    services,
    minRating: rating,
    minPrice: price[0] === PRICE_MIN ? undefined : price[0],
    maxPrice: price[1] === PRICE_MAX ? undefined : price[1],
  }

  const canApply = hasBaseSearchCondition(draftFilters)

  const { data: preview, isLoading: isPreviewLoading } = useStudioSearch(draftFilters)
  const totalCount = preview?.totalCount

  const applyLabel =
    canApply && !isPreviewLoading && totalCount !== undefined
      ? `사진관 ${totalCount}곳 보기`
      : '사진관 보기'

  const handleReset = () => {
    setPurposes([])
    setServices([])
    setRating(undefined)
    setPrice([PRICE_MIN, PRICE_MAX])
  }

  const handleApply = () => {
    if (!canApply) return

    const params = serializeStudioSearchParams(draftFilters, searchParams)
    // 적용을 끝낸 필터 화면은 히스토리에서 걷어낸다. 그대로 쌓으면 결과 화면에서
    // 뒤로가기를 눌렀을 때 방금 닫은 필터 화면이 다시 열린다.
    navigate(
      { pathname: '/studios', search: `?${params.toString()}` },
      { replace: true },
    )
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
            {Object.entries(SHOOTING_CATEGORY_LABEL).map(([purpose, label]) => (
              <FilterChip
                key={purpose}
                label={label}
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
              {formatKRW(price[0])} ~ {formatUpperKRW(price[1])}
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
            {STUDIO_SERVICE_FILTER_CODES.map((code) => (
              <FilterChip
                key={code}
                label={getStudioServiceLabel(code)}
                size="large"
                selected={services.includes(code)}
                onClick={() => setServices((prev) => toggle(prev, code))}
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
          {applyLabel}
        </button>
      </div>
    </div>
  )
}

export default FilterPage
