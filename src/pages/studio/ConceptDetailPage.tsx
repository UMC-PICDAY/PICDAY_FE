import NavigationBar from '@/components/layout/NavigationBar'

import cardImage1 from '@/assets/images/CardImage1.png'
import cardImage2 from '@/assets/images/CardImage2.png'
import cardImage3 from '@/assets/images/CardImage3.png'

const IMAGES = [cardImage1, cardImage2, cardImage3]

const ConceptDetailPage = () => (
  <div className="flex min-h-dvh flex-col bg-white">
    <NavigationBar variant="default" title="체리베리벌쓰데이" showLeft={false} />

    <div className="flex flex-col gap-5 p-5">
      {IMAGES.map((src, index) => (
        <img
          key={index}
          src={src}
          alt="컨셉 사진"
          className="aspect-[363/543] w-full object-cover"
        />
      ))}
    </div>
  </div>
)

export default ConceptDetailPage
