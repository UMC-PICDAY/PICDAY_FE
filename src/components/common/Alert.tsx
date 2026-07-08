/**
 * Alert 사용법
 *
 * 결제/작성 중단 등 기본 알림 다이얼로그
 *   <Alert />
 *
 * 텍스트 및 버튼 동작 변경
 *   <Alert
 *     title="정말 나가시겠어요?"
 *     description="선택하신 옵션이 저장되지 않습니다"
 *     cancelText="나가기"
 *     confirmText="계속하기"
 *     onCancel={handleCancel}
 *     onConfirm={handleConfirm}
 *   />
 */

interface Props {
  title?: string
  description?: string
  cancelText?: string
  confirmText?: string
  onCancel?: () => void
  onConfirm?: () => void
}

const Alert = ({
  title = '결제를 중단하시겠어요?',
  description = '옵션 선택 페이지로 이동합니다.',
  cancelText = '나가기',
  confirmText = '계속 결제하기',
  onCancel,
  onConfirm,
}: Props) => (
  <div className="flex w-[362px] flex-col items-center justify-center rounded-[12px] bg-white px-5 py-5">
    <div className="flex w-full flex-col items-center">
      <h2 className="font-h6 text-black">{title}</h2>

      <p className="mt-2 font-b6 text-gray-60">{description}</p>
    </div>

    <div className="mt-5 flex w-full gap-3">
      <button
        type="button"
        className="flex h-[49px] w-[100px] shrink-0 items-center justify-center rounded-[12px] bg-gray-10 px-5 py-3 font-b3 text-gray-80"
        onClick={onCancel}
      >
        {cancelText}
      </button>

      <button
        type="button"
        className="flex h-[49px] flex-1 items-center justify-center rounded-[12px] bg-brand-100 px-5 py-3 font-b3 text-white"
        onClick={onConfirm}
      >
        {confirmText}
      </button>
    </div>
  </div>
)

export default Alert