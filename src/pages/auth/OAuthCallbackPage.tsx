/**
 * Figma A-2 소셜 인증 처리 중 (라우트: /oauth/callback/:provider)
 * 카카오/구글 인증 완료 후 redirectUri로 돌아와 진입 — code로 토큰 교환 후 홈 또는 약관동의 화면으로 이동.
 *
 * redirectUri는 window.location.origin 기준으로 동적 구성함 — 실제 배포 도메인이 정해지면
 * 그 도메인의 /oauth/callback/{provider}를 카카오·구글 개발자 콘솔에 리다이렉트 URI로 등록해야 함
 */
import { useEffect, useRef } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router'

import NavigationBar from '@/components/layout/NavigationBar'
import LogoType from '@/components/layout/LogoType'
import { socialLogin } from '@/services/auth'
import { useAuthStore } from '@/stores/useAuthStore'
import type { SocialProvider } from '@/types/auth'

const OAuthCallbackPage = () => {
  const navigate = useNavigate()
  const { provider } = useParams<{ provider: string }>()
  const [searchParams] = useSearchParams()
  const authLogin = useAuthStore((state) => state.login)
  const hasRequested = useRef(false)

  useEffect(() => {
    if (hasRequested.current) return
    hasRequested.current = true

    const code = searchParams.get('code')
    if (!provider || !code) {
      navigate('/login')
      return
    }

    const redirectUri = `${window.location.origin}/oauth/callback/${provider}`

    socialLogin(provider as SocialProvider, code, redirectUri)
      .then((result) => {
        if (result.isNewUser) {
          navigate('/signup/social', { state: { signupToken: result.signupToken } })
          return
        }
        authLogin({ accessToken: result.token.accessToken, refreshToken: result.token.refreshToken })
        navigate('/home')
      })
      .catch(() => navigate('/login'))
  }, [provider, searchParams, navigate, authLogin])

  return (
    <div className="flex min-h-dvh w-full flex-col bg-white">
      <NavigationBar showRight={false} onBack={() => navigate('/login')} />

      <div className="flex flex-1 flex-col items-center justify-center gap-[30px]">
        <div className="flex flex-col items-center gap-[5px]">
          <LogoType variant="icon" />
          <LogoType variant="text" />
        </div>

        <div
          className="size-[50px] animate-spin rounded-full border-4 border-brand-20 border-t-brand-100"
          role="status"
          aria-label="인증 처리 중"
        />

        <div className="flex flex-col items-center gap-[10px]">
          <p className="font-b3 text-black">인증 처리 중입니다</p>
          <p className="text-center font-cap1 text-gray-40">잠시만 기다려주세요</p>
        </div>
      </div>
    </div>
  )
}

export default OAuthCallbackPage
