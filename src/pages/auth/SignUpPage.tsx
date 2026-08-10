/**
 * Figma A-3 자체 회원가입 (라우트: /signup)
 * 약관 상세(서비스/개인정보/만14세/마케팅)는 Agreement의 onItemDetailClick으로 A-3 하위 화면인 /terms/:termType로 이동
 */
import { useEffect, useRef, useState } from 'react'
import type { FocusEventHandler } from 'react'
import { useNavigate } from 'react-router'

import NavigationBar from '@/components/layout/NavigationBar'
import InputField from '@/components/common/InputField'
import Agreement from '@/components/common/Agreement'
import Button from '@/components/common/Button'
import Toast from '@/components/common/Toast'
import { useToast } from '@/hooks/useToast'
import { useValidatedField } from '@/hooks/useValidatedField'
import { checkLoginIdAvailable, login, signup } from '@/services/auth'
import { queryClient } from '@/services/queryClient'
import { useAuthStore } from '@/stores/useAuthStore'
import { useSignUpDraftStore } from '@/stores/useSignUpDraftStore'
import { ApiError } from '@/types/common'
import { REQUIRED_TERMS, TERM_ITEMS } from '@/constants/terms'
import type { TermKey } from '@/constants/terms'

// 영문 소문자로 시작, 소문자/숫자만 허용, 4~12자 (대문자·공백·특수문자·숫자시작·숫자만 금지)
const ID_REGEX = /^[a-z][a-z0-9]{3,11}$/
// 영문, 숫자, 특수문자를 모두 포함한 8~20자
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,20}$/
// 일반적인 이메일 형식
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// 010/011/016/017/018/019로 시작하는 국내 휴대폰 번호 (하이픈 유무 무관)
const PHONE_REGEX = /^01[016789]\d{7,8}$/

const validateName = (value: string) => (value.trim() === '' ? '이름을 입력해 주세요' : undefined)

const validateId = (value: string) => {
  if (value === '') return '아이디를 입력해 주세요'
  if (!ID_REGEX.test(value)) {
    return '대문자, 공백,특수문자가 포함되었거나, 숫자로 시작 또는 숫자로만 이루어진 아이디는 사용할 수 없습니다'
  }
  return undefined
}

const validatePassword = (value: string) => {
  if (value === '') return '비밀번호를 입력해 주세요'
  if (!PASSWORD_REGEX.test(value)) return '영문, 숫자, 특수문자를 포함하여 8-20자로 작성해 주세요'
  return undefined
}

const validateEmail = (value: string) => {
  if (value === '') return '이메일을 입력해 주세요'
  if (!EMAIL_REGEX.test(value)) return '올바른 이메일 형식이 아니에요'
  return undefined
}

const validatePhone = (value: string) => {
  if (value === '') return '휴대폰 번호를 입력해 주세요'
  if (!PHONE_REGEX.test(value.replace(/-/g, ''))) return '올바른 휴대폰 번호를 입력해 주세요'
  return undefined
}

type IdAvailability = 'idle' | 'checking' | 'available' | 'taken'

