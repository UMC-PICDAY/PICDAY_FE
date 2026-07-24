import { create } from 'zustand'

import type { CompareStudio } from '@/types/studio'

/** 비교 바에 담을 수 있는 최대 사진관 수 */
export const MAX_COMPARE = 3

interface CompareState {
  items: CompareStudio[]
  /** 이미 담겨 있으면 제거, 없으면 추가(최대 MAX_COMPARE개, 초과 시 무시) */
  toggle: (studio: CompareStudio) => void
  remove: (studioId: number) => void
  clear: () => void
}

/** 검색 화면에서 고른 비교 대상 사진관 목록(비교 바 선택 상태) */
export const useCompareStore = create<CompareState>((set) => ({
  items: [],
  toggle: (studio) =>
    set((state) => {
      const exists = state.items.some((item) => item.studioId === studio.studioId)
      if (exists) {
        return { items: state.items.filter((item) => item.studioId !== studio.studioId) }
      }
      if (state.items.length >= MAX_COMPARE) return state
      return { items: [...state.items, studio] }
    }),
  remove: (studioId) =>
    set((state) => ({ items: state.items.filter((item) => item.studioId !== studioId) })),
  clear: () => set({ items: [] }),
}))
