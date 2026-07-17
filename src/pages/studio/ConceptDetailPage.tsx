import { useNavigate, useSearchParams } from 'react-router'

import Notice2 from '@/components/common/Notice2'
import { IcPicture } from '@/components/icons'
import NavigationBar from '@/components/layout/NavigationBar'

import cardImage1 from '@/assets/images/CardImage1.png'
import cardImage2 from '@/assets/images/CardImage2.png'
import cardImage3 from '@/assets/images/CardImage3.png'

const IMAGES = [cardImage1, cardImage2, cardImage3]

const ConceptDetailPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isEmpty = searchParams.get('empty') === '1'

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <NavigationBar
        variant="default"
        title="체리베리벌쓰데이"
        showLeft={false}
        onClose={() => navigate(-1)}
      />

      {isEmpty ? (
        <div className="flex flex-1 flex-col items-center justify-center">
          <Notice2
            variant="message"
            icon={<IcPicture width={44} height={44} className="text-brand-80" />}
            title="아직 등록된 사진이 없어요"
          />
        </div>
      ) : (
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
      )}
    </div>
  )
}

export default ConceptDetailPage
