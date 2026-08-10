/**
 * ReservationPage 사용법
 *
 * 예약 정보 확인과 결제를 진행하는 페이지
 *
 * 주요 기능
 *   - 이전 페이지에서 전달된 예약 정보 표시
 *   - 예약자 이름과 연락처 수정
 *   - 결제 수단 선택
 *   - 필수 약관 전체 또는 개별 동의
 *   - 예약 생성 API 호출
 *   - 예약 성공 시 예약 완료 페이지 이동
 *
 * 예외 처리
 *   - 뒤로가기: 결제 중단 확인
 *   - 슬롯 충돌: 컨셉 목록으로 돌아가 시간 재선택
 *   - 예약 처리 실패: 현재 페이지에서 다시 시도
 */

import type {
  ChangeEvent,
  ReactNode,
} from 'react'
import { useEffect, useRef, useState } from 'react'
import {
  useLocation,
  useNavigate,
} from 'react-router'

import Agreement from '@/components/common/Agreement'
import Alert from '@/components/common/Alert'
import Alert3 from '@/components/common/Alert3'
import Button from '@/components/common/Button'
import MiniTitle from '@/components/common/MiniTitle'
import NavigationBar from '@/components/layout/NavigationBar'
import { getMe } from '@/services/auth'
import {
  createReservation,
  type PaymentMethod,
} from '@/services/reservation'
import { ApiError } from '@/types/common'

interface InfoFieldProps {
  label: string
  required: boolean
  value: string
  type?: 'text' | 'tel'
  errorMessage?: string
  onChange: (
    event: ChangeEvent<HTMLInputElement>,
  ) => void
}

interface SectionProps {
  children: ReactNode
  className?: string
}

interface PaymentMethodItem {
  label: string
  value: PaymentMethod
}

interface AgreementItem {
  id: number
  key: string
  label: string
}

interface ReservationPageData {
  studioId: number
  studioProductId: number
  timeSlotId: number
  studioName: string
  conceptName: string
  includedItems: string[]
  reservationDateTime: string
  reserverName: string
  reserverPhone: string
  price: number
}

interface ReservationDraft {
  selectedPaymentMethod: PaymentMethod
  agreement: Record<string, boolean>
  reserverName: string
  reserverPhone: string
}

interface ReservationPageLocationState {
  reservation?: ReservationPageData
  draft?: ReservationDraft
}

type ModalType =
  | 'exit'
  | 'reservationConflict'
  | 'reservationFailed'
  | null

const PAYMENT_METHODS: PaymentMethodItem[] = [
  {
    label: '신용/체크 카드',
    value: 'CARD',
  },
  {
    label: '토스페이',
    value: 'TOSSPAY',
  },
  {
    label: '카카오페이',
    value: 'KAKAOPAY',
  },
  {
    label: '간편 계좌이체',
    value: 'TRANSFER',
  },
  {
    label: '네이버페이',
    value: 'NAVERPAY',
  },
]

// 약관 ID 5~8은 예약 전용 네임스페이스(1~4는 회원가입 약관과 겹침 — 백엔드 확인 완료)
const AGREEMENT_ITEMS: AgreementItem[] = [
  {
    id: 5,
    key: 'reservationRule',
    label:
      '촬영 이용규칙 및 취소/환불 규정 동의 (필수)',
  },
  {
    id: 6,
    key: 'privacy',
    label: '개인정보 수집 및 이용 동의 (필수)',
  },
  {
    id: 7,
    key: 'privacyThirdParty',
    label: '개인정보 제3자 제공 동의 (필수)',
  },
  {
    id: 8,
    key: 'paymentTerms',
    label: '결제대행 서비스 약관 동의 (필수)',
  },
]

// 010/011/016/017/018/019로 시작하는 국내 휴대폰 번호 (하이픈 유무 무관)
const PHONE_REGEX = /^01[016789]\d{7,8}$/

const INITIAL_AGREEMENT =
  AGREEMENT_ITEMS.reduce<Record<string, boolean>>(
    (nextAgreement, item) => ({
      ...nextAgreement,
      [item.key]: false,
    }),
    {},
  )

