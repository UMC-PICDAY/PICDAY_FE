// PICDAY_API_1st.pdf(초안) 기준 타입. id 타입(number/uuid)은 명세서에 안 나와 있어서 임시로 string 처리 — 실제 DTO 확정되면 교체
export type SocialProvider = 'kakao' | 'naver' | 'google'

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthUser {
  id: string
  nickname: string
  email: string
  profileImage: string | null
  provider: SocialProvider | 'self'
  notification: boolean
}

export interface SignupResult extends AuthTokens {
  user: AuthUser
}

export type SocialLoginResult =
  | ({ isNewUser: false } & AuthTokens)
  | { isNewUser: true; signupToken: string; defaultNickname: string }

export interface SocialAuthUrl {
  authUrl: string
  state: string
}

export interface AvailabilityResult {
  available: boolean
}

export interface MessageResult {
  message: string
}
