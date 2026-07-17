import { apiDelete, apiGet, apiPost } from '@/services/client'
import type {
  AuthTokens,
  AuthUser,
  AvailabilityResult,
  MessageResult,
  SignupResult,
  SocialAuthUrl,
  SocialLoginResult,
  SocialProvider,
} from '@/types/auth'

export const getSocialAuthUrl = (provider: SocialProvider) =>
  apiGet<SocialAuthUrl>(`/api/auth/${provider}/url`)

export const socialLogin = (provider: SocialProvider, code: string, state: string) =>
  apiPost<SocialLoginResult>(`/api/auth/${provider}/login`, { code, state })

export const completeSocialSignup = (
  signupToken: string,
  nickname: string,
  agreedTermsIds: string[],
) =>
  apiPost<SignupResult>(
    '/api/auth/signup/complete',
    { nickname, agreedTermsIds },
    { headers: { Authorization: `Bearer ${signupToken}` } },
  )

export const signup = (email: string, password: string, nickname: string, agreedTermsIds: string[]) =>
  apiPost<SignupResult>('/api/auth/signup', { email, password, nickname, agreedTermsIds })

export const login = (email: string, password: string) =>
  apiPost<AuthTokens>('/api/auth/login', { email, password })

export const checkNicknameAvailable = (nickname: string) =>
  apiGet<AvailabilityResult>('/api/auth/nickname/check', { nickname })

export const checkEmailAvailable = (email: string) =>
  apiGet<AvailabilityResult>('/api/auth/email/check', { email })

export const refreshAccessToken = (refreshToken: string) =>
  apiPost<AuthTokens>('/api/auth/refresh', { refreshToken })

export const logout = () => apiPost<MessageResult>('/api/auth/logout')

export const getMe = () => apiGet<AuthUser>('/api/auth/me')

export const withdraw = () => apiDelete<MessageResult>('/api/auth/me')
