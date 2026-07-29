import { apiDelete, apiGet, apiPatch, apiPost, withMockFallback } from '@/services/client'
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

// 백엔드 미배포 데모용 mock (main 전용) — services/client.ts의 withMockFallback 참고
const MOCK_LOGIN_RESULT: LoginResult = {
  user: { id: 1, loginId: 'demo', nickname: '즐거운사진사1204', provider: 'LOCAL' },
  token: {
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
    accessTokenExpiresIn: 3600,
    refreshTokenExpiresIn: 1209600,
  },
}

const MOCK_ME_RESULT: MeResult = {
  user: {
    id: 1,
    name: '이수현',
    nickname: '즐거운사진사1204',
    email: 'demo@pickday.com',
    profileImageUrl: '',
    provider: 'LOCAL',
    notification: { reservation: true, marketing: false },
  },
}

export const signup = (body: {
  loginId: string
  name: string
  password: string
  email: string
  phoneNumber: string
  agreedTermsIds: number[]
}) => {
  const mockResult: SignupResult = {
    user: {
      id: 1,
      loginId: body.loginId,
      name: body.name,
      nickname: '즐거운사진사1204',
      email: body.email,
      provider: 'LOCAL',
    },
    token: null,
  }

  return withMockFallback(() => apiPost<SignupResult>('/api/v1/auth/signup', body), mockResult)
}

export const checkLoginIdAvailable = (loginId: string) =>
  withMockFallback(
    () => apiGet<AvailabilityResult>('/api/v1/auth/loginid/check', { loginId }),
    { available: true },
  )

export const login = (loginId: string, password: string) =>
  withMockFallback(
    () => apiPost<LoginResult>('/api/v1/auth/login', { loginId, password }),
    { ...MOCK_LOGIN_RESULT, user: { ...MOCK_LOGIN_RESULT.user, loginId } },
  )

export const logout = () => withMockFallback(() => apiPost<null>('/api/v1/auth/logout'), null)

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

export const getMe = () =>
  withMockFallback(() => apiGet<MeResult>('/api/v1/auth/me'), MOCK_ME_RESULT)

export const updateNickname = (nickname: string) =>
  withMockFallback(() => apiPatch<UpdateNicknameResult>('/api/v1/auth/me', { nickname }), {
    user: { id: 1, nickname },
  })

export const checkNicknameAvailable = (nickname: string) =>
  withMockFallback(() => apiGet<AvailabilityResult>('/api/v1/auth/nickname/check', { nickname }), {
    available: true,
  })

export const withdraw = () => withMockFallback(() => apiDelete<null>('/api/v1/auth/me'), null)
