/**
 * Button 사용법
 *
 * [primary] 핑크 배경 (기본값)
 *   <Button>예약하기</Button>
 *   <Button variant="primary" onClick={handleClick}>확인</Button>
 *
 * [secondary] 회색 배경
 *   <Button variant="secondary">취소</Button>
 *
 * [outline] 흰 배경 + 회색 테두리
 *   <Button variant="outline">예약 취소</Button>
 *
 * [disabled] 비활성화 (gray-20 배경)
 *   <Button variant="disabled">비교 시작</Button>
 *
 * [size] 좁은 버튼 2개를 나란히 둘 때는 sm (기본값 lg)
 *   <Button size="sm" variant="outline">예약 취소</Button>
 *
 * [fullWidth] 내용 너비만큼만 차지하게 할 때 false
 *   <Button fullWidth={false}>문의</Button>
 */
interface Props {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'disabled'
  size?: 'lg' | 'sm'
  fullWidth?: boolean
  onClick?: () => void
}

const colorClass = {
  primary: 'border-none bg-brand-100 text-white cursor-pointer',
  secondary: 'border-none bg-gray-10 text-gray-80 cursor-pointer',
  outline: 'border border-gray-20 bg-white text-gray-60 cursor-pointer',
  disabled: 'border-none bg-gray-20 text-white cursor-not-allowed',
}

const paddingClass = {
  lg: 'py-3 px-5',
  sm: 'h-10 px-4',
}

const Button = ({ children, variant = 'primary', size = 'lg', fullWidth = true, onClick }: Props) => {
  const fontClass = variant === 'outline' ? 'font-b8' : size === 'lg' ? 'font-b3' : 'font-b7'

  return (
    <button
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-[12px] ${
        fullWidth ? 'w-full' : ''
      } ${paddingClass[size]} ${colorClass[variant]} ${fontClass}`}
      disabled={variant === 'disabled'}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button
