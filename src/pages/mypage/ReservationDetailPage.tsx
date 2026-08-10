/**
 * Figma F-1D 예약 상세 (라우트: /mypage/reservations/:reservationId)
 * 예약완료/촬영완료/취소 상태에 따라 예약 상세 화면을 분기해서 표시함
 */

import {
  useEffect,
  useState,
} from 'react'
import {
  useNavigate,
  useParams,
} from 'react-router'

import ReservationDetail from '@/components/cards/ReservationDetail'
import Button from '@/components/common/Button'
import Profile from '@/components/common/Profile'
import {
  IcCheck,
  IcCheckBox,
  IcCheckBoxFill,
} from '@/components/icons'
import NavigationBar from '@/components/layout/NavigationBar'
import {
  getReservationDetail,
  type ReservationDetailData,
} from '@/services/reservation'
import { formatReservationDateTimeLong } from '@/utils/formatReservationDateTime'

interface ChecklistItem {
  id: string
  label: string
  checked: boolean
}

// 체크리스트 체크 여부를 저장하는 백엔드 API가 없어서, 예약 ID별로 localStorage에
// 체크된 항목 id만 저장해두고 재진입 시 복원한다 (기기·브라우저 간 동기화는 안 됨).
// 예약을 볼 때마다 키가 하나씩 쌓이므로, 저장할 때마다 가장 최근에 손댄 순으로
// MAX_STORED_CHECKLISTS개만 남기고 오래된 것부터 지운다.
const CHECKLIST_STORAGE_KEY_PREFIX = 'picday-reservation-checklist-'
const MAX_STORED_CHECKLISTS = 20

interface StoredChecklistState {
  checkedIds: string[]
  updatedAt: number
}

const getStoredCheckedIds = (reservationId: string): Set<string> => {
  try {
    const raw = localStorage.getItem(`${CHECKLIST_STORAGE_KEY_PREFIX}${reservationId}`)
    if (!raw) return new Set()

    const parsed = JSON.parse(raw) as StoredChecklistState
    return new Set(parsed.checkedIds)
  } catch {
    return new Set()
  }
}

// 촬영이 끝났거나(COMPLETED) 취소된(CANCELLED) 예약은 "촬영 전 체크리스트"가
// 더 이상 의미 없으므로, 상세 조회 시점에 그 예약의 저장된 체크 상태를 지운다.
const clearStoredChecklist = (reservationId: string) => {
  try {
    localStorage.removeItem(`${CHECKLIST_STORAGE_KEY_PREFIX}${reservationId}`)
  } catch {
    // ignore
  }
}

const pruneOldChecklistEntries = () => {
  const entries = Object.keys(localStorage)
    .filter((key) => key.startsWith(CHECKLIST_STORAGE_KEY_PREFIX))
    .map((key) => {
      try {
        const parsed = JSON.parse(localStorage.getItem(key) ?? '') as StoredChecklistState
        return { key, updatedAt: parsed.updatedAt }
      } catch {
        return { key, updatedAt: 0 }
      }
    })
    .sort((a, b) => b.updatedAt - a.updatedAt)

  entries
    .slice(MAX_STORED_CHECKLISTS)
    .forEach(({ key }) => localStorage.removeItem(key))
}

const saveCheckedIds = (reservationId: string, checkedIds: string[]) => {
  try {
    const state: StoredChecklistState = {
      checkedIds,
      updatedAt: Date.now(),
    }

    localStorage.setItem(
      `${CHECKLIST_STORAGE_KEY_PREFIX}${reservationId}`,
      JSON.stringify(state),
    )

    pruneOldChecklistEntries()
  } catch {
    // 프라이빗 브라우징 등으로 localStorage 접근이 막혀있어도
    // 체크 자체(화면 동작)는 계속 되어야 하니 조용히 무시
  }
}

const formatCanceledAt = (
  canceledAt?: string | null,
) => {
  if (!canceledAt) {
    return '-'
  }

  const date = new Date(canceledAt)

  return new Intl.DateTimeFormat(
    'ko-KR',
    {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    },
  ).format(date)
}

interface CancelDetailCardProps {
  totalPrice: number
  canceledAt?: string | null
}

