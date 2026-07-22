import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import CardStudioDetail from '@/components/cards/CardStudioDetail'
import Toast from '@/components/common/Toast'
import { IcFavorite } from '@/components/icons'
import NavigationBar from '@/components/layout/NavigationBar'

import DateChangeSheet from '@/pages/studio/components/DateChangeSheet'
import { MOCK_STUDIO_SLOTS } from '@/pages/studio/mocks/studioSlots'
import type {
  StudioDateTimeSelection,
  StudioTimeSlot,
} from '@/pages/studio/types/dateTime'

import type { CalendarDate } from '@/components/common/Calendar'

import cardImage1 from '@/assets/images/CardImage1.png'
import cardImage2 from '@/assets/images/CardImage2.png'
import cardImage3 from '@/assets/images/CardImage3.png'
import cardImage4 from '@/assets/images/CardImage4.png'

interface ConceptCard {
  description: string
  imageSrc: string
}

interface ConceptGroup {
  title: string
  cards: ConceptCard[]
}

interface ReservationToast {
  id: number
  message: string
}

const GROUPS: ConceptGroup[] = [
  {
    title: '촬영 컨셉 1',
    cards: [
      { description: '기준 1인', imageSrc: cardImage1 },
      { description: '기준 2인', imageSrc: cardImage2 },
    ],
  },
  {
    title: '촬영 컨셉 2',
    cards: [
      { description: '기준 1인', imageSrc: cardImage3 },
      { description: '기준 2인', imageSrc: cardImage4 },
    ],
  },
  {
    title: '촬영 컨셉 3',
    cards: [
      { description: '기준 1인', imageSrc: cardImage2 },
      { description: '기준 2인', imageSrc: cardImage1 },
    ],
  },
]

const formatDate = ({ year, month, day }: CalendarDate) =>
  [year, month, day]
    .map((value, index) =>
      index === 0 ? String(value) : String(value).padStart(2, '0'),
    )
    .join('.')

const ConceptListPage = () => {
  const navigate = useNavigate()
  const { studioId } = useParams()
  const [dateSheetOpen, setDateSheetOpen] = useState(false)
  const [dateTimeSelection, setDateTimeSelection] =
    useState<StudioDateTimeSelection | null>(null)
  const [slots, setSlots] = useState<readonly StudioTimeSlot[]>([])
  const [reservationToast, setReservationToast] =
    useState<ReservationToast | null>(null)

  useEffect(() => {
    if (!reservationToast) return

    const timer = window.setTimeout(() => setReservationToast(null), 3000)
    return () => window.clearTimeout(timer)
  }, [reservationToast])

  const subtitleDate = dateTimeSelection
    ? formatDate(dateTimeSelection.date)
    : '날짜, 시간 선택'
  const subtitleTime = dateTimeSelection?.startTime ?? ''

  const loadMockSlots = (_date: CalendarDate) => {
    // API 연동 시 getStudioSlots(studioId, date) 호출 결과로 교체합니다.
    setSlots(MOCK_STUDIO_SLOTS)
  }

  const openDateSheet = () => {
    if (dateTimeSelection) loadMockSlots(dateTimeSelection.date)
    else setSlots([])

    setDateSheetOpen(true)
  }

  const showReservationToast = (message: string) => {
    setReservationToast({ id: Date.now(), message })
  }

  const handleReserve = () => {
    if (!dateTimeSelection?.date) {
      showReservationToast('날짜를 먼저 설정해 주세요')
      return
    }

    if (!dateTimeSelection.slotId || !dateTimeSelection.startTime) {
      showReservationToast('시간을 먼저 설정해 주세요')
      return
    }

    setReservationToast(null)
  }

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <NavigationBar
        variant="subtitle"
        title="데이지 스튜디오"
        date={subtitleDate}
        count={subtitleTime}
        rightNode={<IcFavorite width={24} height={24} />}
        onBack={() => navigate(-1)}
        onSubtitleClick={openDateSheet}
      />

      {reservationToast && (
        <div className="flex justify-center px-5 py-2">
          <Toast
            key={reservationToast.id}
            message={reservationToast.message}
            className="flex items-center justify-center whitespace-nowrap rounded-[100px] bg-brand-60 px-4 py-2 font-b10 text-white"
          />
        </div>
      )}

      <main className="flex flex-col px-5 pb-6">
        {GROUPS.map((group, groupIndex) => (
          <section key={group.title}>
            <h2 className="pb-3 pt-5 font-b3 text-black">{group.title}</h2>
            <div className="flex flex-col items-center gap-3">
              {group.cards.map((card, index) => (
                <CardStudioDetail
                  key={`${group.title}-${index}`}
                  description={card.description}
                  imageSrc={card.imageSrc}
                  onDetailClick={() =>
                    navigate(
                      `/studios/${studioId}/concepts/${groupIndex}-${index}`,
                    )
                  }
                  onReserveClick={handleReserve}
                />
              ))}
            </div>
          </section>
        ))}
      </main>

      {dateSheetOpen && (
        <DateChangeSheet
          initialSelection={dateTimeSelection}
          slots={slots}
          onDateChange={loadMockSlots}
          onClose={() => setDateSheetOpen(false)}
          onApply={(selection) => {
            setDateTimeSelection(selection)
            setDateSheetOpen(false)
          }}
        />
      )}
    </div>
  )
}

export default ConceptListPage