const SignUpPage = () => {
  const navigate = useNavigate()
  const authLogin = useAuthStore((state) => state.login)
  const signUpDraft = useSignUpDraftStore.getState()
  const [terms, setTerms] = useState<Record<TermKey, boolean>>(signUpDraft.terms)
  const [idAvailability, setIdAvailability] = useState<IdAvailability>('idle')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast, showToast } = useToast()
  // 중복확인 응답이 도착한 순서가 요청한 순서와 다를 수 있어(늦게 보낸 요청이 먼저 응답),
  // 마지막으로 보낸 요청의 결과만 반영하도록 매 요청마다 값을 갱신해 최신 요청인지 비교한다.
  const latestIdCheckRef = useRef('')

  // 약관 상세로 갔다가 돌아오는 경우에만 draft(비밀번호 포함 평문)를 살려두고,
  // 그 외 방식으로 이 화면을 벗어나면(뒤로가기, 브라우저 뒤로가기 등) 지운다.
  // 안 지우면 같은 기기에서 회원가입을 하다 만 다음 사람이 /signup에 다시
  // 들어왔을 때 이전 사람이 입력하던 비밀번호까지 눈 아이콘으로 그대로 볼 수 있다.
  const isLeavingToTermsRef = useRef(false)

  useEffect(() => {
    return () => {
      if (!isLeavingToTermsRef.current) {
        useSignUpDraftStore.getState().reset()
      }
    }
  }, [])

  // 약관 상세(/terms/:termType)로 갔다가 뒤로가기로 돌아와도 입력값이 날아가지 않도록,
  // draft 스토어에 있던 값으로 시작하고 아래 useEffect에서 계속 동기화한다.
  const name = useValidatedField(validateName, signUpDraft.name)
  const id = useValidatedField(validateId, signUpDraft.loginId)
  const password = useValidatedField(validatePassword, signUpDraft.password)
  const email = useValidatedField(validateEmail, signUpDraft.email)
  const phone = useValidatedField(validatePhone, signUpDraft.phone)

  useEffect(() => {
    useSignUpDraftStore.setState({
      name: name.fieldProps.value,
      loginId: id.fieldProps.value,
      password: password.fieldProps.value,
      email: email.fieldProps.value,
      phone: phone.fieldProps.value,
      terms,
    })
  }, [
    name.fieldProps.value,
    id.fieldProps.value,
    password.fieldProps.value,
    email.fieldProps.value,
    phone.fieldProps.value,
    terms,
  ])

  useEffect(() => {
    setIdAvailability('idle')
  }, [id.fieldProps.value])


  const isAllAgreed = TERM_ITEMS.every(({ key }) => terms[key])

  const canSubmit =
    REQUIRED_TERMS.every((key) => terms[key]) &&
    name.isValid &&
    id.isValid &&
    idAvailability === 'available' &&
    password.isValid &&
    email.isValid &&
    phone.isValid &&
    !isSubmitting

  const toggleAll = () => {
    const next = !isAllAgreed
    setTerms({ service: next, privacy: next, age: next, marketing: next })
  }

  const toggleTerm = (key: TermKey) => {
    setTerms((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleIdBlur: FocusEventHandler<HTMLInputElement> = async (event) => {
    id.fieldProps.onBlur(event)
    if (!id.isValid || id.fieldProps.value === '') return

    const requestedId = id.fieldProps.value
    latestIdCheckRef.current = requestedId

    setIdAvailability('checking')
    try {
      const { available } = await checkLoginIdAvailable(requestedId)
      if (latestIdCheckRef.current !== requestedId) return
      setIdAvailability(available ? 'available' : 'taken')
    } catch {
      if (latestIdCheckRef.current !== requestedId) return
      setIdAvailability('idle')
    }
  }

  const handleSubmit = async () => {
    if (!canSubmit) return

    setIsSubmitting(true)
    try {
      await signup({
        loginId: id.fieldProps.value,
        name: name.fieldProps.value,
        password: password.fieldProps.value,
        email: email.fieldProps.value,
        phoneNumber: phone.fieldProps.value.replace(/-/g, ''),
        agreedTermsIds: TERM_ITEMS.filter(({ key }) => terms[key]).map(({ id: termId }) => termId),
      })

      // 자체 가입 API는 토큰을 안 줘서(회원가입만으로는 로그인 상태가 안 됨), 방금 입력한
      // 아이디/비밀번호로 바로 로그인해서 소셜 가입과 동일하게 가입 직후 로그인 상태로 만든다.
      // 이 로그인 호출만 실패해도 회원가입 자체는 이미 끝난 상태이니 완료 화면으로는 그대로 이동한다.
      try {
        const { token } = await login(id.fieldProps.value, password.fieldProps.value)
        queryClient.clear()
        authLogin({ accessToken: token.accessToken, refreshToken: token.refreshToken })
      } catch (loginError) {
        console.error('가입 직후 자동 로그인 실패:', loginError)
      }

      useSignUpDraftStore.getState().reset()
      navigate('/signup/complete')
    } catch (error) {
      showToast(error instanceof ApiError ? error.message : '회원가입에 실패했어요. 다시 시도해 주세요')
    } finally {
      setIsSubmitting(false)
    }
  }

  const idError =
    id.fieldProps.error ?? (idAvailability === 'taken' ? '이미 사용 중인 아이디에요' : undefined)

  return (
    <div className="flex min-h-dvh w-full flex-col bg-white">
      <NavigationBar title="회원가입" showRight={false} onBack={() => navigate(-1)} />

      <div className="flex w-full flex-col pt-5">
        <InputField label="이름" placeholder="이름을 입력해 주세요" {...name.fieldProps} />
        <InputField
          label="아이디"
          placeholder="영문 소문자, 숫자를 포함하여 4~12자로 작성"
          {...id.fieldProps}
          error={idError}
          onBlur={handleIdBlur}
        />
        <InputField
          label="비밀번호"
          placeholder="영문, 숫자, 특수문자를 포함하여 8-20자로 작성"
          type="password"
          {...password.fieldProps}
        />
        <InputField
          label="이메일 (필수)"
          placeholder="이메일을 입력해 주세요"
          type="email"
          {...email.fieldProps}
        />
        <InputField
          label="전화번호 (필수)"
          placeholder="휴대폰 번호를 입력해 주세요"
          prefix="+82"
          type="tel"
          {...phone.fieldProps}
        />

        <Agreement
          items={TERM_ITEMS}
          checked={terms}
          onToggleAll={toggleAll}
          onToggleItem={(key) => toggleTerm(key as TermKey)}
          onItemDetailClick={(key) => {
            isLeavingToTermsRef.current = true
            navigate(`/terms/${key}`)
          }}
        />
      </div>

      <div className="sticky bottom-0 mt-auto w-full bg-white p-5">
        <Button variant={canSubmit ? 'primary' : 'disabled'} onClick={canSubmit ? handleSubmit : undefined}>
          회원가입
        </Button>
      </div>

      {toast && (
        <div className="pointer-events-none fixed inset-x-0 bottom-24 flex justify-center px-5">
          <Toast key={toast.id} message={toast.message} />
        </div>
      )}
    </div>
  )
}

export default SignUpPage
