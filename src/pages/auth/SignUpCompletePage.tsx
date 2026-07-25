/** Figma A-4 회원가입 완료 (라우트: /signup/complete) */
import { useNavigate } from 'react-router'

import Button from '@/components/common/Button'
import { IcUser } from '@/components/icons'
import { useAuthStore } from '@/stores/useAuthStore'

const SignUpCompletePage = () => {
  const navigate = useNavigate()
  // 회원가입 직후 자동 로그인이 성공했으면 바로 홈으로, 실패했을 때만 로그인 화면으로 보낸다.
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)

  return (
    <div className="flex min-h-dvh w-full flex-col bg-white">
      <div className="flex flex-1 flex-col items-center justify-center gap-5 p-[10px]">
        <div className="flex size-[76px] items-center justify-center rounded-full bg-[rgba(254,228,235,0.4)]">
          <IcUser width={50} height={50} className="text-brand-40" />
        </div>

        <div className="flex flex-col items-center gap-2">
          <p className="whitespace-nowrap font-h3 text-brand-80">회원가입이 완료되었습니다</p>
          <p className="whitespace-nowrap font-b6 text-gray-40">이제 PICDAY에서 사진관을 예약해 보세요</p>
        </div>
      </div>

      <div className="w-full p-5">
        <Button
          variant="primary"
          onClick={() => navigate(isLoggedIn ? '/home' : '/login')}
        >
          {isLoggedIn ? '홈으로 가기' : '로그인하러 가기'}
        </Button>
      </div>
    </div>
  )
}

export default SignUpCompletePage
