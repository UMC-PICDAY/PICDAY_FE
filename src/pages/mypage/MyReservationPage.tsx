/**
 * Figma F-1 예약관리 (라우트: /mypage)
 *
 * 예약 상태 필터(전체/예약완료/촬영완료/취소)와
 * 예약 내역 카드 목록을 표시함
 * 예약 내역이 없는 경우 empty 상태 화면을 표시함
 */

import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  useNavigate,
  useSearchParams,
} from 'react-router'

import logoIcon from '@/assets/images/logo-icon.png'
import CardReservationHistory from '@/components/cards/CardReservationHistory'
import FilterBar1 from '@/components/common/FilterBar1'
import Profile from '@/components/common/Profile'
import SegmentedTab from '@/components/common/SegmentedTab'
import { IcEvent2 } from '@/components/icons'
import AppTabBar from '@/components/layout/AppTabBar'
import { ReservationListSkeleton } from '@/pages/mypage/components/MyPageSkeleton'
import { getMe } from '@/services/auth'
import {
  getMyReservations,
  getReservationDetail,
  type ReservationListItem,
  type ReservationStatus,
} from '@/services/reservation'

type FilterType =
  | 'all'
  | 'reservation'
  | 'shooting'
  | 'canceled'

const FILTER_STATUS_MAP: Record<
  Exclude<FilterType, 'all'>,
  ReservationStatus
> = {
  reservation: 'RESERVED',
  shooting: 'COMPLETED',
  canceled: 'CANCELLED',
}

const isFilterType = (
  value: string | null,
): value is FilterType =>
  value === 'all' ||
  value === 'reservation' ||
  value === 'shooting' ||
  value === 'canceled'

const formatReservationDateTime = (
  reservationDate: string,
  reservationTime: string,
) => {
  const [year, month, day] = reservationDate
    .split('-')
    .map(Number)

  const date = new Date(
    year,
    month - 1,
    day,
  )

  const weekday =
    new Intl.DateTimeFormat('ko-KR', {
      weekday: 'short',
    }).format(date)

  return `${year}년 ${month}월 ${day}일 (${weekday}) ${reservationTime}`
}

const getStatusTag = (
  status: ReservationStatus,
) => {
  switch (status) {
    case 'RESERVED':
      return '예약 완료'

    case 'COMPLETED':
      return '촬영 완료'

    case 'CANCELLED':
      return '취소'
  }
}

const MyReservationPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [
    reservations,
    setReservations,
  ] = useState<ReservationListItem[]>([])

  const [
    isLoading,
    setIsLoading,
  ] = useState(true)

  const [
    hasError,
    setHasError,
  ] = useState(false)

  const [userName, setUserName] = useState('')

  const [
    profileImageUrl,
    setProfileImageUrl,
  ] = useState('')

  const [provider, setProvider] = useState<
    'LOCAL' | 'KAKAO' | 'GOOGLE'
  >('LOCAL')

  const filterParam =
    searchParams.get('filter')

  const currentFilter: FilterType =
    isFilterType(filterParam)
      ? filterParam
      : 'all'

  useEffect(() => {
    const fetchReservations =
      async () => {
        setIsLoading(true)
        setHasError(false)

        try {
          const result =
            await getMyReservations()

          setReservations(result)
        } catch (error) {
          console.error(
            '예약 내역 조회에 실패했습니다.',
            error,
          )

          setReservations([])
          setHasError(true)
        } finally {
          setIsLoading(false)
        }
      }

    void fetchReservations()
  }, [])

  useEffect(() => {
    getMe()
      .then((result) => {
        setUserName(result.user.name)
        setProfileImageUrl(result.user.profileImageUrl ?? '')
        setProvider(result.user.provider)
      })
      .catch((error) => {
        console.error('내 정보 조회에 실패했습니다.', error)
      })
  }, [])

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

  const reservationCounts = useMemo(
    () => ({
      reservation:
        reservations.filter(
          (reservation) =>
            reservation.status ===
            'RESERVED',
        ).length,

      shooting:
        reservations.filter(
          (reservation) =>
            reservation.status ===
            'COMPLETED',
        ).length,

      canceled:
        reservations.filter(
          (reservation) =>
            reservation.status ===
            'CANCELLED',
        ).length,
    }),
    [reservations],
  )

  const filterItems = useMemo(
    () => [
      {
        value: 'all',
        label: '전체',
        count: reservations.length,
      },
      {
        value: 'reservation',
        label: '예약완료',
        count:
          reservationCounts.reservation,
      },
      {
        value: 'shooting',
        label: '촬영완료',
        count:
          reservationCounts.shooting,
      },
      {
        value: 'canceled',
        label: '취소',
        count:
          reservationCounts.canceled,
      },
    ],
    [
      reservationCounts,
      reservations.length,
    ],
  )

  const filteredReservations =
    useMemo(() => {
      if (currentFilter === 'all') {
        return reservations
      }

      const targetStatus =
        FILTER_STATUS_MAP[currentFilter]

      return reservations.filter(
        (reservation) =>
          reservation.status ===
          targetStatus,
      )
    }, [
      currentFilter,
      reservations,
    ])

  const handleTabChange = (
    value: string,
  ) => {
    if (value === 'profile') {
      navigate('/mypage/profile')
      return
    }

    navigate('/mypage')
  }

  const handleFilterChange = (
    value: string,
  ) => {
    if (!isFilterType(value)) {
      return
    }

    if (value === 'all') {
      navigate('/mypage')
      return
    }

    navigate(
      `/mypage?filter=${value}`,
    )
  }

  const handleLeftButtonClick = (
    reservation: ReservationListItem,
  ) => {
    switch (reservation.status) {
      case 'RESERVED':
        navigate(
          `/mypage/reservations/${reservation.reservationId}/cancel`,
        )
        break

      case 'COMPLETED':
      case 'CANCELLED':
        navigate(
          `/mypage/reservations/${reservation.reservationId}`,
        )
        break
    }
  }

  const handleRightButtonClick = async (
    reservation: ReservationListItem,
  ) => {
    switch (reservation.status) {
      case 'RESERVED':
        navigate(
          `/mypage/reservations/${reservation.reservationId}`,
        )
        break

      case 'COMPLETED':
        if (reservation.reviewId !== null) {
          navigate(
            `/mypage/reviews/${reservation.reviewId}`,
          )
          break
        }

        navigate(
          `/mypage/reservations/${reservation.reservationId}/review`,
        )
        break

      case 'CANCELLED':
        try {
          const reservationDetail =
            await getReservationDetail(
              String(reservation.reservationId),
          )

          navigate(
            `/studios/${reservationDetail.studio.id}/concepts`,
            {
              state: {
                openTimeSelectModal: true,
                rebookingInfo: {
                  reserverName:
                    reservationDetail.reserveeName,
                  reserverPhone: 
                    reservationDetail.reserveePhone
                },
              },
            },
          )
        
      } catch (error){
        console.error(
          '재예약을 위한 예약 정보 조회에 실패했습니다.',
          error,
        )

        alert(
          '예약 정보를 불러오지 못했습니다. 다시 시도해 주세요.'
        )
      }
          
        break
    }
  }

  const isReservationEmpty =
    !isLoading &&
    filteredReservations.length === 0

  return (
    <div className="flex min-h-dvh w-full flex-col bg-white">
      <Profile
        variant="userInfo"
        userName={userName}
        accountText={accountText}
        userImageSrc={profileImageUrl || logoIcon}
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
        value="reservation"
        onChange={handleTabChange}
      />

      <FilterBar1
        items={filterItems}
        value={currentFilter}
        onChange={handleFilterChange}
      />

      <section className="flex flex-1 flex-col px-5 pb-5 pt-[10px]">
        {isLoading ? (
          <ReservationListSkeleton />
        ) : hasError ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="flex flex-col items-center gap-5">
              <p className="font-b5 text-black">
                예약 내역을 불러오지 못했어요
              </p>

              <button
                type="button"
                className="rounded-[8px] border border-brand-20 px-5 py-[10px] font-b8 text-brand-100"
                onClick={() =>
                  window.location.reload()
                }
              >
                다시 시도하기
              </button>
            </div>
          </div>
        ) : isReservationEmpty ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-5 p-[10px]">
              <div className="flex h-[64px] w-[64px] items-center justify-center rounded-full bg-brand-20">
                <IcEvent2
                  width={36}
                  height={36}
                  className="text-brand-40"
                />
              </div>

              <div className="flex flex-col items-center gap-5">
                <p className="font-b5 text-black">
                  {reservations.length === 0
                    ? '아직 예약 내역이 없어요'
                    : '해당 예약 내역이 없어요'}
                </p>

                {reservations.length ===
                  0 && (
                  <button
                    type="button"
                    className="rounded-[8px] border border-brand-20 px-5 py-[10px] font-b8 text-brand-100"
                    onClick={() =>
                      navigate('/search')
                    }
                  >
                    사진관 찾아보기
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-5">
            {filteredReservations.map(
              (reservation) => (
                <CardReservationHistory
                  key={
                    reservation.reservationId
                  }
                  imageSrc={
                    reservation.thumbnailUrl
                  }
                  // TODO: 백엔드 AWS 이전 완료 후 secondThumbnailUrl로 수정
                  secondImageSrc={
                    reservation.thumbnailUrl
                  }
                  statusTag={getStatusTag(
                    reservation.status,
                  )}
                  studioName={
                    reservation.studioName
                  }
                  dateTime={formatReservationDateTime(
                    reservation.reservationDate,
                    reservation.reservationTime,
                  )}
                  packageName={
                    reservation.conceptName
                  }
                  rightButtonLabel={
                    reservation.status ===
                      'COMPLETED' &&
                    reservation.reviewId !==
                      null
                      ? '내 리뷰 보기'
                      : undefined
                  }
                  onLeftButtonClick={() =>
                    handleLeftButtonClick(
                      reservation,
                    )
                  }
                  onRightButtonClick={() =>
                    void handleRightButtonClick(
                      reservation,
                    )
                  }
                />
              ),
            )}
          </div>
        )}
      </section>

      <div className="sticky bottom-0 mt-auto w-full">
        <AppTabBar activeTab="mypage" />
      </div>
    </div>
  )
}

export default MyReservationPage