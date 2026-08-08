import { create } from 'zustand'

import type { CalendarDate } from '@/components/common/Calendar'

/** 'all'은 지역칩 '전체' — 검색창에는 표시하되 지역 필터로는 쓰지 않는다. */
export type SearchKeywordType = 'region' | 'name' | 'all'

interface SearchDraftState {
  keyword: string
  keywordType: SearchKeywordType | null
  // 이름 검색(2-3-2)은 이름 문자열이 아니라 자동완성에서 고른 studioId로 조회한다.
  // keyword는 검색창 표시용으로 남는다.
  studioId: number | null
  date: CalendarDate | null
  isDateUndecided: boolean
  purpose: string | null
  setKeyword: (
    keyword: string,
    keywordType: SearchKeywordType,
    ref?: { studioId?: number },
  ) => void
  setDate: (date: CalendarDate) => void
  setDateUndecided: () => void
  setPurpose: (purpose: string) => void
  reset: () => void
}

/** 검색 위저드(자동완성/날짜/목적)에서 고른 값을 SearchPage로 되돌려주기 위한 임시 상태 */
export const useSearchDraftStore = create<SearchDraftState>((set) => ({
  keyword: '',
  keywordType: null,
  studioId: null,
  date: null,
  isDateUndecided: false,
  purpose: null,
  setKeyword: (keyword, keywordType, ref) =>
    set({ keyword, keywordType, studioId: ref?.studioId ?? null }),
  setDate: (date) => set({ date, isDateUndecided: false }),
  setDateUndecided: () => set({ date: null, isDateUndecided: true }),
  setPurpose: (purpose) => set({ purpose }),
  reset: () =>
    set({
      keyword: '',
      keywordType: null,
      studioId: null,
      date: null,
      isDateUndecided: false,
      purpose: null,
    }),
}))

export const formatSearchDate = (date: CalendarDate) => {
  const yy = String(date.year).slice(2)
  const mm = String(date.month).padStart(2, '0')
  const dd = String(date.day).padStart(2, '0')
  return `${yy}.${mm}.${dd}`
}
