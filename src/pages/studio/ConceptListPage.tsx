import CardStudioDetail from '@/components/cards/CardStudioDetail'
import { IcFavorite } from '@/components/icons'
import NavigationBar from '@/components/layout/NavigationBar'

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

const ConceptListPage = () => (
  <div className="flex min-h-dvh flex-col bg-white">
    <NavigationBar
      variant="subtitle"
      title="데이지 스튜디오"
      date="2026.06.18"
      count="14:00"
      rightNode={<IcFavorite width={24} height={24} />}
    />

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
  </div>
)

export default ConceptListPage
