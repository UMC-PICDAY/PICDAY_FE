/**
 * InputReview 사용법
 *
 * [default] 후기 입력 영역
 *   <InputReview value={review} onChange={setReview} />
 *
 * [error] 에러 테두리 + 에러 문구
 *   <InputReview value={review} onChange={setReview} isError />
 */

interface Props {
  value: string
  placeholder?: string
  maxLength?: number
  minLength?: number
  isError?: boolean
  onChange: (value: string) => void
}

const InputReview = ({
  value,
  placeholder = '촬영 경험을 자유롭게 남겨주세요. (최소 10자)',
  maxLength = 500,
  minLength = 10,
  isError = false,
  onChange,
}: Props) => {
  const isUnderMinLength = value.length > 0 && value.length < minLength
  const showError = isError || isUnderMinLength

  return (
    <div className="flex w-full flex-col items-start">
      <textarea
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
        className={`h-[112px] w-full resize-none rounded-[8px] border px-4 py-3 font-b8 text-gray-80 outline-none placeholder:text-gray-40 ${
          showError ? 'border-[#FF3B5B]' : 'border-gray-10'
        }`}
      />

      <div className="mt-1 flex w-full items-center justify-between">
        <p className={`font-cap3 ${showError ? 'text-[#FF3B5B]' : 'text-transparent'}`}>
          {showError ? 'ⓘ 10자 이상 입력해 주세요' : ' '}
        </p>

        <p className={`font-cap3 ${showError ? 'text-[#FF3B5B]' : 'text-gray-40'}`}>
          {value.length}/{maxLength}
        </p>
      </div>
    </div>
  )
}

export default InputReview