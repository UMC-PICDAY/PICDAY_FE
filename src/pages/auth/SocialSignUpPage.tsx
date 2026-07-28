/**
 * Figma A-5 소셜 신규회원 약관 동의 (라우트: /signup/social)
 * OAuthCallbackPage에서 소셜 로그인 결과 isNewUser=true일 때 signupToken·socialInfo를 router state로 들고 진입.
 * 닉네임은 서버 자동배정, 이름은 소셜 제공자에게 이미 받아온 상태라 약관 동의만 받으면 됨.
 * 이메일·전화번호는 소셜 제공자가 내려준 값을 읽기전용으로 노출 — 카카오 비즈앱 검수에서
 * 필수 수집 항목임을 화면에 명시해야 하기 때문 (수정 불가, 약관 동의로만 수집에 동의).
 */
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'

import NavigationBar from '@/components/layout/NavigationBar'
import Title from '@/components/common/Title'
import InputField from '@/components/common/InputField'
import Agreement from '@/components/common/Agreement'
import Button from '@/components/common/Button'
import Toast from '@/components/common/Toast'
import { completeSocialSignup } from '@/services/auth'
import { ApiError } from '@/types/common'
import { useAuthStore } from '@/stores/useAuthStore'
import { REQUIRED_TERMS, TERM_ITEMS } from '@/constants/terms'
import type { TermKey } from '@/constants/terms'
import type { SocialInfo } from '@/types/auth'

interface LocationState {
  signupToken?: string
  socialInfo?: SocialInfo
}

const SocialSignUpPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const authLogin = useAuthStore((state) => state.login)
  const { signupToken, socialInfo } = (location.state as LocationState | null) ?? {}

  const [terms, setTerms] = useState<Record<TermKey, boolean>>({
    service: false,
    privacy: false,
    age: false,
    marketing: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!signupToken) navigate('/login')
  }, [signupToken, navigate])

  useEffect(() => {
    if (!toastMessage) return
    const timer = setTimeout(() => setToastMessage(null), 3000)
    return () => clearTimeout(timer)
  }, [toastMessage])

  const isAllAgreed = TERM_ITEMS.every(({ key }) => terms[key])
  const canSubmit = REQUIRED_TERMS.every((key) => terms[key]) && !isSubmitting

  const toggleAll = () => {
    const next = !isAllAgreed
    setTerms({ service: next, privacy: next, age: next, marketing: next })
  }

  const toggleTerm = (key: TermKey) => {
    setTerms((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSubmit = async () => {
    if (!canSubmit || !signupToken) return

    setIsSubmitting(true)
    try {
      const { token } = await completeSocialSignup(
        signupToken,
        TERM_ITEMS.filter(({ key }) => terms[key]).map(({ id }) => id),
      )
      authLogin({ accessToken: token.accessToken, refreshToken: token.refreshToken })
      navigate('/home')
    } catch (error) {
      setToastMessage(error instanceof ApiError ? error.message : '회원가입에 실패했어요. 다시 시도해 주세요')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-dvh w-full flex-col bg-white">
      <NavigationBar showRight={false} onBack={() => navigate('/login')} />

      <Title
        variant="large"
        title="약관에 동의해 주세요"
        description="PICDAY 가입을 위해 아래 약관 동의가 필요해요"
      />

      {socialInfo && (
        <>
          <InputField label="이메일 (필수)" placeholder="" value={socialInfo.email} disabled readOnly />
          <InputField
            label="전화번호 (필수)"
            placeholder=""
            value={socialInfo.phoneNumber}
            disabled
            readOnly
          />
        </>
      )}

      <Agreement
        variant="split"
        allAgreeDescription="선택 항목 포함 전체 약관에 동의합니다"
        items={TERM_ITEMS}
        checked={terms}
        onToggleAll={toggleAll}
        onToggleItem={(key) => toggleTerm(key as TermKey)}
        onItemDetailClick={(key) => navigate(`/terms/${key}`)}
      />

      <div className="sticky bottom-0 mt-auto w-full bg-white p-5">
        <Button variant={canSubmit ? 'primary' : 'disabled'} onClick={canSubmit ? handleSubmit : undefined}>
          회원가입하기
        </Button>
      </div>

      {toastMessage && (
        <div className="pointer-events-none fixed inset-x-0 bottom-24 flex justify-center px-5">
          <Toast message={toastMessage} />
        </div>
      )}
    </div>
  )
}

export default SocialSignUpPage
