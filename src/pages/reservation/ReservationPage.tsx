import type { ReactNode } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router'

import Agreement from '@/components/common/Agreement'
import Button from '@/components/common/Button'
import MiniTitle from '@/components/common/MiniTitle'
import HomeBar from '@/components/layout/HomeBar'
import NavigationBar from '@/components/layout/NavigationBar'
import StatusBar from '@/components/layout/StatusBar'

interface InfoFieldProps {
  label: string
  value: string
}

interface SectionProps {
  children: ReactNode
  className?: string
}

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

const ReservationPage = () => {
  const navigate = useNavigate()

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')
  const [agreement, setAgreement] = useState(INITIAL_AGREEMENT)

  const isAllAgreed = AGREEMENT_ITEMS.every(({ key }) => agreement[key])
  const canPay = Boolean(selectedPaymentMethod) && isAllAgreed

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

  const handlePayment = () => {
    if (!canPay) {
      return
    }

    navigate('/reservation/complete')
  }

  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-[402px] flex-col overflow-x-hidden bg-white text-black">
      <div className="sticky top-0 z-20 bg-white">
        <StatusBar />

        <NavigationBar
          title="예약"
          showRight={false}
          onBack={() => navigate(-1)}
        />
      </div>

      <main className="flex flex-1 flex-col gap-[10px]">
        <Section className="px-5 pb-3">
          <div className="pb-2 pt-5">
            <h1 className="text-[22px] font-bold leading-none text-black">
              데이지 스튜디오
            </h1>
          </div>

          <p className="font-b8 pb-0.5 text-gray-80">개인 화보</p>

          <p className="font-cap3 pb-2 text-gray-40">
            자연광 스튜디오 / 의상 무료대여 / 보정본 2매 포함 / 촬영 약
            40분
          </p>

          <div className="flex h-[57px] w-full flex-col gap-1 rounded-lg bg-[rgba(254,228,235,0.3)] px-3 py-2">
            <p className="font-cap3 text-gray-80">촬영 일시</p>
            <p className="font-b7 text-black">
              2025.06.14 (일) 오전 11:00
            </p>
          </div>
        </Section>

        <Section className="px-5 py-[10px]">
          <div className="flex flex-col gap-2 py-[10px]">
            <h2 className="font-h6 text-black">예약자 정보</h2>

            <p className="font-cap3 text-gray-40">
              예약자 정보는 사진관에 전달돼 예약 확인에 사용돼요.
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <InfoField label="이름" value="이수현" />
            <InfoField label="연락처" value="010-1234-5678" />
          </div>
        </Section>

        <Section className="flex flex-col gap-2 px-5 py-[10px]">
          <h2 className="font-h6 text-black">결제 정보</h2>

          <div className="font-b8 flex items-center justify-between text-gray-80">
            <p>촬영 컨셉 (개인화보)</p>
            <p className="font-b9">₩70,000</p>
          </div>
        </Section>

        <Section className="font-h6 flex items-center justify-between p-5">
          <p>총 결제 금액</p>
          <p className="text-brand-100">₩70,000</p>
        </Section>

        <Section className="flex flex-col px-5 pb-[10px]">
          <MiniTitle
            title="결제 수단"
            className="-mx-5 flex w-[402px] items-start p-5"
          />

          <div className="grid grid-cols-2 gap-x-[14px] gap-y-3">
            {PAYMENT_METHODS.map((paymentMethod) => {
              const isSelected = selectedPaymentMethod === paymentMethod

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
                  onClick={() => setSelectedPaymentMethod(paymentMethod)}
                >
                  {paymentMethod}
                </button>
              )
            })}
          </div>
        </Section>

        <Section className="px-5 py-[10px]">
          <div className="flex w-full flex-col gap-1 rounded-lg bg-gray-10 px-3 py-2">
            <p className="font-b7 text-black">현장 결제 안내</p>

            <p className="font-cap3 text-gray-80">
              당일 컨셉 추가 시, 추가 요금은 사진관에서 현장 결제로
              진행해요.
            </p>
          </div>
        </Section>

        <Section className="px-5 py-[10px]">
          <Agreement
            items={AGREEMENT_ITEMS}
            checked={agreement}
            onToggleAll={handleToggleAll}
            onToggleItem={handleToggleAgreement}
            onItemDetailClick={(key) => navigate(`/terms/${key}`)}
            className="w-full"
          />
        </Section>

        <div className="bg-white p-5">
          <Button
            variant={canPay ? 'primary' : 'disabled'}
            onClick={canPay ? handlePayment : undefined}
          >
            150,000원 결제하기
          </Button>
        </div>
      </main>

      <HomeBar />
    </div>
  )
}

const Section = ({ children, className = '' }: SectionProps) => (
  <section
    className={`w-full bg-[rgba(252,252,252,0.75)] shadow-[0px_15px_40px_0px_rgba(206,206,206,0.08)] backdrop-blur-[10px] ${className}`}
  >
    {children}
  </section>
)

const InfoField = ({ label, value }: InfoFieldProps) => (
  <label className="flex flex-col gap-[5px]">
    <span className="font-cap3 text-gray-80">{label}</span>

    <span className="font-b7 flex w-full items-center rounded-lg bg-[rgba(254,228,235,0.3)] px-3 py-[10px] text-gray-80">
      {value}
    </span>
  </label>
)

export default ReservationPage