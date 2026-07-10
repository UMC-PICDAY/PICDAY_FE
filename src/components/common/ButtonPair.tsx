/**
 * ButtonPair 사용법
 *
 * 좌우 버튼이 반반 나눠지는 구조 (좌: 아웃라인, 우: 핑크)
 *   <ButtonPair leftLabel="취소" rightLabel="확인" />
 *   <ButtonPair leftLabel="닫기" rightLabel="예약하기" onLeftClick={handleClose} onRightClick={handleReserve} />
 */
import Button from '@/components/common/Button'

interface Props {
  leftLabel: string
  rightLabel: string
  onLeftClick?: () => void
  onRightClick?: () => void
}

const ButtonPair = ({ leftLabel, rightLabel, onLeftClick, onRightClick }: Props) => (
  <div className="flex w-full items-center gap-2">
    <div className="flex-1">
      <Button variant="outline" size="sm" onClick={onLeftClick}>
        {leftLabel}
      </Button>
    </div>
    <div className="flex-1">
      <Button variant="primary" size="sm" onClick={onRightClick}>
        {rightLabel}
      </Button>
    </div>
  </div>
)

export default ButtonPair
