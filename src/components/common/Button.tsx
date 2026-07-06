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
 * [disabled] 비활성화 (gray-20 배경)
 *   <Button variant="disabled">비교 시작</Button>
 */
interface Props {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'disabled'
  onClick?: () => void
}

const variantClass = {
  primary: 'bg-brand-100 text-white text-[var(--font-b3-size)] font-[var(--font-b3-weight)] leading-[var(--font-b3-line-height)] cursor-pointer',
  secondary: 'bg-gray-10 text-gray-80 text-[var(--font-b6-size)] font-[var(--font-b6-weight)] leading-[var(--font-b6-line-height)] cursor-pointer',
  disabled: 'bg-gray-20 text-white text-[var(--font-b3-size)] font-[var(--font-b3-weight)] leading-[var(--font-b3-line-height)] cursor-not-allowed',
}

const Button = ({ children, variant = 'primary', onClick }: Props) => (
  <button
    className={`flex items-center justify-center w-full py-3 px-5 border-none rounded-[12px] ${variantClass[variant]}`}
    disabled={variant === 'disabled'}
    onClick={onClick}
  >
    {children}
  </button>
)

export default Button
