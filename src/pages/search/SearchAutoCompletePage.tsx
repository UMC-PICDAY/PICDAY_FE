/** Figma B-3 지역칩 선택 / 사진관명 텍스트 입력 / 자동완성 노출 (라우트: /search/autocomplete) — 한 화면에서 상태로 분기 */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import NavigationBar from '@/components/layout/NavigationBar'
import MiniTitle from '@/components/common/MiniTitle'
import SearchField from '@/components/common/SearchField'
import FilterChip from '@/components/common/FilterChip'
import Button from '@/components/common/Button'
import { useSearchDraftStore } from '@/stores/useSearchDraftStore'
import { autocompleteStudios } from '@/services/studio'
import type { AutocompleteSuggestion } from '@/types/studio'

/** 지역 필터 해제를 뜻하는 칩. 값이 아니라 '지역 조건 없음'이므로 draft에 저장하지 않는다. */
const ALL_REGION = '전체'

const REGION_CHIPS = [ALL_REGION, '홍대', '강남', '성수', '연남', '건대', '신촌', '잠실', '압구정', '혜화', '종로']

const AUTOCOMPLETE_DEBOUNCE_MS = 250

const SearchAutoCompletePage = () => {
  const navigate = useNavigate()
  const setKeywordDraft = useSearchDraftStore((state) => state.setKeyword)
  const [keyword, setKeyword] = useState(() => useSearchDraftStore.getState().keyword)
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [selectedSuggestion, setSelectedSuggestion] = useState<number | null>(null)
  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([])

  const isTyping = keyword.trim().length > 0
  const canProceed = isTyping ? selectedSuggestion !== null : selectedRegion !== null

  useEffect(() => {
    if (!isTyping) {
      setSuggestions([])
      return
    }

    const timer = setTimeout(() => {
      autocompleteStudios(keyword)
        .then((result) => setSuggestions(result.suggestions))
        .catch(() => setSuggestions([]))
    }, AUTOCOMPLETE_DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [keyword, isTyping])

  const handleConfirm = () => {
    if (isTyping) {
      setKeywordDraft(suggestions[selectedSuggestion!].studioName, 'name')
    } else {
      setKeywordDraft(selectedRegion!, selectedRegion === ALL_REGION ? 'all' : 'region')
    }
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
            {suggestions.map((suggestion, index) => (
              <SearchField
                key={suggestion.studioId}
                variant="result"
                position={index === 0 ? 'top' : index === suggestions.length - 1 ? 'bottom' : 'middle'}
                resultLabel={suggestion.studioName}
                resultMeta={suggestion.locationCategory}
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