const CancelDetailCard = ({
  totalPrice,
  canceledAt,
}: CancelDetailCardProps) => {
  const formattedTotalPrice =
    totalPrice.toLocaleString('ko-KR')

  return (
    <section className="flex w-full flex-col items-start px-5 py-[10px]">
      <div className="flex w-full flex-col items-start justify-center gap-5 rounded-[8px] border border-gray-10 bg-white p-5">
        <div className="flex w-full flex-col items-start gap-[10px]">
          <h2 className="font-b5 text-black">
            예약내역
          </h2>

          <div className="flex w-full items-start border-b border-gray-10 px-[5px] py-2">
            <div className="flex flex-1 items-center gap-[10px]">
              <p className="font-b8 text-gray-60">
                취소 사유
              </p>
            </div>

            <p className="font-b8 text-black">
              고객 요청
            </p>
          </div>

          <div className="flex w-full items-start px-[5px] py-2">
            <div className="flex flex-1 items-center gap-[10px]">
              <p className="font-b8 text-gray-60">
                취소 일시
              </p>
            </div>

            <p className="font-b8 text-black">
              {formatCanceledAt(
                canceledAt,
              )}
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col items-start">
          <div className="flex w-full items-start pb-1">
            <div className="flex flex-1 items-center gap-[10px]">
              <p className="font-b5 text-black">
                결제 금액
              </p>
            </div>

            <p className="font-b5 text-gray-80">
              ₩{formattedTotalPrice}
            </p>
          </div>

          <p className="font-b10 text-gray-40">
            환불 금액은 사진관 정책에 따라
            산정됩니다.
          </p>
        </div>
      </div>
    </section>
  )
}

interface ChecklistCardProps {
  items: ChecklistItem[]
  onToggleItem: (id: string) => void
}

