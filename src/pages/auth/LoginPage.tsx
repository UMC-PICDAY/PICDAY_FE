/** Figma A-2 로그인 화면 (라우트: /login) */
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'

import NavigationBar from '@/components/layout/NavigationBar'
import LogoType from '@/components/layout/LogoType'
import InputField from '@/components/common/InputField'
import Button from '@/components/common/Button'
import Toast from '@/components/common/Toast'
import { IcClose } from '@/components/icons'
import { useToast } from '@/hooks/useToast'
import { getSocialAuthUrl, login } from '@/services/auth'
import { queryClient } from '@/services/queryClient'
import { useAuthStore } from '@/stores/useAuthStore'
import type { SocialProvider } from '@/types/auth'
import { clearSocialLoginReturnTo, getSafeReturnTo, saveSocialLoginReturnTo } from '@/utils/authRedirect'

interface LoginLocationState {
  returnTo?: string
  toastMessage?: string
}

const NETWORK_ERROR_MESSAGE = '연결 상태를 확인해 주세요'
const AUTH_ERROR_MESSAGE = '로그인에 실패했어요. 다시 시도해 주세요'

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const loginState = location.state as LoginLocationState | null
  const returnTo = getSafeReturnTo(loginState?.returnTo)

  const authLogin = useAuthStore((state) => state.login)
  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')
  const { toast, showToast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 다른 화면(소셜 로그인 콜백 실패 등)에서 안내 메시지를 담아 이 화면으로
  // 돌아올 때 한 번만 보여주고, history state에서 지워 새로고침해도 다시
  // 안 뜨게 한다.
  useEffect(() => {
    const incomingToast = (
      location.state as LoginLocationState | null
    )?.toastMessage
    if (!incomingToast) return

    showToast(incomingToast)
    navigate(location.pathname, {
      replace: true,
      state: { returnTo },
    })
  }, [location, navigate, returnTo, showToast])

  const canSubmit = loginId !== '' && password !== '' && !isSubmitting

  const handleLogin = async () => {
    if (!canSubmit) return

    setIsSubmitting(true)
    try {
      const { token } = await login(loginId, password)
      // 이전 사용자가 로그아웃 없이 다른 계정으로 로그인하는 경우까지
      // 막으려면 새 로그인 시점에도 캐시를 비워야 한다 (로그아웃 시
      // 비우는 것만으로는 "로그아웃 없이 계정 전환" 케이스를 못 막음).
      queryClient.clear()
      authLogin({ accessToken: token.accessToken, refreshToken: token.refreshToken })
      clearSocialLoginReturnTo()
      navigate(returnTo, { replace: true })
    } catch {
      showToast(navigator.onLine ? AUTH_ERROR_MESSAGE : NETWORK_ERROR_MESSAGE)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSocialLogin = async (provider: SocialProvider) => {
    try {
      saveSocialLoginReturnTo(returnTo)

      const { authUrl } = await getSocialAuthUrl(provider)
      window.location.href = authUrl
    } catch {
      clearSocialLoginReturnTo()
      showToast(navigator.onLine ? AUTH_ERROR_MESSAGE : NETWORK_ERROR_MESSAGE)
    }
  }

  return (
    <div className="flex min-h-dvh w-full flex-col bg-white">
      <NavigationBar
        showRight={false}
        leftNode={
          <button
            type="button"
            className="cursor-pointer border-none bg-transparent p-0"
            onClick={() => navigate(-1)}
            aria-label="닫기"
          >
            <IcClose width={24} height={24} />
          </button>
        }
      />

      <div className="flex w-full flex-col items-center gap-[10px] pb-5 pt-[30px]">
        <div className="flex flex-col items-center gap-[5px]">
          <LogoType variant="icon" />
          <LogoType variant="text" />
        </div>
        <p className="font-cap1 text-brand-100">사진관 예약을 한 번에</p>
      </div>

      <InputField
        label="아이디"
        placeholder="아이디를 입력해 주세요"
        value={loginId}
        onChange={(event) => setLoginId(event.target.value)}
      />
      <InputField
        label="비밀번호"
        placeholder="비밀번호를 입력해 주세요"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      <div className="flex w-full items-center justify-between px-5">
        <button type="button" className="cursor-pointer border-none bg-transparent p-0 font-b6 text-gray-40">
          아이디찾기
        </button>
        <button type="button" className="cursor-pointer border-none bg-transparent p-0 font-b6 text-gray-40">
          비밀번호 찾기
        </button>
      </div>

      <div className="w-full p-5">
        <Button variant={canSubmit ? 'primary' : 'disabled'} onClick={canSubmit ? handleLogin : undefined}>
          로그인
        </Button>
      </div>

      <div className="flex w-full items-center justify-center gap-3 px-5 py-3">
        <div className="h-px flex-1 bg-gray-20" />
        <p className="whitespace-nowrap font-cap1 text-gray-20">SNS 계정으로 간편 로그인</p>
        <div className="h-px flex-1 bg-gray-20" />
      </div>

      <div className="flex w-full items-center justify-center gap-5 py-3">
        <button
          type="button"
          className="flex size-[52px] cursor-pointer items-center justify-center rounded-full border-none bg-[#fee500]"
          aria-label="카카오로 로그인"
          onClick={() => handleSocialLogin('kakao')}
        >
          <svg width="26" height="24" viewBox="0 0 26 24" fill="none" aria-hidden>
            <path
              d="M13 1.5C6.1 1.5 0.5 5.72 0.5 10.86c0 3.31 2.31 6.21 5.79 7.9-.19.87-1.02 3.38-1.11 3.9-.05.28.13.55.42.6.11.02.22 0 .32-.05.36-.19 3.53-2.4 4.87-3.32.7.1 1.41.15 2.13.15 6.9 0 12.5-4.22 12.5-9.28S19.9 1.5 13 1.5z"
              fill="#391B1B"
            />
          </svg>
        </button>
        {/* 구글 공식 브랜드 4색을 손으로 그린 인라인 SVG (다운로드된 스톡 에셋 대신 사용, 다른 소셜 버튼과 동일 패턴) */}
        <button
          type="button"
          className="flex size-[52px] cursor-pointer items-center justify-center rounded-full border border-gray-10 bg-white"
          aria-label="구글로 로그인"
          onClick={() => handleSocialLogin('google')}
        >
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden>
            <path
              d="M25.48 13.27c0-.84-.07-1.68-.22-2.5H13.5v4.74h6.72a5.75 5.75 0 0 1-2.49 3.77v3.13h4.02c2.36-2.17 3.73-5.37 3.73-9.14Z"
              fill="#4285F4"
            />
            <path
              d="M13.5 26c3.37 0 6.2-1.11 8.26-3.02l-4.02-3.13c-1.12.75-2.56 1.19-4.24 1.19-3.26 0-6.02-2.2-7-5.16H2.35v3.24A13 13 0 0 0 13.5 26Z"
              fill="#34A853"
            />
            <path
              d="M6.5 15.88a7.8 7.8 0 0 1 0-4.98V7.66H2.35a13 13 0 0 0 0 11.46l4.15-3.24Z"
              fill="#FBBC05"
            />
            <path
              d="M13.5 5.74c1.83 0 3.48.63 4.77 1.86l3.58-3.58C19.7 1.9 16.87.7 13.5.7A13 13 0 0 0 2.35 7.66l4.15 3.24c.98-2.96 3.74-5.16 7-5.16Z"
              fill="#EA4335"
            />
          </svg>
        </button>
      </div>

      <div className="flex w-full items-center justify-center gap-3 py-3">
        <p className="font-b6 text-gray-40">계정이 없으신가요?</p>
        <button
          type="button"
          className="cursor-pointer border-none border-b border-gray-80 bg-transparent p-0 pb-[2px] font-b6 text-gray-80"
          onClick={() => navigate('/signup')}
        >
          회원가입
        </button>
      </div>

      {toast && (
        <div className="pointer-events-none fixed inset-x-0 bottom-10 flex justify-center px-5">
          <Toast key={toast.id} message={toast.message} />
        </div>
      )}
    </div>
  )
}

export default LoginPage
