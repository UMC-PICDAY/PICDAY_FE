/**
 * LogoType 사용법
 *
 * 텍스트 로고 (기본값, TopAppBar에서 사용)
 *   <LogoType />
 *
 * 앱 아이콘 (스플래시 등)
 *   <LogoType variant="icon" />
 */
import logoText from '@/assets/images/logo-text.svg'
import logoIcon from '@/assets/images/logo-icon.png'

interface Props {
  variant?: 'text' | 'icon'
}

const LogoType = ({ variant = 'text' }: Props) => {
  if (variant === 'icon') {
    return <img src={logoIcon} alt="PICDAY" className="w-[67px] h-[67px]" />
  }
  return <img src={logoText} alt="PICDAY" className="w-[83px] h-[20px]" />
}

export default LogoType