// URL 직접 진입 시 개발 화면 확인을 위한 fallback
const RESERVATION_MOCK: ReservationPageData = {
  studioId: 1,
  studioProductId: 1,
  timeSlotId: 1,
  studioName: '데이지 스튜디오',
  conceptName: '체리베리벌쓰데이',
  includedItems: [
    '자연광 스튜디오',
    '의상 무료대여',
    '보정본 2매',
    '약 40분',
  ],
  reservationDateTime: '2026.06.18 14:00',
  reserverName: '',
  reserverPhone: '',
  price: 70000,
}

const ReservationPage = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const locationState =
    location.state as ReservationPageLocationState | null

  const reservation =
    locationState?.reservation ?? RESERVATION_MOCK

  const draft = locationState?.draft

  const [
    selectedPaymentMethod,
    setSelectedPaymentMethod,
  ] = useState<PaymentMethod>(
    draft?.selectedPaymentMethod ??
      PAYMENT_METHODS[0].value,
  )

  const [agreement, setAgreement] = useState(
    draft?.agreement ?? INITIAL_AGREEMENT,
  )

  const [reserverName, setReserverName] = useState(
    draft?.reserverName ?? reservation.reserverName,
  )

  const [reserverPhone, setReserverPhone] = useState(
    draft?.reserverPhone ?? reservation.reserverPhone,
  )

  const hasEditedNameRef = useRef(false)

  // 신규 예약(컨셉목록에서 바로 넘어온 경우)이라 이름이 비어있으면, 회원가입 때
  // 등록한 이름으로 채워준다. 이미 값이 있으면(재예약, 약관상세 다녀온 draft
  // 등) 덮어쓰지 않는다. 비로그인 등으로 실패해도 조용히 무시 — 이름을 직접
  // 입력하면 되니 예약 진행 자체는 막지 않는다.
  useEffect(() => {
    if (draft?.reserverName || reservation.reserverName) return

    getMe()
      .then((result) => {
        // 응답이 늦게 와도 사용자가 입력한 값을 덮어쓰지 않기 위함
        if (hasEditedNameRef.current) return

        setReserverName(result.user.name)
      })
      .catch(() => {})
  }, [draft?.reserverName, reservation.reserverName])

  const [modalType, setModalType] =
    useState<ModalType>(null)

  const [isSubmitting, setIsSubmitting] =
    useState(false)

  const formattedTotalPrice =
    reservation.price.toLocaleString('ko-KR')

  const includedItemsText =
    reservation.includedItems.join(' / ')

  const isAllAgreed = AGREEMENT_ITEMS.every(
    ({ key }) => agreement[key],
  )

  const agreedTermIds = AGREEMENT_ITEMS.filter(
    ({ key }) => agreement[key],
  ).map(({ id }) => id)

  const normalizedPhone = reserverPhone.replace(
    /\D/g,
    '',
  )

  const isPhoneValid = PHONE_REGEX.test(
    normalizedPhone,
  )

  const showPhoneError =
    reserverPhone.trim().length > 0 && !isPhoneValid

  const hasReserverInfo =
    reserverName.trim().length > 0 && isPhoneValid

  const canPay =
    Boolean(selectedPaymentMethod) &&
    isAllAgreed &&
    hasReserverInfo &&
    !isSubmitting

  const handleToggleAll = () => {
    const nextChecked = !isAllAgreed

    setAgreement(
      AGREEMENT_ITEMS.reduce<
        Record<string, boolean>
      >(
        (nextAgreement, item) => ({
          ...nextAgreement,
          [item.key]: nextChecked,
        }),
        {},
      ),
    )
  }

  const handleToggleAgreement = (
    key: string,
  ) => {
    setAgreement((prevAgreement) => ({
      ...prevAgreement,
      [key]: !prevAgreement[key],
    }))
  }

  const handleOpenAgreementDetail = (
  key: string,
  ) => {
    const currentState: ReservationPageLocationState = {
      ...locationState,
      reservation,
      draft: {
        selectedPaymentMethod,
        agreement,
        reserverName,
        reserverPhone,
      },
    }

    // 현재 예약 페이지의 history state에 입력값 저장
    navigate(location.pathname, {
      replace: true,
      state: currentState,
    })

    // 약관 상세 페이지로 이동
    navigate(`/reservation/terms/${key}`)
  }

  const handleBack = () => {
    setModalType('exit')
  }

  const handleExit = () => {
    setModalType(null)
    navigate(-1)
  }

  const handleContinuePayment = () => {
    setModalType(null)
  }

  const handleSelectAnotherTime = () => {
    setModalType(null)

    navigate(
      `/studios/${reservation.studioId}/concepts?toast=time`,
      {
        replace: true,
        state: {
          openTimeSelectModal: true,
          rebookingInfo: {
            reserverName,
            reserverPhone,
          },
        },
      },
    )
  }

  const handlePayment = async () => {
    if (!canPay) {
      return
    }

    setIsSubmitting(true)

    try {
      const result = await createReservation({
        studioId: reservation.studioId,
        studioProductId:
          reservation.studioProductId,
        timeSlotId: reservation.timeSlotId,
        reserveeName: reserverName.trim(),
        reserveePhone: normalizedPhone,
        paymentMethod: selectedPaymentMethod,
        agreedTermIds,
      })

      navigate(`/reservation/complete/${result.reservationId}`,
        {
        replace: true,
        },
      )
        
    } catch (error) {
      if (!(error instanceof ApiError)) {
        setModalType('reservationFailed')
        return
      }

      switch (error.code) {
        case 'RESERVATION_4091':
          setModalType('reservationConflict')
          break

        case 'RESERVATION_4001':
        case 'RESERVATION_4004':
        case 'RESERVATION_4005':
        case 'RESERVATION_4006':
        case 'RESERVATION_4007':
        case 'RESERVATION_4043':
        case 'RESERVATION_5001':
        default:
          setModalType('reservationFailed')
          break
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRetryReservation = () => {
    setModalType(null)
    void handlePayment()
  }

  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-[402px] flex-col overflow-x-hidden bg-white text-black">
      <div className="sticky top-0 z-20 bg-white">
        <NavigationBar
          title="예약"
          showRight={false}
          onBack={handleBack}
        />
      </div>

      <main className="flex flex-1 flex-col gap-[10px]">
        <Section className="px-5 pb-3">
          <div className="pb-2 pt-5">
            <h1 className="text-[22px] font-bold leading-none text-black">
              {reservation.studioName}
            </h1>
          </div>

          <p className="font-b8 pb-0.5 text-gray-80">
            {reservation.conceptName}
          </p>

          <p className="font-cap3 pb-2 text-gray-40">
            {includedItemsText}
          </p>

          <div className="flex h-[57px] w-full flex-col gap-1 rounded-lg bg-[rgba(254,228,235,0.3)] px-3 py-2">
            <p className="font-cap3 text-gray-80">
              촬영 일시
            </p>

            <p className="font-b7 text-black">
              {reservation.reservationDateTime}
            </p>
          </div>
        </Section>

        <Section className="px-5 py-[10px]">
          <div className="flex flex-col gap-2 py-[10px]">
            <h2 className="font-h6 text-black">
              예약자 정보
            </h2>

            <p className="font-cap3 text-gray-40">
              예약자 정보는 사진관에 전달돼 예약
              확인에 사용돼요.
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <InfoField
              label="이름"
              required
              value={reserverName}
              onChange={(event) => {
                hasEditedNameRef.current = true
                setReserverName(
                  event.target.value,
                )
              }}
            />

            <InfoField
              label="연락처"
              required
              type="tel"
              value={reserverPhone}
              errorMessage={
                showPhoneError
                  ? '올바른 휴대폰 번호를 입력해 주세요'
                  : undefined
              }
              onChange={(event) =>
                setReserverPhone(
                  event.target.value,
                )
              }
            />
          </div>
        </Section>

        <Section className="flex flex-col gap-2 px-5 py-[10px]">
          <h2 className="font-h6 text-black">
            결제 정보
          </h2>

          <div className="font-b8 flex items-center justify-between text-gray-80">
            <p>
              촬영 컨셉 (
              {reservation.conceptName})
            </p>

            <p className="font-b9">
              ₩{formattedTotalPrice}
            </p>
          </div>
        </Section>

        <Section className="font-h6 flex items-center justify-between p-5">
          <p>총 결제 금액</p>

          <p className="text-brand-100">
            ₩{formattedTotalPrice}
          </p>
        </Section>

        <Section className="flex flex-col px-5 pb-[10px]">
          <MiniTitle
            title={
              <>
                결제 수단
                <span className="ml-0.5 text-[#FF3B5B]">*</span>
              </>
            }
            className="-mx-5 flex w-[402px] items-start p-5"
          />

          <div className="grid grid-cols-2 gap-x-[14px] gap-y-3">
            {PAYMENT_METHODS.map(
              (paymentMethod) => {
                const isSelected =
                  selectedPaymentMethod ===
                  paymentMethod.value

                return (
                  <button
                    key={paymentMethod.value}
                    type="button"
                    aria-pressed={isSelected}
                    className={`flex h-12 items-center justify-center rounded-lg px-5 py-3 ${
                      isSelected
                        ? 'font-b5 bg-brand-100 text-white'
                        : 'font-b6 border-[1.5px] border-gray-10 bg-white text-gray-40'
                    }`}
                    onClick={() =>
                      setSelectedPaymentMethod(
                        paymentMethod.value,
                      )
                    }
                  >
                    {paymentMethod.label}
                  </button>
                )
              },
            )}
          </div>
        </Section>

        <Section className="px-5 py-[10px]">
          <div className="flex w-full flex-col gap-1 rounded-lg bg-gray-10 px-3 py-2">
            <p className="font-b7 text-black">
              현장 결제 안내
            </p>

            <p className="font-cap3 text-gray-80">
              당일 컨셉 추가 시, 추가 요금은
              사진관에서 현장 결제로 진행해요.
            </p>
          </div>
        </Section>

        <Section className="px-5 py-[10px]">
          <Agreement
            items={AGREEMENT_ITEMS}
            checked={agreement}
            onToggleAll={handleToggleAll}
            onToggleItem={
              handleToggleAgreement
            }
            onItemDetailClick={
              handleOpenAgreementDetail
            }
            required
            className="w-full"
          />
        </Section>

        <div className="bg-white p-5">
          <Button
            variant={
              canPay ? 'primary' : 'disabled'
            }
            onClick={
              canPay ? handlePayment : undefined
            }
          >
            {isSubmitting
              ? '예약 처리 중'
              : `${formattedTotalPrice}원 결제하기`}
          </Button>
        </div>
      </main>

      {modalType && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-80/90 px-5"
          role="dialog"
          aria-modal="true"
          aria-label="예약 결제 안내"
        >
          {modalType === 'exit' && (
            <Alert
              title="결제를 중단하시겠어요?"
              description="옵션 선택 페이지로 이동합니다"
              cancelText="나가기"
              confirmText="계속 결제하기"
              onCancel={handleExit}
              onConfirm={
                handleContinuePayment
              }
            />
          )}

          {modalType ===
            'reservationConflict' && (
            <Alert3
              title="이미 예약된 시간대예요"
              description={
                <>
                  선택하신 시간대는 방금
                  마감됐어요
                  <br />
                  다른 시간을 확인해 주세요
                </>
              }
              buttonText="다른 시간 선택하기"
              helperText="선택하신 컨셉 목록으로 돌아갑니다"
              onClick={
                handleSelectAnotherTime
              }
            />
          )}

          {modalType ===
            'reservationFailed' && (
            <Alert
              variant="variant3"
              title="예약 처리 중 오류가 발생했어요"
              description="다시 예약을 진행해 주세요"
              confirmText="다시 예약하기"
              onConfirm={
                handleRetryReservation
              }
            />
          )}
        </div>
      )}
    </div>
  )
}

