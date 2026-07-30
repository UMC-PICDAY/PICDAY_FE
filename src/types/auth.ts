// PICDAY_API_Spec.md (확정본) 기준 타입
export type AuthProvider = 'LOCAL' | 'KAKAO' | 'GOOGLE'
export type SocialProvider = 'kakao' | 'google'

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  accessTokenExpiresIn: number
  refreshTokenExpiresIn: number
}

export interface SignupUser {
  id: number
  loginId: string
  name: string
  nickname: string
  email: string
  provider: AuthProvider
}

export interface SignupResult {
  user: SignupUser
  token: null
}

export interface LoginUser {
  id: number
  loginId: string
  nickname: string
  provider: AuthProvider
}

export interface LoginResult {
  user: LoginUser
  token: AuthTokens
}

export interface RefreshResult {
  token: AuthTokens
}

export interface AvailabilityResult {
  available: boolean
}

export interface SocialAuthUrlResult {
  authUrl: string
}

export interface SocialLoginUser {
  id: number
  nickname: string
  email: string
  profileImageUrl: string
  provider: AuthProvider
}

export interface SocialInfo {
  id: string
  email: string
  name: string
  phoneNumber: string
}

export type SocialLoginResult =
  | { isNewUser: false; user: SocialLoginUser; token: AuthTokens }
  | { isNewUser: true; signupToken: string; socialInfo: SocialInfo }

export interface SocialSignupUser {
  id: number
  nickname: string
  provider: AuthProvider
}

export interface SocialSignupCompleteResult {
  user: SocialSignupUser
  token: AuthTokens
}

export interface MeUser {
  id: number
  name: string
  nickname: string
  email: string
  profileImageUrl?: string | null
  provider: AuthProvider
  notification?: { reservation: boolean; marketing: boolean }
}

export interface MeResult {
  user: MeUser
}

export interface UpdateNicknameResult {
  user: { id: number; nickname: string }
}
