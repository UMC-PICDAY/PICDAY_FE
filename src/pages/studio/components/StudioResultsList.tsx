import CardStudioPreview from '@/components/cards/CardStudioPreview'
import { STUDIO_SERVICE_OPTIONS } from '@/utils/studioSearchParams'
import type { StudioSearchItem } from '@/types/studio'

const SERVICE_LABEL = new Map<string, string>(
  STUDIO_SERVICE_OPTIONS.map(({ value, quickLabel }) => [value, quickLabel]),
)

const formatPrice = (price: number) => `₩${price.toLocaleString()}~`

interface StudioResultsListProps {
  studios: readonly StudioSearchItem[]
  showCompareButton?: boolean
  onSelect?: (id: number) => void
}

/**
 * C-1(half)과 C-3(expanded)이 공유하는 단일 결과 목록.
 * 스냅 전환 시 카드 key/데이터 참조를 유지하고 비교 액션 노출만 바꾼다.
 */
const StudioResultsList = ({
  studios,
  showCompareButton = false,
  onSelect,
}: StudioResultsListProps) => (
  <div className="flex w-full flex-col gap-5 pb-14">
    {studios.map((studio) => (
      <CardStudioPreview
        key={studio.studioId}
        name={studio.studioName}
        location={studio.locationCategory}
        category={studio.shootingCategory[0] ?? ''}
        secondaryCategory={studio.shootingCategory[1] ?? ''}
        services={studio.serviceTags.map((tag) => SERVICE_LABEL.get(tag) ?? tag)}
        price={formatPrice(studio.minprice)}
        rating={String(studio.rating)}
        reviewCount={String(studio.reviewCount)}
        imageSrc={studio.thumbnailUrls[0] ?? null}
        secondImageSrc={studio.thumbnailUrls[1] ?? null}
        isFavorite={studio.isWishlisted}
        showCompareButton={showCompareButton}
        onClick={() => onSelect?.(studio.studioId)}
        className="relative w-full rounded-[20px] border border-[rgba(254,228,235,0.4)] bg-white/75 p-[10px] shadow-[0px_15px_48px_0px_rgba(252,200,215,0.1)] backdrop-blur-[10px]"
      />
    ))}
  </div>
)

export default StudioResultsList
