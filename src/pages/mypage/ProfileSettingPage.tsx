/**
 * Figma F-3 프로필 설정 (라우트: /mypage/profile)
 * 닉네임, 연결 계정, 알림 설정을 관리하고 회원탈퇴 팝업 플로우를 처리함
 */
import { useState } from 'react'
import { useNavigate } from 'react-router'

import logoIcon from '@/assets/images/logo-icon.png'
import Alert2 from '@/components/common/Alert2'
import Button from '@/components/common/Button'
import ConnectionTag from '@/components/common/ConnectionTag'
import InputField2 from '@/components/common/InputField2'
import Profile from '@/components/common/Profile'
import SegmentedTab from '@/components/common/SegmentedTab'
import Toggle from '@/components/common/Toggle'
import TabBarUser from '@/components/layout/TabBarUser'

const ProfileSettingPage = () => {
  const navigate = useNavigate()
  const [nickname, setNickname] = useState('고요한순간0409')
  const [reservationAlarm, setReservationAlarm] = useState(true)
  const [marketingAlarm, setMarketingAlarm] = useState(false)
  const [withdrawStep, setWithdrawStep] = useState<'none' | 'confirm' | 'delete'>('none')

  const handleTabChange = (value: string) => {
    if (value === 'reservation') {
      navigate('/mypage')
      return
    }

    navigate('/mypage/profile')
  }

  const closeWithdrawModal = () => {
    setWithdrawStep('none')
  }

  return (
    <main className="relative mx-auto min-h-screen w-full max-w-[402px] bg-white pb-[108px]">
      <Profile
        variant="userInfo"
        userName="이수현"
        accountText="자체 로그인"
        userImageSrc={logoIcon}
      />

      <SegmentedTab
        items={[
          { value: 'reservation', label: '예약관리' },
          { value: 'profile', label: '프로필 설정' },
        ]}
        value="profile"
        onChange={handleTabChange}
      />

      <section className="px-5 pt-5">
        <InputField2
          label="닉네임"
          value={nickname}
          helperText="2~10자, 한글·영문·숫자 사용 가능"
          onChange={setNickname}
        />

        <div className="mt-5">
          <p className="font-cap1 text-gray-80">연결된 계정</p>

          <div className="mt-2 flex h-10 w-full items-center justify-between rounded-[8px] bg-brand-20 px-[10px]">
            <span className="font-b8 text-gray-80">-</span>
            <ConnectionTag label="연동된 외부 계정 없음" />
          </div>
        </div>

        <div className="mt-5">
          <p className="font-cap1 text-gray-80">알림설정</p>

          <div className="mt-2 flex h-10 items-center justify-between border-b border-gray-10">
            <span className="font-b8 text-gray-80">예약 확정 알림</span>
            <Toggle checked={reservationAlarm} onCheckedChange={setReservationAlarm} />
          </div>

          <div className="flex h-10 items-center justify-between border-b border-gray-10">
            <span className="font-b8 text-gray-80">마케팅·이벤트 알림</span>
            <Toggle checked={marketingAlarm} onCheckedChange={setMarketingAlarm} />
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-[10px]">
          <Button variant="primary">저장하기</Button>
          <Button variant="secondary">로그아웃</Button>

          <button
            type="button"
            className="h-10 w-full font-b8 text-gray-40"
            onClick={() => setWithdrawStep('confirm')}
          >
            회원탈퇴
          </button>
        </div>
      </section>

      <div className="fixed bottom-0 left-1/2 w-full max-w-[402px] -translate-x-1/2">
        <TabBarUser activeTab="mypage" />
      </div>

      {withdrawStep !== 'none' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#464545]/90 px-5">
          {withdrawStep === 'confirm' && (
            <Alert2
              variant="default"
              onCancel={closeWithdrawModal}
              onConfirm={() => setWithdrawStep('delete')}
            />
          )}

          {withdrawStep === 'delete' && (
            <Alert2
              variant="variant2"
              onCancel={closeWithdrawModal}
              onConfirm={() => navigate('/mypage/withdraw/complete')}
            />
          )}
        </div>
      )}
    </main>
  )
}

export default ProfileSettingPage