const Section = ({
  children,
  className = '',
}: SectionProps) => (
  <section
    className={`w-full bg-[rgba(252,252,252,0.75)] shadow-[0px_15px_40px_0px_rgba(206,206,206,0.08)] backdrop-blur-[10px] ${className}`}
  >
    {children}
  </section>
)

const InfoField = ({
  label,
  required = false,
  value,
  type = 'text',
  errorMessage,
  onChange,
}: InfoFieldProps) => (
  <label className="flex flex-col gap-[5px]">
    <span className="font-cap3 text-gray-80">
      {label}
      {required && (
        <span className="ml-0.5 text-[#FF3B5B]">*</span>
      )}
    </span>

    <input
      type={type}
      value={value}
      onChange={onChange}
      autoComplete={
        type === 'tel' ? 'tel' : 'name'
      }
      className={`font-b7 w-full rounded-lg bg-[rgba(254,228,235,0.3)] px-3 py-[10px] text-gray-80 outline-none placeholder:text-gray-40 ${
        errorMessage
          ? 'ring-1 ring-[#FF3B5B]'
          : ''
      }`}
    />

    {errorMessage && (
      <p className="font-cap1 text-[#FF3B5B]">
        {errorMessage}
      </p>
    )}
  </label>
)

export default ReservationPage