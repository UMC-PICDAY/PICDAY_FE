import { useNavigate, useParams } from 'react-router'

import Notice2 from '@/components/common/Notice2'
import { IcPicture } from '@/components/icons'
import NavigationBar from '@/components/layout/NavigationBar'

import { useStudioProductDetail } from '@/hooks/useStudio'

const ConceptDetailPage = () => {
  const navigate = useNavigate()
  const { studioId, conceptId } = useParams()
  const { data: detail, isLoading } = useStudioProductDetail(studioId, conceptId)

  const images = detail?.imageUrls ?? []
  const isEmpty = !isLoading && images.length === 0

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <NavigationBar
        variant="default"
        title={detail?.studioName ?? ''}
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
          {images.map((src, index) => (
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
