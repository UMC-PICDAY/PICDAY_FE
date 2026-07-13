/**
 * ReservationPage 사용법
 *
 * 예약 정보 확인과 결제를 진행하는 페이지
 *
 * 주요 기능
 *   - 예약자 이름과 연락처 수정
 *   - 결제 수단 선택
 *   - 필수 약관 전체 또는 개별 동의
 *   - 약관 상세 페이지 이동
 *   - 결제 성공 시 예약 완료 페이지 이동
 *
 * 결제 버튼 활성화 조건
 *   - 결제 수단 선택
 *   - 모든 필수 약관 동의
 *   - 예약자 이름과 연락처 입력
 *
 * 예외 처리
 *   - 뒤로가기: 결제 중단 확인 Alert
 *   - 슬롯 충돌: 다른 시간 선택 안내
 *   - 결제 실패: 다시 시도 안내
 *   - 예약 처리 실패: 현재 페이지에서 재진행
 *
 * 개발 환경에서는 하단 테스트 버튼으로 각 모달 확인 가능
 *
 * TODO
 *   - RESERVATION_MOCK을 실제 API 데이터로 교체
 *   - 결제 결과별 성공 및 오류 분기 연결
 *   - 슬롯 충돌 후 C-7 시간 선택 모달 연결
 *   - 개발용 테스트 버튼 제거
 */

import type { ChangeEvent, ReactNode } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router'

import Agreement from '@/components/common/Agreement'
import Alert from '@/components/common/Alert'
import Alert3 from '@/components/common/Alert3'
import Button from '@/components/common/Button'
import MiniTitle from '@/components/common/MiniTitle'
import HomeBar from '@/components/layout/HomeBar'
import NavigationBar from '@/components/layout/NavigationBar'
import StatusBar from '@/components/layout/StatusBar'

interface InfoFieldProps {
  label: string
  value: string
  type?: 'text' | 'tel'
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}

interface SectionProps {
  children: ReactNode
  className?: string
}

interface DevModalButtonProps {
  children: ReactNode
  onClick: () => void
}

type ModalType =
  | 'exit'
  | 'reservationConflict'
  | 'paymentFailed'
  | 'reservationFailed'
  | null

const PAYMENT_METHODS = [
  '신용/체크 카드',
  '토스페이',
  '카카오페이',
  '간편 계좌이체',
  '네이버페이',
]

const AGREEMENT_ITEMS = [
  {
    key: 'reservationRule',
    label: '촬영 이용규칙 및 취소/환불 규정 동의 (필수)',
  },
  {
    key: 'privacy',
    label: '개인정보 수집 및 이용 동의 (필수)',
  },
  {
    key: 'privacyThirdParty',
    label: '개인정보 제3자 제공 동의 (필수)',
  },
  {
    key: 'paymentTerms',
    label: '결제대행 서비스 약관 동의 (필수)',
  },
]

const INITIAL_AGREEMENT = AGREEMENT_ITEMS.reduce<Record<string, boolean>>(
  (agreement, item) => ({
    ...agreement,
    [item.key]: false,
  }),
  {},
)

// TODO: API 연동 후 실제 예약 데이터로 교체
const RESERVATION_MOCK = {
  studioName: '데이지 스튜디오',
  conceptName: '개인 화보',
  includedItems: [
    '자연광 스튜디오',
    '의상 무료대여',
    '보정본 2매 포함',
    '촬영 약 40분',
  ],
  reservationDateTime: '2025.06.14 (일) 오전 11:00',
  reserverName: '이수현',
  reserverPhone: '010-1234-5678',
  price: 70000,
}

