import { create } from 'zustand'

import type { CalendarDate } from '@/components/common/Calendar'

interface SearchDraftState {
  keyword: string
  date: CalendarDate | null
  isDateUndecided: boolean
  purpose: string | null
  setKeyword: (keyword: string) => void
  setDate: (date: CalendarDate) => void
  setDateUndecided: () => void
  setPurpose: (purpose: string) => void
}

/** 검색 위저드(자동완성/날짜/목적)에서 고른 값을 SearchPage로 되돌려주기 위한 임시 상태 */
export const useSearchDraftStore = create<SearchDraftState>((set) => ({
  keyword: '',
  date: null,
  isDateUndecided: false,
  purpose: null,
  setKeyword: (keyword) => set({ keyword }),
  setDate: (date) => set({ date, isDateUndecided: false }),
  setDateUndecided: () => set({ date: null, isDateUndecided: true }),
  setPurpose: (purpose) => set({ purpose }),
}))

export const formatSearchDate = (date: CalendarDate) => {
  const yy = String(date.year).slice(2)
  const mm = String(date.month).padStart(2, '0')
  const dd = String(date.day).padStart(2, '0')
  return `${yy}.${mm}.${dd}`
}
