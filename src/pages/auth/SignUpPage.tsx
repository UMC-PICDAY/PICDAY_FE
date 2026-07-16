/**
 * Figma A-3 자체 회원가입 (라우트: /signup)
 * 약관 상세(서비스/개인정보/만14세/마케팅)는 Agreement의 onItemDetailClick으로 A-3 하위 화면인 /terms/:termType로 이동
 */
import { useState } from 'react'
import { useNavigate } from 'react-router'

import NavigationBar from '@/components/layout/NavigationBar'
import InputField from '@/components/common/InputField'
import Agreement from '@/components/common/Agreement'
import Button from '@/components/common/Button'
import { useValidatedField } from '@/hooks/useValidatedField'

type TermKey = 'service' | 'privacy' | 'age' | 'marketing'

const REQUIRED_TERMS: TermKey[] = ['service', 'privacy', 'age']

const TERM_ITEMS: { key: TermKey; label: string }[] = [
  { key: 'service', label: '서비스 이용 약관 동의 (필수)' },
  { key: 'privacy', label: '개인정보 수집 및 이용 동의 (필수)' },
  { key: 'age', label: '만 14세 이상 확인 (필수)' },
  { key: 'marketing', label: '마케팅 알림 수신 동의 (선택)' },
]

// 영문 소문자로 시작, 소문자/숫자만 허용, 4~12자 (대문자·공백·특수문자·숫자시작·숫자만 금지)
const ID_REGEX = /^[a-z][a-z0-9]{3,11}$/
// 영문, 숫자, 특수문자를 모두 포함한 8~20자
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,20}$/
// API 없어서 이미 사용 중인 아이디를 목업으로 하드코딩 (실제로는 서버에서 중복 확인)
const TAKEN_IDS = ['daisy1234', 'test1234']
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
  if (TAKEN_IDS.includes(value)) return '이미 사용 중인 아이디에요'
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

const SignUpPage = () => {
  const navigate = useNavigate()
  const [terms, setTerms] = useState<Record<TermKey, boolean>>({
    service: false,
    privacy: false,
    age: false,
    marketing: false,
  })

  const name = useValidatedField(validateName)
  const id = useValidatedField(validateId)
  const password = useValidatedField(validatePassword)
  const email = useValidatedField(validateEmail)
  const phone = useValidatedField(validatePhone)

  const isAllAgreed = TERM_ITEMS.every(({ key }) => terms[key])

  const canSubmit =
    REQUIRED_TERMS.every((key) => terms[key]) &&
    name.isValid &&
    id.isValid &&
    password.isValid &&
    email.isValid &&
    phone.isValid

  const toggleAll = () => {
    const next = !isAllAgreed
    setTerms({ service: next, privacy: next, age: next, marketing: next })
  }

  const toggleTerm = (key: TermKey) => {
    setTerms((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="flex min-h-dvh w-full flex-col bg-white">
      <NavigationBar title="회원가입" showRight={false} onBack={() => navigate(-1)} />

      <InputField label="이름" placeholder="이름을 입력해 주세요" {...name.fieldProps} />
      <InputField
        label="아이디"
        placeholder="영문 소문자, 숫자를 포함하여 4~12자로 작성"
        {...id.fieldProps}
      />
      <InputField
        label="비밀번호"
        placeholder="영문, 숫자, 특수문자를 포함하여 8-20자로 작성"
        type="password"
        {...password.fieldProps}
      />
      <InputField
        label="이메일"
        placeholder="이메일을 입력해 주세요"
        type="email"
        {...email.fieldProps}
      />
      <InputField
        label="전화번호"
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
        onItemDetailClick={(key) => navigate(`/terms/${key}`)}
      />

      <div className="sticky bottom-0 mt-auto w-full bg-white p-5">
        <Button
          variant={canSubmit ? 'primary' : 'disabled'}
          onClick={canSubmit ? () => navigate('/signup/complete') : undefined}
        >
          회원가입
        </Button>
      </div>
    </div>
  )
}

export default SignUpPage
