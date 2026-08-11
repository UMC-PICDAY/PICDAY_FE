/**
 * Figma F-3 프로필 설정
 * 라우트: /mypage/profile
 *
 * 닉네임, 연결 계정, 알림 설정을 관리하고
 * 회원탈퇴 팝업 플로우를 처리함
 */
import Toast from '@/components/common/Toast'
import { useToast } from '@/hooks/useToast'
import {
  useMe,
  useNicknameAvailability,
  useUpdateNickname,
  useWithdraw,
} from '@/hooks/useAuth'
import { useAuthStore } from '@/stores/useAuthStore'
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
import AppTabBar from '@/components/layout/AppTabBar'
import { ProfileHeaderSkeleton } from '@/pages/mypage/components/MyPageSkeleton'
import { logout } from '@/services/auth'

const ProfileSettingPage = () => {
  const navigate = useNavigate()

  const clearAuth = useAuthStore((state) => state.logout)

  const { toast, showToast } = useToast()

  const {
    data: meData,
    isLoading,
    isError: isMeError,
  } = useMe()

  const updateNicknameMutation = useUpdateNickname()
  const withdrawMutation = useWithdraw()

  // 사용자 정보 — getMe 응답을 그대로 쓰지 않고 로컬 편집 상태로 복사해
  // 닉네임 입력·저장 중에도 화면이 즉시 반응하게 한다.
  const [nickname, setNickname] = useState('')
  const [originalNickname, setOriginalNickname] =
    useState('')

  // 알림 설정
  const [reservationAlarm, setReservationAlarm] =
    useState(false)
  const [marketingAlarm, setMarketingAlarm] =
    useState(false)

  // 회원탈퇴 팝업 단계
  const [withdrawStep, setWithdrawStep] = useState<
    'none' | 'confirm' | 'delete'
  >('none')

  const profileImageUrl =
    meData?.user.profileImageUrl ?? ''
  const provider = meData?.user.provider ?? 'LOCAL'

  // getMe 응답이 도착하면 로컬 편집 상태를 한 번 채운다.
  useEffect(() => {
    if (!meData) return

    setNickname(meData.user.nickname)
    setOriginalNickname(meData.user.nickname)
    setReservationAlarm(
      meData.user.notification?.reservation ?? false,
    )
    setMarketingAlarm(
      meData.user.notification?.marketing ?? false,
    )
  }, [meData])

  useEffect(() => {
    if (!isMeError) return
    showToast('내 정보를 불러오지 못했습니다.')
  }, [isMeError, showToast])

  // 닉네임 유효성 검사
  const trimmedNickname = nickname.trim()

  const isNicknameValid =
    trimmedNickname.length >= 2 &&
    trimmedNickname.length <= 10

  // 닉네임 중복 확인 — 입력이 멈춘 뒤 300ms 후의 값만 조회 대상으로 삼는다.
  const [debouncedNickname, setDebouncedNickname] =
    useState('')

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedNickname(trimmedNickname)
    }, 300)

    return () => window.clearTimeout(timer)
  }, [trimmedNickname])

  const shouldCheckNickname =
    isNicknameValid &&
    debouncedNickname === trimmedNickname &&
    debouncedNickname !== originalNickname

  const {
    data: nicknameAvailability,
    isFetching: isCheckingNickname,
  } = useNicknameAvailability(
    debouncedNickname,
    shouldCheckNickname,
  )

  const isNicknameDuplicate =
    shouldCheckNickname &&
    nicknameAvailability?.available === false

  const isSaveDisabled =
    updateNicknameMutation.isPending ||
    isCheckingNickname ||
    !isNicknameValid ||
    isNicknameDuplicate

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
  const handleSave = () => {
    if (isSaveDisabled) {
      return
    }

    updateNicknameMutation.mutate(trimmedNickname, {
      onSuccess: (result) => {
        const updatedNickname = result.user.nickname

        setNickname(updatedNickname)
        setOriginalNickname(updatedNickname)

        showToast('프로필이 저장되었습니다.')
      },
      onError: (error) => {
        console.error('닉네임 수정 실패:', error)
        showToast('프로필 저장에 실패했습니다.')
      },
    })
  }

  // 로그아웃
  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('로그아웃 실패:', error)
    } finally {
      clearAuth()
      // replace: 로그인 화면에서 뒤로가기(닫기)를 눌렀을 때 로그아웃 전 마이페이지로
      // 돌아가지 않도록 히스토리에서 마이페이지 항목을 로그인 화면으로 대체한다.
      navigate('/login', { replace: true })
    }
  }

  // 회원탈퇴
  const handleWithdraw = () => {
    withdrawMutation.mutate(undefined, {
      onSuccess: () => {
        clearAuth()
        navigate('/mypage/withdraw/complete')
      },
      onError: (error) => {
        console.error('회원탈퇴 실패:', error)
        showToast(
          '회원탈퇴에 실패했습니다. 진행 중인 예약을 확인해 주세요.',
        )
      },
    })
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
      {isLoading ? (
        <ProfileHeaderSkeleton />
      ) : (
        <Profile
          variant="userInfo"
          userName={originalNickname}
          accountText={accountText}
          userImageSrc={
            profileImageUrl || logoIcon
          }
        />
      )}

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
            {updateNicknameMutation.isPending
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
        <AppTabBar activeTab="mypage" />
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
              onConfirm={handleWithdraw}
            />
          )}
        </div>
      )}

      {toast && (
        <div className="fixed bottom-[110px] left-1/2 z-[60] -translate-x-1/2">
          <Toast key={toast.id} message={toast.message} />
        </div>
      )}
    </main>
  )
}

export default ProfileSettingPage