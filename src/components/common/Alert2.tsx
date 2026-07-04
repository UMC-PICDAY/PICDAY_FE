interface Props {
  variant?: 'withdrawConfirm' | 'withdrawDelete' | 'reservationCancel'
  title?: string
  description?: string
  inputPlaceholder?: string
  cancelText?: string
  confirmText?: string
  onCancel?: () => void
  onConfirm?: () => void
}

const Alert2 = ({
  variant = 'withdrawConfirm',
  title,
  description,
  inputPlaceholder = 'DELETE를 입력해주세요',
  cancelText,
  confirmText,
  onCancel,
  onConfirm,
}: Props) => {
  const isDelete = variant === 'withdrawDelete'
  const isReservationCancel = variant === 'reservationCancel'

  const defaultTitle = isReservationCancel
    ? '정말 취소하시겠습니까?'
    : '정말 탈퇴하시겠어요?'

  const defaultDescription = isReservationCancel
    ? '취소 후에는 되돌릴 수 없으며,\n예약하신 시간대가 해제됩니다.'
    : isDelete
      ? '회원 탈퇴를 위해 DELETE를 입력해주세요.\nDELETE를 입력하면 회원 탈퇴가 완료됩니다.'
      : '회원 탈퇴 시, PICDAY 예약 및 이용 내역이 삭제되며\n계정은 복구되지 않습니다. 그래도 탈퇴하시겠습니까?'

  const defaultCancelText = isReservationCancel ? '돌아가기' : '취소'

  const defaultConfirmText = isReservationCancel
    ? '취소하기'
    : isDelete
      ? '탈퇴하기'
      : '계속하기'

  const confirmButtonColor = isReservationCancel ? 'bg-brand-100' : 'bg-black'

  return (
    <div className="flex w-[362px] flex-col items-center justify-center rounded-[12px] bg-white p-5">
      <div className="flex w-full flex-col items-center">
        <h2 className="font-h6 text-black">{title ?? defaultTitle}</h2>

        <p className="mt-2 whitespace-pre-line text-center font-b8 text-gray-60">
          {description ?? defaultDescription}
        </p>
      </div>

      <div className="mt-4 flex w-full flex-col gap-[10px]">
        {isDelete && (
          <input
            className="flex h-[49px] w-full items-center justify-center rounded-[12px] border border-gray-20 bg-white px-5 py-3 text-center font-b4 text-gray-80 placeholder:text-gray-20"
            placeholder={inputPlaceholder}
          />
        )}

        <button
          type="button"
          className="flex h-[49px] w-full items-center justify-center rounded-[12px] bg-gray-10 px-5 py-3 font-b3 text-gray-80"
          onClick={onCancel}
        >
          {cancelText ?? defaultCancelText}
        </button>

        <button
          type="button"
          className={`flex h-[49px] w-full items-center justify-center rounded-[12px] px-5 py-3 font-b3 text-white ${confirmButtonColor}`}
          onClick={onConfirm}
        >
          {confirmText ?? defaultConfirmText}
        </button>
      </div>
    </div>
  )
}

export default Alert2