const ChecklistCard = ({
  items,
  onToggleItem,
}: ChecklistCardProps) => {
  return (
    <section className="flex w-full flex-col items-start gap-5 px-5 py-[10px]">
      <div className="flex w-full flex-col items-start justify-center gap-5 rounded-[8px] border border-gray-10 bg-white p-5">
        <div className="flex items-center justify-center gap-[5px]">
          <IcCheck
            width={16}
            height={16}
            className="text-black"
          />

          <h2 className="font-b5 text-black">
            촬영 전 체크리스트
          </h2>
        </div>

        <div className="flex w-full flex-col items-start">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className="flex w-full items-center gap-[10px] py-[10px] text-left"
              onClick={() =>
                onToggleItem(item.id)
              }
            >
              {item.checked ? (
                <IcCheckBoxFill
                  width={20}
                  height={20}
                  className="text-brand-100"
                />
              ) : (
                <IcCheckBox
                  width={20}
                  height={20}
                  className="text-gray-20"
                />
              )}

              <span
                className={`font-b8 ${
                  item.checked
                    ? 'text-gray-80'
                    : 'text-gray-40'
                }`}
              >
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

const ReservationDetailPage = () => {
  const navigate = useNavigate()

  const { reservationId } = useParams<{
    reservationId: string
  }>()

  const [
    reservation,
    setReservation,
  ] = useState<ReservationDetailData | null>(
    null,
  )

  const [
    checklistItems,
    setChecklistItems,
  ] = useState<ChecklistItem[]>([])

  useEffect(() => {
    if (!reservationId) {
      navigate('/mypage', {
        replace: true,
      })

      return
    }

    const fetchReservationDetail =
      async () => {
        try {
          const result =
            await getReservationDetail(
              reservationId,
            )

          setReservation(result)

          // 촬영완료(COMPLETED)나 취소(CANCELLED)로 넘어간 예약은 체크리스트가
          // 더 이상 필요 없으므로 저장해둔 체크 상태를 지운다.
          if (result.status !== 'RESERVED') {
            clearStoredChecklist(reservationId)
          }

          const storedCheckedIds =
            result.status === 'RESERVED'
              ? getStoredCheckedIds(reservationId)
              : new Set<string>()

          setChecklistItems(
            (result.checklist ?? []).map(
              (label, index) => {
                const id = `checklist-${index}`

                return {
                  id,
                  label,
                  checked: storedCheckedIds.has(id),
                }
              },
            ),
          )
        } catch (error) {
          console.error(
            '예약 상세 조회에 실패했습니다.',
            error,
          )

          navigate('/mypage', {
            replace: true,
            state: {
              toastMessage:
                '예약 정보를 불러오지 못했습니다.',
            },
          })
        }
      }

    void fetchReservationDetail()
  }, [navigate, reservationId])

  const handleChecklistItemClick = (
    id: string,
  ) => {
    setChecklistItems((prev) => {
      const next = prev.map((item) =>
        item.id === id
          ? {
              ...item,
              checked: !item.checked,
            }
          : item,
      )

      // 체크할 때마다 localStorage에도 같이 저장해서, 화면을 나갔다가
      // 다시 들어와도 체크 상태가 복원되게 한다.
      if (reservationId) {
        saveCheckedIds(
          reservationId,
          next
            .filter((item) => item.checked)
            .map((item) => item.id),
        )
      }

      return next
    })
  }

  if (!reservation) {
    return (
      <div className="relative mx-auto flex min-h-dvh w-full max-w-[402px] flex-col overflow-x-hidden bg-white">
        <NavigationBar
          title="예약 상세"
          showRight={false}
          onBack={() => navigate(-1)}
        />
      </div>
    )
  }

  const isReserved =
    reservation.status === 'RESERVED'

  const isShooting =
    reservation.status === 'COMPLETED'

  const isCanceled =
    reservation.status === 'CANCELLED'

  // 예약 완료(RESERVED) 상태엔 하단 액션이 없어서, 바를 그릴지 말지와
  // 본문 하단 여백을 함께 이 값으로 판단한다 (빈 흰 바가 남지 않도록)
  const hasBottomAction =
    isShooting || isCanceled

  const statusLabel = isReserved
    ? '예약 완료'
    : isShooting
      ? '촬영 완료'
      : '취소'

  const formattedReservationDate =
    formatReservationDateTimeLong(
      reservation.timeSlot.date,
      reservation.timeSlot.startTime,
    )

  const formattedTotalPrice =
    reservation.totalPrice.toLocaleString(
      'ko-KR',
    )

  return (
    <div
      className={`relative mx-auto flex min-h-dvh w-full max-w-[402px] flex-col overflow-x-hidden bg-white ${
        hasBottomAction ? 'pb-[120px]' : ''
      }`}
    >
      <NavigationBar
        title="예약 상세"
        showRight={false}
        onBack={() => navigate(-1)}
      />

      <Profile
        variant="bookingInfo"
        studioName={reservation.studio.name}
        reservationDate={
          formattedReservationDate
        }
        statusLabel={statusLabel}
      />

      <div className="flex w-full flex-col items-start py-[10px]">
        <ReservationDetail
          receiptItems={[
            {
              label: '컨셉',
              value:
                reservation.studioProduct
                  .name,
            },
          ]}
          totalAmount={`₩${formattedTotalPrice}`}
        />

        {isReserved && (
          <ChecklistCard
            items={checklistItems}
            onToggleItem={
              handleChecklistItemClick
            }
          />
        )}

        {isCanceled && (
          <CancelDetailCard
            totalPrice={
              reservation.totalPrice
            }
            canceledAt={
              reservation.canceledAt
            }
          />
        )}
      </div>

      {hasBottomAction && (
        <div className="fixed bottom-0 left-1/2 w-full max-w-[402px] -translate-x-1/2 bg-white px-5 pb-10">
          {isShooting && (
            <Button
              variant="primary"
              onClick={() => {
                if (
                  reservation.reviewId !==
                  null
                ) {
                  navigate(
                    `/mypage/reviews/${reservation.reviewId}`,
                  )
                  return
                }

                navigate(
                  `/mypage/reservations/${reservationId}/review`,
                )
              }}
            >
              {reservation.reviewId !== null
                ? '내 리뷰 보기'
                : '리뷰 작성'}
            </Button>
          )}

          {isCanceled && (
            <Button
              variant="primary"
              onClick={() =>
                navigate(
                  `/studios/${reservation.studio.id}/concepts`,
                  {
                    state: {
                      openTimeSelectModal: true,
                    },
                  },
                )
              }
            >
              재예약
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default ReservationDetailPage
