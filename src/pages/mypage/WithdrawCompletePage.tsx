/**
 * Figma F-3 탈퇴 완료 (라우트: /mypage/withdraw/complete)
 * 회원탈퇴 완료 후 홈으로 돌아가는 안내 화면
 */
import { useNavigate } from 'react-router'

import logoIcon from '@/assets/images/logo-icon.png'
import logoText from '@/assets/images/logo-text.svg'
import Button from '@/components/common/Button'

const WithdrawCompletePage = () => {
  const navigate = useNavigate()

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-[402px] flex-col bg-white">
      <section className="flex h-[653px] w-full flex-col items-center justify-center gap-[10px] px-5 py-5">
        <div className="flex w-full flex-col items-center gap-[50px]">
          <div className="flex w-[120px] flex-col items-center gap-[5px]">
            <div className="flex items-center gap-[10px] rounded-[100px] p-[10px]">
              <img
                src={logoIcon}
                alt="PICDAY 로고"
                className="h-[64px] w-[64px] rounded-[16px]"
              />
            </div>

            <img src={logoText} alt="PICDAY" className="h-5 w-[83px]" />
          </div>

          <div className="flex w-full flex-col items-center gap-[10px] text-center">
            <h1 className="whitespace-pre-line font-h3 text-black">
              그동안 PICDAY를{'\n'}이용해 주셔서 감사합니다
            </h1>

            <p className="font-b8 text-gray-40">아쉽지만, 언젠가 다시 만나요.</p>
          </div>
        </div>
      </section>

      <div className="mt-auto px-5 pb-10">
        <Button variant="primary" onClick={() => navigate('/')}>
          홈으로 돌아가기
        </Button>
      </div>
    </main>
  )
}

export default WithdrawCompletePage