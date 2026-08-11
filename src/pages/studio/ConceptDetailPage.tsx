import { useNavigate, useParams } from 'react-router'

import Notice2 from '@/components/common/Notice2'
import { IcError, IcPicture } from '@/components/icons'
import NavigationBar from '@/components/layout/NavigationBar'

import ErrorNotice from '@/pages/studio/components/ErrorNotice'
import { useStudioProductDetail } from '@/hooks/useStudio'

const ConceptDetailPage = () => {
  const navigate = useNavigate()
  const { studioId, conceptId } = useParams()
  const {
    data: detail,
    isLoading,
    isError,
    refetch,
  } = useStudioProductDetail(studioId, conceptId)

  const images = detail?.imageUrls ?? []
  // 조회 실패는 '사진 없음'과 구분해서 재시도 가능한 에러로 보여준다.
  const isEmpty = !isLoading && !isError && images.length === 0

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <NavigationBar
        variant="default"
        title={detail?.studioName ?? ''}
        showLeft={false}
        onClose={() => navigate(-1)}
      />

      {isError ? (
        <div className="flex flex-1 items-center justify-center px-5">
          <ErrorNotice
            icon={<IcError width={48} height={48} className="text-brand-80" />}
            title="컨셉 사진을 불러오지 못했어요"
            onRetry={() => refetch()}
          />
        </div>
      ) : isEmpty ? (
        <div className="flex flex-1 flex-col items-center justify-center">
          <Notice2
            variant="message"
            icon={<IcPicture width={44} height={44} className="text-brand-80" />}
            title="아직 등록된 사진이 없어요"
          />
        </div>
      ) : (
        <div className="flex flex-col gap-5 p-5">
          {images.map((src) => (
            <img
              key={src}
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
