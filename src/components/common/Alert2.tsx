/**
 * Alert2 사용법
 *
 * [default] 세로형 / 회색 버튼 + 검정 버튼
 *   <Alert2 />
 *   <Alert2 variant="default" />
 *
 * [variant2] 세로형 / 입력창 + 회색 버튼 + 검정 버튼
 *   <Alert2 variant="variant2" />
 *
 * [variant3] 세로형 / 회색 버튼 + 핑크 버튼
 *   <Alert2 variant="variant3" />
 *
 * [alert] 가로형 / 회색 버튼 + 핑크 버튼
 *   <Alert2 variant="alert" />
 *
 * [alert2] 단일 버튼형 / 핑크 버튼 1개
 *   <Alert2 variant="alert2" />
 *
 * 버튼 동작 연결
 *   <Alert2 variant="variant2" onCancel={handleCancel} onConfirm={handleConfirm} />
 *
 * 텍스트 변경
 *   <Alert2 title="제목" description="설명" cancelText="취소" confirmText="확인" />
 */

import Button from '@/components/common/Button'
import ButtonLarge from '@/components/common/ButtonLarge'

interface Props {
  variant?: 'default' | 'variant2' | 'variant3' | 'alert' | 'alert2'
  title?: string
  description?: string
  inputPlaceholder?: string
  cancelText?: string
  confirmText?: string
  onCancel?: () => void
  onConfirm?: () => void
}

const alertContent = {
  default: {
    title: '정말 탈퇴하시겠어요?',
    description:
      '회원 탈퇴 시, PICDAY 예약 및 이용 내역이 삭제되며\n계정은 복구되지 않습니다. 그래도 탈퇴하시겠습니까?',
    inputPlaceholder: '',
    cancelText: '취소',
    confirmText: '계속하기',
    confirmVariant: 'black',
    secondaryWidth: 0,
  },
  variant2: {
    title: '정말 탈퇴하시겠어요?',
    description:
      '회원 탈퇴를 위해 DELETE를 입력해주세요.\nDELETE를 입력하면 회원 탈퇴가 완료됩니다.',
    inputPlaceholder: 'DELETE를 입력해주세요',
    cancelText: '취소',
    confirmText: '탈퇴하기',
    confirmVariant: 'black',
    secondaryWidth: 0,
  },
  variant3: {
    title: '정말 취소하시겠습니까?',
    description: '취소 후에는 되돌릴 수 없으며,\n예약하신 시간대가 해제됩니다.',
    inputPlaceholder: '',
    cancelText: '돌아가기',
    confirmText: '취소하기',
    confirmVariant: 'primary',
    secondaryWidth: 0,
  },
  alert: {
    title: '',
    description: '타임온미 스튜디오엔 선택하신 컨셉이 없어요.\n제외하고 비교할까요?',
    inputPlaceholder: '',
    cancelText: '나가기',
    confirmText: '제외하고 비교하기',
    confirmVariant: 'primary',
    secondaryWidth: 100,
  },
  alert2: {
    title: '',
    description:
      '데이지스튜디오, 타임온미 스튜디오엔\n선택하신 컨셉이 없어요.\n다른 컨셉을 선택해 주세요.',
    inputPlaceholder: '',
    cancelText: '',
    confirmText: '다시 선택하기',
    confirmVariant: 'primary',
    secondaryWidth: 0,
  },
} as const

const Alert2 = ({
  variant = 'default',
  title,
  description,
  inputPlaceholder,
  cancelText,
  confirmText,
  onCancel,
  onConfirm,
}: Props) => {
  const content = alertContent[variant]

  const isDelete = variant === 'variant2'
  const isCompareConfirm = variant === 'alert'
  const isCompareSingle = variant === 'alert2'
  const isBlackConfirm = content.confirmVariant === 'black'

  if (isCompareConfirm) {
    return (
      <div className="flex w-[362px] flex-col items-center rounded-[12px] bg-white">
        <p className="w-full whitespace-pre-line px-5 pt-5 text-center font-b6 text-gray-80">
          {description ?? content.description}
        </p>

        <ButtonLarge
          variant="pair"
          secondaryLabel={cancelText ?? content.cancelText}
          primaryLabel={confirmText ?? content.confirmText}
          secondaryWidth={content.secondaryWidth}
          onSecondaryClick={onCancel}
          onPrimaryClick={onConfirm}
        />
      </div>
    )
  }

  if (isCompareSingle) {
    return (
      <div className="flex w-[362px] flex-col items-center rounded-[12px] bg-white">
        <p className="w-full whitespace-pre-line px-5 pt-6 text-center font-b6 text-gray-80">
          {description ?? content.description}
        </p>

        <div className="w-full p-5">
          <Button variant="primary" onClick={onConfirm}>
            {confirmText ?? content.confirmText}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-[362px] flex-col items-center justify-center rounded-[12px] bg-white">
      <div className="flex w-full flex-col items-center pt-6">
        <div className="flex items-center gap-[10px] pb-2 text-center">
          <h2 className="font-h6 text-black">{title ?? content.title}</h2>
        </div>

        <div className="flex w-full items-center justify-center gap-[10px] pb-2 text-center">
          <p className="whitespace-pre-line text-center font-b8 text-gray-60">
            {description ?? content.description}
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col items-start gap-[10px] rounded-[12px] px-5 pb-5 pt-4">
        {isDelete && (
          <input
            className="flex h-[49px] w-full items-center justify-center rounded-[12px] border border-gray-20 bg-white px-5 py-3 text-center font-b4 text-gray-80 placeholder:text-gray-20"
            placeholder={inputPlaceholder ?? content.inputPlaceholder}
          />
        )}

        <Button variant="secondary" onClick={onCancel}>
          {cancelText ?? content.cancelText}
        </Button>

        {isBlackConfirm ? (
          <button
            type="button"
            className="flex h-[49px] w-full items-center justify-center rounded-[12px] bg-black px-5 py-3 font-b3 text-white"
            onClick={onConfirm}
          >
            {confirmText ?? content.confirmText}
          </button>
        ) : (
          <Button variant="primary" onClick={onConfirm}>
            {confirmText ?? content.confirmText}
          </Button>
        )}
      </div>
    </div>
  )
}

export default Alert2