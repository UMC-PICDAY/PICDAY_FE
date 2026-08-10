import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { clearUserSessionState } from '@/utils/clearUserSession'

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
      // 명시적 로그아웃(ProfileSettingPage)과 자동 로그아웃(client.ts의 401
      // 처리)이 모두 이 액션을 거치므로, 여기서 상태를 비워야 다음
      // 사용자가 같은 브라우저에서 로그인했을 때 이전 사용자의 getMe() 등
      // 캐시된 응답이 그대로 보이는 걸 막을 수 있다.
      logout: () => {
        clearUserSessionState()
        set({ isLoggedIn: false, accessToken: null, refreshToken: null })
      },
      setAccessToken: (accessToken) => set({ accessToken }),
    }),
    { name: 'auth-storage' },
  ),
)
