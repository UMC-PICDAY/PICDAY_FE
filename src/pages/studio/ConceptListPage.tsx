import { useState } from 'react'
import { useSearchParams } from 'react-router'

import CardStudioDetail from '@/components/cards/CardStudioDetail'
import Toast from '@/components/common/Toast'
import { IcFavorite } from '@/components/icons'
import NavigationBar from '@/components/layout/NavigationBar'

import DateChangeSheet from '@/pages/studio/components/DateChangeSheet'

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

const ConceptListPage = () => {
  const [searchParams] = useSearchParams()
  const [dateSheetOpen, setDateSheetOpen] = useState(false)

  const noAvailableTime = searchParams.get('noslot') === '1'

  // 미리보기: ?toast=date(날짜·시간 미선택), ?toast=time(날짜만 선택)
  const toastParam = searchParams.get('toast')
  const dateSelected = toastParam !== 'date'
  const timeSelected = toastParam === null

  const toastMessage = !dateSelected
    ? '날짜를 먼저 설정해 주세요'
    : !timeSelected
      ? '시간을 먼저 설정해 주세요'
      : null

  const subtitleDate = dateSelected ? '2026.06.18' : '날짜, 시간 선택'
  const subtitleTime = dateSelected ? (timeSelected ? '14:00' : '시간 선택') : ''

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <NavigationBar
        variant="subtitle"
        title="데이지 스튜디오"
        date={subtitleDate}
        count={subtitleTime}
        rightNode={<IcFavorite width={24} height={24} />}
        onSubtitleClick={() => setDateSheetOpen(true)}
      />

      {toastMessage && (
        <div className="flex justify-center px-5 py-2">
          <Toast
            message={toastMessage}
            className="flex items-center justify-center whitespace-nowrap rounded-[100px] bg-brand-60 px-4 py-2 font-b10 text-white"
          />
        </div>
      )}

      <main className="flex flex-col px-5 pb-6">
        {GROUPS.map((group) => (
          <section key={group.title}>
            <h2 className="pb-3 pt-5 font-b3 text-black">{group.title}</h2>
            <div className="flex flex-col items-center gap-3">
              {group.cards.map((card, index) => (
                <CardStudioDetail
                  key={`${group.title}-${index}`}
                  description={card.description}
                  imageSrc={card.imageSrc}
                />
              ))}
            </div>
          </section>
        ))}
      </main>

      {dateSheetOpen && (
        <DateChangeSheet
          noAvailableTime={noAvailableTime}
          onClose={() => setDateSheetOpen(false)}
          onApply={() => setDateSheetOpen(false)}
        />
      )}
    </div>
  )
}

export default ConceptListPage