const ReservationPage = () => {
  const navigate = useNavigate()

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    PAYMENT_METHODS[0],
  )
  const [agreement, setAgreement] = useState(INITIAL_AGREEMENT)
  const [reserverName, setReserverName] = useState(
    RESERVATION_MOCK.reserverName,
  )
  const [reserverPhone, setReserverPhone] = useState(
    RESERVATION_MOCK.reserverPhone,
  )
  const [modalType, setModalType] = useState<ModalType>(null)

  const formattedTotalPrice =
    RESERVATION_MOCK.price.toLocaleString('ko-KR')

  const includedItemsText = RESERVATION_MOCK.includedItems.join(' / ')

  const isAllAgreed = AGREEMENT_ITEMS.every(
    ({ key }) => agreement[key],
  )

  const hasReserverInfo =
    reserverName.trim().length > 0 &&
    reserverPhone.trim().length > 0

  const canPay =
    Boolean(selectedPaymentMethod) &&
    isAllAgreed &&
    hasReserverInfo

  const handleToggleAll = () => {
    const nextChecked = !isAllAgreed

    setAgreement(
      AGREEMENT_ITEMS.reduce<Record<string, boolean>>(
        (nextAgreement, item) => ({
          ...nextAgreement,
          [item.key]: nextChecked,
        }),
        {},
      ),
    )
  }

  const handleToggleAgreement = (key: string) => {
    setAgreement((prevAgreement) => ({
      ...prevAgreement,
      [key]: !prevAgreement[key],
    }))
  }

  const handleBack = () => {
    setModalType('exit')
  }

  const handleExit = () => {
    setModalType(null)

    // C-7로 연결됨(이전 화면)
    navigate(-1)
  }

  const handleContinuePayment = () => {
    setModalType(null)
  }

  const handleRetryPayment = () => {
    setModalType(null)

    // TODO: API 연결 후 결제 재시도 로직 연결
  }

  const handleRetryReservation = () => {
    // 예약 확정 처리 오류 발생 시 E-1에 머물러 다시 진행
    setModalType(null)
  }

  const handleSelectAnotherTime = () => {
    setModalType(null)

    // TODO: 실제 studioId 연결 및 C-7 이동 후 시간 선택 모달 자동 오픈 처리
    // navigate(`/studios/${studioId}/concepts`, {
    //   state: {
    //     openTimeSelectModal: true,
    //   },
    // })
  }

  const handlePayment = () => {
    if (!canPay) {
      return
    }

    /**
     * TODO: API 연동 후 결제 결과에 따라 처리
     *
     * 성공:
     * 예약 완료 데이터를 API 응답으로 받은 뒤 완료 페이지로 전달
     *
     * 슬롯 충돌:
     * setModalType('reservationConflict')
     *
     * 결제 실패:
     * setModalType('paymentFailed')
     *
     * 예약 확정 처리 실패:
     * setModalType('reservationFailed')
     */
    navigate('/reservation/complete', {
      state: {
        reservation: {
          studioName: RESERVATION_MOCK.studioName,
          reservationDateTime:
            RESERVATION_MOCK.reservationDateTime,
          conceptName: RESERVATION_MOCK.conceptName,
          totalAmount: RESERVATION_MOCK.price,
        },
      },
    })
  }

  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-[402px] flex-col overflow-x-hidden bg-white text-black">
      <div className="sticky top-0 z-20 bg-white">
        <StatusBar />

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
              {RESERVATION_MOCK.studioName}
            </h1>
          </div>

          <p className="font-b8 pb-0.5 text-gray-80">
            {RESERVATION_MOCK.conceptName}
          </p>

          <p className="font-cap3 pb-2 text-gray-40">
            {includedItemsText}
          </p>

          <div className="flex h-[57px] w-full flex-col gap-1 rounded-lg bg-[rgba(254,228,235,0.3)] px-3 py-2">
            <p className="font-cap3 text-gray-80">
              촬영 일시
            </p>

            <p className="font-b7 text-black">
              {RESERVATION_MOCK.reservationDateTime}
            </p>
          </div>
        </Section>

        <Section className="px-5 py-[10px]">
          <div className="flex flex-col gap-2 py-[10px]">
            <h2 className="font-h6 text-black">
              예약자 정보
            </h2>

            <p className="font-cap3 text-gray-40">
              예약자 정보는 사진관에 전달돼 예약 확인에
              사용돼요.
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <InfoField
              label="이름"
              value={reserverName}
              onChange={(event) =>
                setReserverName(event.target.value)
              }
            />

            <InfoField
              label="연락처"
              type="tel"
              value={reserverPhone}
              onChange={(event) =>
                setReserverPhone(event.target.value)
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
              촬영 컨셉 ({RESERVATION_MOCK.conceptName})
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
            title="결제 수단"
            className="-mx-5 flex w-[402px] items-start p-5"
          />

          <div className="grid grid-cols-2 gap-x-[14px] gap-y-3">
            {PAYMENT_METHODS.map((paymentMethod) => {
              const isSelected =
                selectedPaymentMethod === paymentMethod

              return (
                <button
                  key={paymentMethod}
                  type="button"
                  aria-pressed={isSelected}
                  className={`flex h-12 items-center justify-center rounded-lg px-5 py-3 ${
                    isSelected
                      ? 'font-b5 bg-brand-100 text-white'
                      : 'font-b6 border-[1.5px] border-gray-10 bg-white text-gray-40'
                  }`}
                  onClick={() =>
                    setSelectedPaymentMethod(paymentMethod)
                  }
                >
                  {paymentMethod}
                </button>
              )
            })}
          </div>
        </Section>

        <Section className="px-5 py-[10px]">
          <div className="flex w-full flex-col gap-1 rounded-lg bg-gray-10 px-3 py-2">
            <p className="font-b7 text-black">
              현장 결제 안내
            </p>

            <p className="font-cap3 text-gray-80">
              당일 컨셉 추가 시, 추가 요금은 사진관에서
              현장 결제로 진행해요.
            </p>
          </div>
        </Section>

        <Section className="px-5 py-[10px]">
          <Agreement
            items={AGREEMENT_ITEMS}
            checked={agreement}
            onToggleAll={handleToggleAll}
            onToggleItem={handleToggleAgreement}
            onItemDetailClick={(key) =>
              navigate(`/reservation/terms/${key}`)
            }
            className="w-full"
          />
        </Section>

        <div className="bg-white p-5">
          <Button
            variant={canPay ? 'primary' : 'disabled'}
            onClick={canPay ? handlePayment : undefined}
          >
            {formattedTotalPrice}원 결제하기
          </Button>
        </div>
      </main>

      <HomeBar />

      {import.meta.env.DEV && (
        // TODO: UI 확인 후 제거
        <div className="fixed bottom-12 left-1/2 z-40 grid w-[calc(100%-40px)] max-w-[362px] -translate-x-1/2 grid-cols-2 gap-1 rounded-lg bg-white/90 p-2 shadow-[0px_8px_24px_0px_rgba(0,0,0,0.12)] backdrop-blur-[10px]">
          <DevModalButton
            onClick={() => setModalType('exit')}
          >
            이탈 방지
          </DevModalButton>

          <DevModalButton
            onClick={() =>
              setModalType('reservationConflict')
            }
          >
            예약 충돌
          </DevModalButton>

          <DevModalButton
            onClick={() => setModalType('paymentFailed')}
          >
            결제 실패
          </DevModalButton>

          <DevModalButton
            onClick={() =>
              setModalType('reservationFailed')
            }
          >
            예약 처리 오류
          </DevModalButton>
        </div>
      )}

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
              onConfirm={handleContinuePayment}
            />
          )}

          {modalType === 'reservationConflict' && (
            <Alert3
              title="이미 예약된 시간대예요"
              description={
                <>
                  선택하신 시간대는 방금 마감됐어요
                  <br />
                  다른 시간을 확인해 주세요
                </>
              }
              buttonText="다른 시간 선택하기"
              helperText="선택하신 컨셉 목록으로 돌아갑니다"
              onClick={handleSelectAnotherTime}
            />
          )}

          {modalType === 'paymentFailed' && (
            <Alert
              variant="variant3"
              title="결제에 실패했어요"
              description="잠시 후 다시 시도해 주세요"
              confirmText="다시 시도하기"
              onConfirm={handleRetryPayment}
            />
          )}

          {modalType === 'reservationFailed' && (
            <Alert
              variant="variant3"
              title="예약 처리 중 오류가 발생했어요"
              description="다시 예약을 진행해 주세요"
              confirmText="다시 예약하기"
              onConfirm={handleRetryReservation}
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
  value,
  type = 'text',
  onChange,
}: InfoFieldProps) => (
  <label className="flex flex-col gap-[5px]">
    <span className="font-cap3 text-gray-80">
      {label}
    </span>

    <input
      type={type}
      value={value}
      onChange={onChange}
      autoComplete={type === 'tel' ? 'tel' : 'name'}
      className="font-b7 w-full rounded-lg bg-[rgba(254,228,235,0.3)] px-3 py-[10px] text-gray-80 outline-none placeholder:text-gray-40 focus:ring-1 focus:ring-brand-100"
    />
  </label>
)

const DevModalButton = ({
  children,
  onClick,
}: DevModalButtonProps) => (
  <button
    type="button"
    className="font-cap3 rounded-md border border-gray-10 bg-white px-2 py-1.5 text-gray-80"
    onClick={onClick}
  >
    {children}
  </button>
)

export default ReservationPage