/**
 * Figma B-2 통합검색 (라우트: /search)
 * 검색 위저드의 허브 화면 — 키워드/날짜/목적 피커는 각자 화면(B-3/B-4/B-5)으로 갔다가 draft 스토어에 값만 남기고 여기로 돌아옴
 */
import { useNavigate } from 'react-router'

import NavigationBar from '@/components/layout/NavigationBar'
import MiniTitle from '@/components/common/MiniTitle'
import SearchField from '@/components/common/SearchField'
import SelectField from '@/components/common/SelectField'
import Button from '@/components/common/Button'
import { useSearchDraftStore, formatSearchDate } from '@/stores/useSearchDraftStore'
import { formatCalendarDateForUrl, serializeStudioSearchParams } from '@/utils/studioSearchParams'
import type { StudioSearchFilters } from '@/utils/studioSearchParams'

const SearchPage = () => {
  const navigate = useNavigate()
  const { keyword, keywordType, date, isDateUndecided, purpose } = useSearchDraftStore()

  const dateLabel = isDateUndecided ? '날짜 미정' : date ? formatSearchDate(date) : undefined
  // 지역칩 '전체'(keywordType 'all')는 검색창 표시용일 뿐 검색 조건이 아니므로 세지 않는다.
  const hasKeywordFilter = keywordType === 'region' || keywordType === 'name'
  const hasAnyFilter = hasKeywordFilter || dateLabel !== undefined || purpose !== null

  const handleSearch = () => {
    const isRegion = keywordType === 'region' && keyword !== ''

    const filters: StudioSearchFilters = {
      location: isRegion ? keyword : undefined,
      name: keywordType === 'name' && keyword !== '' ? keyword : undefined,
      date: date ? formatCalendarDateForUrl(date) : undefined,
      concepts: purpose ? [purpose] : [],
      services: [],
    }

    navigate(`/studios?${serializeStudioSearchParams(filters).toString()}`)
  }

  return (
    <div className="flex min-h-dvh w-full flex-col bg-white">
      <NavigationBar title="검색" showRight={false} onBack={() => navigate(-1)} />

      <MiniTitle title="어떤 사진관을 찾고 있나요?" />

      <div className="flex w-full flex-col items-start gap-3 px-5">
        <div className="w-full" onClick={() => navigate('/search/autocomplete')}>
          <SearchField
            variant="input"
            value={keyword}
            placeholder="지역이나 사진관명을 검색해 보세요"
          />
        </div>
        <SelectField variant="date" value={dateLabel} onClick={() => navigate('/search/date')} />
        <SelectField variant="purpose" value={purpose ?? undefined} onClick={() => navigate('/search/purpose')} />
      </div>

      <div className="mt-auto w-full p-5">
        <Button variant={hasAnyFilter ? 'primary' : 'disabled'} onClick={hasAnyFilter ? handleSearch : undefined}>
          검색
        </Button>
      </div>
    </div>
  )
}

export default SearchPage
