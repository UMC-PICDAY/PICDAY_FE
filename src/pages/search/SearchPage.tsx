import { useNavigate } from 'react-router'

import NavigationBar from '@/components/layout/NavigationBar'
import MiniTitle from '@/components/common/MiniTitle'
import SearchField from '@/components/common/SearchField'
import SelectField from '@/components/common/SelectField'
import Button from '@/components/common/Button'
import { useSearchDraftStore, formatSearchDate } from '@/stores/useSearchDraftStore'

const SearchPage = () => {
  const navigate = useNavigate()
  const { keyword, date, isDateUndecided, purpose } = useSearchDraftStore()

  const dateLabel = isDateUndecided ? '날짜 미정' : date ? formatSearchDate(date) : undefined
  const hasAnyFilter = keyword.trim().length > 0 || dateLabel !== undefined || purpose !== null

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
        <Button variant={hasAnyFilter ? 'primary' : 'disabled'} onClick={() => navigate('/studios')}>
          검색
        </Button>
      </div>
    </div>
  )
}

export default SearchPage
