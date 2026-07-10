import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import NavigationBar from '@/components/layout/NavigationBar'
import LogoType from '@/components/layout/LogoType'
import InputField from '@/components/common/InputField'
import Button from '@/components/common/Button'
import Toast from '@/components/common/Toast'
import { IcClose } from '@/components/icons'

type LoginToast = 'network' | 'auth' | null

const TOAST_MESSAGE: Record<Exclude<LoginToast, null>, string> = {
  network: '연결 상태를 확인해 주세요',
  auth: '로그인에 실패했어요. 다시 시도해 주세요',
}

const LoginPage = () => {
  const navigate = useNavigate()
  const [toast, setToast] = useState<LoginToast>(null)

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(timer)
  }, [toast])

  const handleLogin = () => {
    // API 명세가 아직 없어서 온라인 여부로만 분기하고, 그 외에는 인증 실패로 처리
    setToast(navigator.onLine ? 'auth' : 'network')
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

      <InputField label="아이디" placeholder="아이디를 입력해 주세요" />
      <InputField label="비밀번호" placeholder="비밀번호를 입력해 주세요" type="password" />

      <div className="flex w-full items-center justify-between px-5">
        <button type="button" className="cursor-pointer border-none bg-transparent p-0 font-b6 text-gray-40">
          아이디찾기
        </button>
        <button type="button" className="cursor-pointer border-none bg-transparent p-0 font-b6 text-gray-40">
          비밀번호 찾기
        </button>
      </div>

      <div className="w-full p-5">
        <Button variant="primary" onClick={handleLogin}>
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
        >
          <svg width="26" height="24" viewBox="0 0 26 24" fill="none" aria-hidden>
            <path
              d="M13 1.5C6.1 1.5 0.5 5.72 0.5 10.86c0 3.31 2.31 6.21 5.79 7.9-.19.87-1.02 3.38-1.11 3.9-.05.28.13.55.42.6.11.02.22 0 .32-.05.36-.19 3.53-2.4 4.87-3.32.7.1 1.41.15 2.13.15 6.9 0 12.5-4.22 12.5-9.28S19.9 1.5 13 1.5z"
              fill="#391B1B"
            />
          </svg>
        </button>
        <button
          type="button"
          className="flex size-[52px] cursor-pointer items-center justify-center rounded-full border-none bg-[#03c75a]"
          aria-label="네이버로 로그인"
        >
          <span className="font-h2 text-white">N</span>
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
          <Toast message={TOAST_MESSAGE[toast]} />
        </div>
      )}
    </div>
  )
}

export default LoginPage
