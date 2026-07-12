/**
 * InputField2 사용법
 *
 * [default] 라벨 + 입력값 + 도움말
 *   <InputField2 label="닉네임" value="이수현짱짱구" helperText="2~10자, 한글·영문·숫자 사용 가능" />
 *
 * [error] 라벨 + 에러 테두리 + 에러 문구
 *   <InputField2 label="닉네임" value="이수현짱" helperText="이미 사용 중인 닉네임이에요" isError />
 *
 * [noHelper] 도움말 문구 없음
 *   <InputField2 label="닉네임" value="이수현짱짱구" />
 *
 * 값 변경
 *   <InputField2 label="닉네임" value={nickname} onChange={setNickname} />
 */

interface Props {
  label: string
  value: string
  helperText?: string
  placeholder?: string
  isError?: boolean
  onChange?: (value: string) => void
}

const InputField2 = ({
  label,
  value,
  helperText,
  placeholder,
  isError = false,
  onChange,
}: Props) => {
  return (
    <div className="inline-flex w-full flex-col items-start gap-[5px]">
      <label className="font-cap3 text-gray-80">{label}</label>

      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange?.(event.target.value)}
        className={`flex h-[41px] w-full rounded-[8px] px-3 py-[10px] font-b7 text-gray-80 outline-none placeholder:text-gray-40 ${
          isError
            ? 'border border-[#FF3B5B] bg-white'
            : 'border border-transparent bg-brand-20'
        }`}
      />

      {helperText && (
        <p className={`font-cap3 ${isError ? 'text-[#FF3B5B]' : 'text-gray-40'}`}>
          {helperText}
        </p>
      )}
    </div>
  )
}

export default InputField2