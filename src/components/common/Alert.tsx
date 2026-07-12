/**
 * Alert 사용법
 *
 * [default] 우측 버튼이 5글자 이상일때, 버튼 2개
 *   <Alert />
 *   <Alert onCancel={handleCancel} onConfirm={handleConfirm} />
 *
 * [variant2] 좌우 버튼이 동일 너비 151px일때, 버튼 2개
 *   <Alert variant="variant2" />
 *   <Alert variant="variant2" onCancel={handleCancel} onConfirm={handleConfirm} />
 *
 * [variant3] 계속 진행하기 (핑크 배경), 버튼 1개
 *   <Alert variant="variant3" />
 *   <Alert variant="variant3" onConfirm={handleConfirm} />
 *
 * 텍스트 변경
 *   <Alert title="제목" description="설명" cancelText="취소" confirmText="확인" />
 */

import Button from '@/components/common/Button'
import ButtonLarge from '@/components/common/ButtonLarge'

interface Props {
  variant?: 'default' | 'variant2' | 'variant3'
  title?: string
  description?: string
  cancelText?: string
  confirmText?: string
  onCancel?: () => void
  onConfirm?: () => void
}

const alertContent = {
  default: {
    title: '결제를 중단하시겠어요?',
    description: '옵션 선택 페이지로 이동합니다',
    cancelText: '나가기',
    confirmText: '계속 결제하기',
    secondaryWidth: 100,
  },
  variant2: {
    title: '작성을 그만두시겠어요?',
    description: '작성 중인 리뷰는 저장되지 않습니다',
    cancelText: '나가기',
    confirmText: '계속 작성',
    secondaryWidth: 151,
  },
  variant3: {
    title: '작성을 그만두시겠어요?',
    description: '작성 중인 리뷰는 저장되지 않습니다',
    cancelText: '',
    confirmText: '계속 작성',
    secondaryWidth: 0,
  },
}

const Alert = ({
  variant = 'default',
  title,
  description,
  cancelText,
  confirmText,
  onCancel,
  onConfirm,
}: Props) => {
  const content = alertContent[variant]
  const isSingleButton = variant === 'variant3'
  const isSameWidthPair = variant === 'variant2'

  return (
    <div className="flex w-[362px] flex-col items-center rounded-[12px] bg-white">
      <div className="flex w-full flex-col items-center gap-2 pb-1 pt-6 text-center">
        <h2 className="font-h6 text-black">{title ?? content.title}</h2>
        <p className="font-b6 text-gray-60">{description ?? content.description}</p>
      </div>

      {isSingleButton ? (
        <div className="w-full px-5 py-5">
          <Button variant="primary" onClick={onConfirm}>
            {confirmText ?? content.confirmText}
          </Button>
        </div>
      ) : isSameWidthPair ? (
        <div className="flex w-full items-center gap-5 px-5 py-5">
          <div className="w-[151px]">
            <Button variant="secondary" onClick={onCancel}>
              {cancelText ?? content.cancelText}
            </Button>
          </div>

          <div className="w-[151px]">
            <Button variant="primary" onClick={onConfirm}>
              {confirmText ?? content.confirmText}
            </Button>
          </div>
        </div>
      ) : (
        <ButtonLarge
          variant="pair"
          secondaryLabel={cancelText ?? content.cancelText}
          primaryLabel={confirmText ?? content.confirmText}
          secondaryWidth={content.secondaryWidth}
          onSecondaryClick={onCancel}
          onPrimaryClick={onConfirm}
        />
      )}
    </div>
  )
}

export default Alert