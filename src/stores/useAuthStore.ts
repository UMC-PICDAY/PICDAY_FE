import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface LoginTokens {
  accessToken: string
  refreshToken?: string
}

interface AuthState {
  isLoggedIn: boolean
  accessToken: string | null
  refreshToken: string | null
  login: (tokens?: LoginTokens) => void
  logout: () => void
  setAccessToken: (accessToken: string) => void
}

// refreshToken은 Body로 내려주는 방식으로 확정 (백엔드 확인 완료) -> store에 보관 후 갱신 요청 시 직접 전송
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      accessToken: null,
      refreshToken: null,
      login: (tokens) =>
        set({
          isLoggedIn: true,
          accessToken: tokens?.accessToken ?? null,
          refreshToken: tokens?.refreshToken ?? null,
        }),
      logout: () => set({ isLoggedIn: false, accessToken: null, refreshToken: null }),
      setAccessToken: (accessToken) => set({ accessToken }),
    }),
    { name: 'auth-storage' },
  ),
)
