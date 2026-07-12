/** Figma B-3 지역칩 선택 / 사진관명 텍스트 입력 / 자동완성 노출 (라우트: /search/autocomplete) — 한 화면에서 상태로 분기 */
import { useState } from 'react'
import { useNavigate } from 'react-router'

import NavigationBar from '@/components/layout/NavigationBar'
import MiniTitle from '@/components/common/MiniTitle'
import SearchField from '@/components/common/SearchField'
import FilterChip from '@/components/common/FilterChip'
import Button from '@/components/common/Button'
import { useSearchDraftStore } from '@/stores/useSearchDraftStore'

const REGION_CHIPS = ['전체', '홍대', '강남', '성수', '연남', '건대', '신촌', '잠실', '압구정', '혜화', '종로']

// API 명세가 아직 없어서 목업 검색 결과로 대체 (실제 API 연동 시 keyword로 필터링된 목록으로 교체)
const SUGGESTIONS = [
  { label: '데이지 스튜디오', meta: '홍대' },
  { label: '데이지 포토 홍대', meta: '홍대' },
  { label: '데이지룸 강남', meta: '강남' },
]

const SearchAutoCompletePage = () => {
  const navigate = useNavigate()
  const setKeywordDraft = useSearchDraftStore((state) => state.setKeyword)
  const [keyword, setKeyword] = useState(() => useSearchDraftStore.getState().keyword)
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [selectedSuggestion, setSelectedSuggestion] = useState<number | null>(null)

  const isTyping = keyword.trim().length > 0
  const canProceed = isTyping ? selectedSuggestion !== null : selectedRegion !== null

  const handleConfirm = () => {
    const value = isTyping ? SUGGESTIONS[selectedSuggestion!].label : selectedRegion!
    setKeywordDraft(value)
    navigate('/search')
  }

  return (
    <div className="flex min-h-dvh w-full flex-col bg-white">
      <NavigationBar title="검색" showRight={false} onBack={() => navigate(-1)} />

      <MiniTitle title={isTyping ? '어떤 사진관을 찾고 있나요?' : '어떤 공간을 찾고 있나요?'} />

      <div className="flex w-full flex-col items-start gap-4 px-5">
        <SearchField
          variant="input"
          value={keyword}
          placeholder="지역이나 사진관명을 검색해 보세요"
          onChange={(event) => {
            setKeyword(event.target.value)
            setSelectedSuggestion(null)
          }}
          onClear={() => setKeyword('')}
        />

        {isTyping ? (
          <div className="flex w-full flex-col items-start overflow-hidden rounded-lg">
            {SUGGESTIONS.map((suggestion, index) => (
              <SearchField
                key={suggestion.label}
                variant="result"
                position={index === 0 ? 'top' : index === SUGGESTIONS.length - 1 ? 'bottom' : 'middle'}
                resultLabel={suggestion.label}
                resultMeta={suggestion.meta}
                selected={selectedSuggestion === index}
                onResultClick={() => setSelectedSuggestion(index)}
              />
            ))}
          </div>
        ) : (
          <div className="grid w-full grid-cols-3 gap-x-4 gap-y-3">
            {REGION_CHIPS.map((region) => (
              <FilterChip
                key={region}
                label={region}
                size="large"
                className="w-full"
                selected={selectedRegion === region}
                onClick={() => setSelectedRegion(region)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-auto w-full p-5">
        <Button variant={canProceed ? 'primary' : 'disabled'} onClick={handleConfirm}>
          {isTyping ? '검색' : '다음'}
        </Button>
      </div>
    </div>
  )
}

export default SearchAutoCompletePage
