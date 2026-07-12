import MapPin from '@/components/common/MapPin'
import PinFavorite from '@/components/common/PinFavorite'

interface StudioMapCanvasProps {
  interactive?: boolean
  className?: string
}

/**
 * 지도 영역. 실제 SDK 연동 전까지 회색 placeholder를 쓰되, 통합 페이지가 살아 있는
 * 동안 언마운트되지 않도록 항상 렌더한다. 시트 드래그 중에는 pointer 입력을 막는다.
 */
const StudioMapCanvas = ({
  interactive = true,
  className = '',
}: StudioMapCanvasProps) => (
  <div
    className={`absolute inset-0 bg-gray-10 ${interactive ? '' : 'pointer-events-none'} ${className}`}
  >
    <div className="flex h-full items-start justify-center pt-[100px]">
      <span className="font-b8 text-gray-60">지도 영역</span>
    </div>

    <PinFavorite className="absolute left-[64px] top-[132px]" />
    <PinFavorite className="absolute right-[72px] top-[188px]" />
    <div className="absolute left-1/2 top-[150px] -translate-x-1/2">
      <MapPin label="데이지스튜디오" />
    </div>
  </div>
)

export default StudioMapCanvas
