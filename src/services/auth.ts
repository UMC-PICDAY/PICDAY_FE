import { apiDelete, apiGet, apiPatch, apiPost } from '@/services/client'
import type {
  AvailabilityResult,
  LoginResult,
  MeResult,
  SignupResult,
  SocialAuthUrlResult,
  SocialLoginResult,
  SocialProvider,
  SocialSignupCompleteResult,
  UpdateNicknameResult,
} from '@/types/auth'

export const signup = (body: {
  loginId: string
  name: string
  password: string
  email: string
  phoneNumber: string
  agreedTermsIds: number[]
}) => apiPost<SignupResult>('/api/v1/auth/signup', body)

export const checkLoginIdAvailable = (loginId: string) =>
  apiGet<AvailabilityResult>('/api/v1/auth/loginid/check', { loginid: loginId })

export const login = (loginId: string, password: string) =>
  apiPost<LoginResult>('/api/v1/auth/login', { loginId, password })

export const logout = () => apiPost<null>('/api/v1/auth/logout')

export const getSocialAuthUrl = (provider: SocialProvider) =>
  apiGet<SocialAuthUrlResult>(`/api/v1/auth/${provider}/url`)

export const socialLogin = (provider: SocialProvider, authorizationCode: string, redirectUri: string) =>
  apiPost<SocialLoginResult>(`/api/v1/auth/${provider}/login`, { authorizationCode, redirectUri })

export const completeSocialSignup = (signupToken: string, agreedTermsIds: number[]) =>
  apiPost<SocialSignupCompleteResult>(
    '/api/v1/auth/signup/complete',
    { agreedTermsIds },
    { headers: { Authorization: `Bearer ${signupToken}` } },
  )

export const getMe = () => apiGet<MeResult>('/api/v1/users/me')

export const updateNickname = (nickname: string) =>
  apiPatch<UpdateNicknameResult>('/api/v1/users/me', { nickname })

export const checkNicknameAvailable = (nickname: string) =>
  apiGet<AvailabilityResult>('/api/v1/auth/nickname/check', { nickname })

export const withdraw = () => apiDelete<null>('/api/v1/users/me')
