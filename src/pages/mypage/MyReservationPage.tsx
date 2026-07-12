/**
 * Figma F-1 예약관리 (라우트: /mypage)
 * 예약 상태 필터(전체/예약완료/촬영완료/취소)와 예약 내역 카드 목록을 표시함
 * 필터는 query string으로 분기하고, 카드 버튼은 예약 상세/취소/리뷰 작성/재예약 화면으로 이동함
 */
import { useNavigate, useSearchParams } from 'react-router'

import cardImage5 from '@/assets/images/CardImage5.png'
import cardImage6 from '@/assets/images/CardImage6.png'
import logoIcon from '@/assets/images/logo-icon.png'
import logoText from '@/assets/images/logo-text.svg'
import CardReservationHistory from '@/components/cards/CardReservationHistory'
import FilterBar1 from '@/components/common/FilterBar1'
import Profile from '@/components/common/Profile'
import SegmentedTab from '@/components/common/SegmentedTab'
import TabBarUser from '@/components/layout/TabBarUser'

type FilterType = 'all' | 'reservation' | 'shooting' | 'canceled'

const filterItems = [
  { value: 'all', label: '전체', count: 3 },
  { value: 'reservation', label: '예약완료', count: 1 },
  { value: 'shooting', label: '촬영완료', count: 1 },
  { value: 'canceled', label: '취소', count: 1 },
] as const

const MyReservationPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const currentFilter = (searchParams.get('filter') as FilterType) || 'all'

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

  const showReservationCard = currentFilter === 'all' || currentFilter === 'reservation'
  const showShootingCard = currentFilter === 'all' || currentFilter === 'shooting'
  const showCanceledCard = currentFilter === 'all' || currentFilter === 'canceled'

  return (
    <main className="relative mx-auto min-h-screen w-full max-w-[402px] bg-white pb-[108px]">
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

      <section className="px-5 pt-[10px]">
        <div className="flex flex-col gap-5">
          {showReservationCard && (
            <CardReservationHistory
              statusTag="예약 완료"
              studioName="스튜디오 아롬"
              dateTime="2026년 3월 15일 (토) 14:00"
              packageName="증명사진"
              onLeftButtonClick={() => navigate('/mypage/reservations/1/cancel')}
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
      </section>

      <div className="fixed bottom-0 left-1/2 w-full max-w-[402px] -translate-x-1/2">
        <TabBarUser activeTab="mypage" />
      </div>
    </main>
  )
}

export default MyReservationPage