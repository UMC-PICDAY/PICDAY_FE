/**
 * Figma F-3 프로필 설정 (라우트: /mypage/profile)
 *
 * 닉네임, 연결 계정, 알림 설정을 관리하고 회원탈퇴 팝업 플로우를 처리함
 *
 * 화면 상태 확인:
 * - loginType = 'social' → 카카오 계정 연결 상태
 * - loginType = 'local'  → 자체 로그인, 연동된 외부 계정 없음 상태
 * - isNicknameDuplicate = true → 닉네임 중복 에러 상태
 *
 * TODO: API 연결 후 로그인 방식과 닉네임 중복 여부를 서버 응답값으로 대체 예정
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

type LoginType = 'social' | 'local'

const loginType: LoginType = 'social'
const isNicknameDuplicate = false

const ProfileSettingPage = () => {
  const navigate = useNavigate()
  const [nickname, setNickname] = useState('고요한순간0409')
  const [reservationAlarm, setReservationAlarm] = useState(true)
  const [marketingAlarm, setMarketingAlarm] = useState(false)
  const [withdrawStep, setWithdrawStep] = useState<'none' | 'confirm' | 'delete'>('none')

  const isSocialLogin = loginType === 'social'

  const accountText = isSocialLogin ? '카카오 계정 연결' : '자체 로그인'
  const connectedAccountText = isSocialLogin ? '카카오계정' : '-'
  const connectionLabel = isSocialLogin ? '연결됨' : '연동된 외부 계정 없음'

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
    <main className="relative mx-auto flex min-h-dvh w-full max-w-[402px] flex-col bg-white">
      <Profile
        variant="userInfo"
        userName="이수현"
        accountText={accountText}
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
          helperText={
            isNicknameDuplicate
              ? '이미 사용 중인 닉네임이에요'
              : '2~10자, 한글·영문·숫자 사용 가능'
          }
          isError={isNicknameDuplicate}
          onChange={setNickname}
        />

        <div className="mt-5">
          <p className="font-cap1 text-gray-80">연결된 계정</p>

          <div className="mt-2 flex h-10 w-full items-center justify-between rounded-[8px] bg-[rgba(254,228,235,0.3)] px-[10px]">
            <span className="font-b8 text-gray-80">{connectedAccountText}</span>
            <ConnectionTag label={connectionLabel} />
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

      <div className="sticky bottom-0 mt-auto w-full">
        <TabBarUser
          activeTab="mypage"
          onTabChange={(tab) => {
            if (tab === 'search') navigate('/home')
            if (tab === 'wishlist') navigate('/wishlist')
            if (tab === 'mypage') navigate('/mypage')
          }}
        />
      </div>

      {withdrawStep !== 'none' && (
        <div className="fixed left-1/2 top-0 z-50 flex h-dvh w-full max-w-[402px] -translate-x-1/2 items-center justify-center bg-[#464545]/90 px-5">
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