/**
 * Figma F-1 예약관리 (라우트: /mypage)
 *
 * 예약 상태 필터(전체/예약완료/촬영완료/취소)와 예약 내역 카드 목록을 표시함
 * 예약 내역이 없는 경우 empty 상태 화면을 표시함
 *
 */

import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'

import cardImage5 from '@/assets/images/CardImage5.png'
import cardImage6 from '@/assets/images/CardImage6.png'
import logoIcon from '@/assets/images/logo-icon.png'
import logoText from '@/assets/images/logo-text.svg'
import CardReservationHistory from '@/components/cards/CardReservationHistory'
import Alert3 from '@/components/common/Alert3'
import FilterBar1 from '@/components/common/FilterBar1'
import Profile from '@/components/common/Profile'
import SegmentedTab from '@/components/common/SegmentedTab'
import TabBarUser from '@/components/layout/TabBarUser'
import { IcEvent2 } from '@/components/icons'

type FilterType = 'all' | 'reservation' | 'shooting' | 'canceled'
type ReservationViewMode = 'empty' | 'list'

/**
 * 화면 상태 확인용 mock 값
 *
 * 'list'  → 예약 카드 목록 표시
 * 'empty' → 예약 내역 없음 화면 표시
 *
 * TODO: API 연결 후 예약 목록 길이에 따라 empty/list 분기 처리 예정
 */
const MOCK_RESERVATION_VIEW_MODE = 'list' as ReservationViewMode

const filterItems = [
  { value: 'all', label: '전체', count: 3 },
  { value: 'reservation', label: '예약완료', count: 1 },
  { value: 'shooting', label: '촬영완료', count: 1 },
  { value: 'canceled', label: '취소', count: 1 },
] as const

const MyReservationPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [isSameDayCancelModalOpen, setIsSameDayCancelModalOpen] = useState(false)

  const currentFilter = (searchParams.get('filter') as FilterType) || 'all'
const isReservationEmpty = MOCK_RESERVATION_VIEW_MODE === 'empty'

  const showReservationCard =
    !isReservationEmpty && (currentFilter === 'all' || currentFilter === 'reservation')
  const showShootingCard =
    !isReservationEmpty && (currentFilter === 'all' || currentFilter === 'shooting')
  const showCanceledCard =
    !isReservationEmpty && (currentFilter === 'all' || currentFilter === 'canceled')

  const handleTabChange = (value: string) => {
    if (value === 'profile') {
      navigate('/mypage/profile')
      return
    }

    navigate('/mypage')
  }

  const handleFilterChange = (value: string) => {
    if (value === 'all') {
      navigate('/mypage')
      return
    }

    navigate(`/mypage?filter=${value}`)
  }

  return (
    <main className="relative mx-auto flex min-h-dvh w-full max-w-[402px] flex-col bg-white">
      <header className="flex w-full items-center justify-between px-5 py-3">
        <img src={logoText} alt="PICDAY" className="h-5 w-[83px]" />
      </header>

      <Profile
        variant="userInfo"
        userName="이수현"
        accountText="카카오 계정 연결"
        userImageSrc={logoIcon}
      />

      <SegmentedTab
        items={[
          { value: 'reservation', label: '예약관리' },
          { value: 'profile', label: '프로필 설정' },
        ]}
        value="reservation"
        onChange={handleTabChange}
      />

      <FilterBar1 items={filterItems} value={currentFilter} onChange={handleFilterChange} />

      <section className="flex flex-1 flex-col px-5 pb-5 pt-[10px]">
        {isReservationEmpty ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-5 p-[10px]">
              <div className="flex h-[64px] w-[64px] items-center justify-center rounded-full bg-brand-20">
                <IcEvent2 width={36} height={36} className="text-brand-40" />
              </div>

              <div className="flex flex-col items-center gap-5">
                <p className="font-b5 text-black">아직 예약 내역이 없어요</p>

                <button
                  type="button"
                  className="rounded-[8px] border border-brand-20 px-5 py-[10px] font-b8 text-brand-100"
                  onClick={() => navigate('/search')}
                >
                  사진관 찾아보기
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-5">
            {showReservationCard && (
              <CardReservationHistory
                statusTag="예약 완료"
                studioName="스튜디오 아롬"
                dateTime="2026년 3월 15일 (토) 14:00"
                packageName="증명사진"
                onLeftButtonClick={() => setIsSameDayCancelModalOpen(true)}
                onRightButtonClick={() => navigate('/mypage/reservations/1')}
              />
            )}

            {showShootingCard && (
              <CardReservationHistory
                imageSrc={cardImage5}
                secondImageSrc={cardImage6}
                statusTag="촬영 완료"
                studioName="포토그래피 by J"
                dateTime="2026년 4월 20일 (월) 11:00"
                packageName="개인화보"
                onLeftButtonClick={() => navigate('/mypage/reservations/2')}
                onRightButtonClick={() => navigate('/mypage/reservations/2/review')}
              />
            )}

            {showCanceledCard && (
              <CardReservationHistory
                imageSrc={cardImage5}
                secondImageSrc={cardImage6}
                statusTag="취소"
                studioName="타임온미"
                dateTime="2026년 5월 10일 (일) 13:00"
                packageName="프로필"
                onLeftButtonClick={() => navigate('/mypage/reservations/3')}
                onRightButtonClick={() => navigate('/reservation')}
              />
            )}
          </div>
        )}
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

      {isSameDayCancelModalOpen && (
        <div className="fixed left-1/2 top-0 z-50 flex h-dvh w-full max-w-[402px] -translate-x-1/2 items-center justify-center bg-[#464545]/90 px-5">
          <Alert3
            variant="default"
            title="촬영 당일은 취소가 불가합니다"
            description="사진관에 직접 문의해 주세요"
            buttonText="확인"
            helperText="취소 가능 여부는 사진관 규정에 따라 다를 수 있어요"
            onClick={() => setIsSameDayCancelModalOpen(false)}
          />
        </div>
      )}
    </main>
  )
}

export default MyReservationPage