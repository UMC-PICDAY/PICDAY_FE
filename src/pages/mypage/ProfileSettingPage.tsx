/**
 * Figma F-3 프로필 설정
 * 라우트: /mypage/profile
 *
 * 닉네임, 연결 계정, 알림 설정을 관리하고
 * 회원탈퇴 팝업 플로우를 처리함
 */

import { useEffect, useState } from 'react'
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
import {
  checkNicknameAvailable,
  getMe,
  logout,
  updateNickname,
} from '@/services/auth'

const ProfileSettingPage = () => {
  const navigate = useNavigate()

  // 사용자 정보
  const [userName, setUserName] = useState('')
  const [nickname, setNickname] = useState('')
  const [originalNickname, setOriginalNickname] =
    useState('')
  const [profileImageUrl, setProfileImageUrl] =
    useState('')
  const [provider, setProvider] = useState<
    'LOCAL' | 'KAKAO' | 'GOOGLE'
  >('LOCAL')

  // 알림 설정
  const [reservationAlarm, setReservationAlarm] =
    useState(false)
  const [marketingAlarm, setMarketingAlarm] =
    useState(false)

  // API 처리 상태
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [
    isCheckingNickname,
    setIsCheckingNickname,
  ] = useState(false)
  const [
    isNicknameDuplicate,
    setIsNicknameDuplicate,
  ] = useState(false)

  // 회원탈퇴 팝업 단계
  const [withdrawStep, setWithdrawStep] = useState<
    'none' | 'confirm' | 'delete'
  >('none')

  // 닉네임 유효성 검사
  const trimmedNickname = nickname.trim()

  const isNicknameValid =
    trimmedNickname.length >= 2 &&
    trimmedNickname.length <= 10

  const isSaveDisabled =
    isSaving ||
    isCheckingNickname ||
    !isNicknameValid ||
    isNicknameDuplicate

  // 내 정보 조회
  useEffect(() => {
    const fetchMyInfo = async () => {
      try {
        setIsLoading(true)

        const result = await getMe()
        const user = result.user

        setUserName(user.name)
        setNickname(user.nickname)
        setOriginalNickname(user.nickname)
        setProfileImageUrl(user.profileImageUrl)
        setProvider(user.provider)
        setReservationAlarm(
          user.notification.reservation,
        )
        setMarketingAlarm(
          user.notification.marketing,
        )
      } catch (error) {
        console.error('내 정보 조회 실패:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMyInfo()
  }, [])

  // 닉네임 중복 확인
  useEffect(() => {
    if (!isNicknameValid) {
      setIsNicknameDuplicate(false)
      setIsCheckingNickname(false)
      return
    }

    if (trimmedNickname === originalNickname) {
      setIsNicknameDuplicate(false)
      setIsCheckingNickname(false)
      return
    }

    const timer = window.setTimeout(async () => {
      try {
        setIsCheckingNickname(true)

        const result =
          await checkNicknameAvailable(
            trimmedNickname,
          )

        setIsNicknameDuplicate(!result.available)
      } catch (error) {
        console.error(
          '닉네임 중복 확인 실패:',
          error,
        )
      } finally {
        setIsCheckingNickname(false)
      }
    }, 300)

    return () => {
      window.clearTimeout(timer)
    }
  }, [
    trimmedNickname,
    originalNickname,
    isNicknameValid,
  ])

  // 로그인 제공자 표시 문구
  const isSocialLogin = provider !== 'LOCAL'

  const providerLabel =
    provider === 'KAKAO'
      ? '카카오'
      : provider === 'GOOGLE'
        ? '구글'
        : '자체'

  const accountText = isSocialLogin
    ? `${providerLabel} 계정 연결`
    : '자체 로그인'

  const connectedAccountText = isSocialLogin
    ? `${providerLabel}계정`
    : '-'

  const connectionLabel = isSocialLogin
    ? '연결됨'
    : '연동된 외부 계정 없음'

  // 닉네임 저장
  const handleSave = async () => {
    if (isSaveDisabled) {
      return
    }

    try {
      setIsSaving(true)

      const result = await updateNickname(
        trimmedNickname,
      )

      const updatedNickname =
        result.user.nickname

      setNickname(updatedNickname)
      setOriginalNickname(updatedNickname)
      setIsNicknameDuplicate(false)

      alert('프로필이 저장되었습니다.')
    } catch (error) {
      console.error('닉네임 수정 실패:', error)
    } finally {
      setIsSaving(false)
    }
  }

  // 로그아웃
  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('로그아웃 실패:', error)
    }
  }

  // 상단 탭 이동
  const handleTabChange = (value: string) => {
    if (value === 'reservation') {
      navigate('/mypage')
      return
    }

    navigate('/mypage/profile')
  }

  // 회원탈퇴 팝업 닫기
  const closeWithdrawModal = () => {
    setWithdrawStep('none')
  }

  return (
    <main className="relative mx-auto flex min-h-dvh w-full max-w-[402px] flex-col bg-white">
      <Profile
        variant="userInfo"
        userName={
          isLoading
            ? '불러오는 중...'
            : userName
        }
        accountText={accountText}
        userImageSrc={
          profileImageUrl || logoIcon
        }
      />

      <SegmentedTab
        items={[
          {
            value: 'reservation',
            label: '예약관리',
          },
          {
            value: 'profile',
            label: '프로필 설정',
          },
        ]}
        value="profile"
        onChange={handleTabChange}
      />

      <section className="px-5 pt-5">
        <InputField2
          label="닉네임"
          value={nickname}
          helperText={
            isCheckingNickname
              ? '닉네임을 확인하고 있어요'
              : isNicknameDuplicate
                ? '이미 사용 중인 닉네임이에요'
                : '2~10자, 한글·영문·숫자 사용 가능'
          }
          isError={isNicknameDuplicate}
          onChange={setNickname}
        />

        <div className="mt-5">
          <p className="font-cap1 text-gray-80">
            연결된 계정
          </p>

          <div className="mt-2 flex h-10 w-full items-center justify-between rounded-[8px] bg-[rgba(254,228,235,0.3)] px-[10px]">
            <span className="font-b8 text-gray-80">
              {connectedAccountText}
            </span>

            <ConnectionTag
              label={connectionLabel}
            />
          </div>
        </div>

        <div className="mt-5">
          <p className="font-cap1 text-gray-80">
            알림설정
          </p>

          <div className="mt-2 flex h-10 items-center justify-between border-b border-gray-10">
            <span className="font-b8 text-gray-80">
              예약 확정 알림
            </span>

            <Toggle
              checked={reservationAlarm}
              onCheckedChange={
                setReservationAlarm
              }
            />
          </div>

          <div className="flex h-10 items-center justify-between border-b border-gray-10">
            <span className="font-b8 text-gray-80">
              마케팅·이벤트 알림
            </span>

            <Toggle
              checked={marketingAlarm}
              onCheckedChange={
                setMarketingAlarm
              }
            />
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-[10px]">
          <Button
            variant={
              isSaveDisabled
                ? 'disabled'
                : 'primary'
            }
            onClick={
              isSaveDisabled
                ? undefined
                : handleSave
            }
          >
            {isSaving
              ? '저장 중...'
              : isCheckingNickname
                ? '확인 중...'
                : '저장하기'}
          </Button>

          <Button
            variant="secondary"
            onClick={handleLogout}
          >
            로그아웃
          </Button>

          <button
            type="button"
            className="h-10 w-full font-b8 text-gray-40"
            onClick={() =>
              setWithdrawStep('confirm')
            }
          >
            회원탈퇴
          </button>
        </div>
      </section>

      <div className="sticky bottom-0 mt-auto w-full">
        <TabBarUser
          activeTab="mypage"
          onTabChange={(tab) => {
            if (tab === 'search') {
              navigate('/home')
            }

            if (tab === 'wishlist') {
              navigate('/wishlist')
            }

            if (tab === 'mypage') {
              navigate('/mypage')
            }
          }}
        />
      </div>

      {withdrawStep !== 'none' && (
        <div className="fixed left-1/2 top-0 z-50 flex h-dvh w-full max-w-[402px] -translate-x-1/2 items-center justify-center bg-[#464545]/90 px-5">
          {withdrawStep === 'confirm' && (
            <Alert2
              variant="default"
              onCancel={closeWithdrawModal}
              onConfirm={() =>
                setWithdrawStep('delete')
              }
            />
          )}

          {withdrawStep === 'delete' && (
            <Alert2
              variant="variant2"
              onCancel={closeWithdrawModal}
              onConfirm={() =>
                navigate(
                  '/mypage/withdraw/complete',
                )
              }
            />
          )}
        </div>
      )}
    </main>
  )
}

export default ProfileSettingPage