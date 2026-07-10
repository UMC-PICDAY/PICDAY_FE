import { create } from 'zustand'

interface AuthState {
  isLoggedIn: boolean
  login: () => void
  logout: () => void
}

// 실제 로그인 API가 아직 없어서, 로그인/비로그인 홈 라우트 진입을 기준으로 임시 관리
export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  login: () => set({ isLoggedIn: true }),
  logout: () => set({ isLoggedIn: false }),
}))
