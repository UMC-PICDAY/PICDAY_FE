import { IcClose } from '../icons'

interface Props {
  size?: 'default' | 'mini'
  onClick?: () => void
}

const ButtonDelete = ({ size = 'default', onClick }: Props) => (
  <button
    className={`flex items-center justify-center border-none rounded-full bg-gray-40 text-white cursor-pointer p-0 ${
      size === 'mini' ? 'w-3.5 h-3.5' : 'w-5 h-5'
    }`}
    onClick={onClick}
    aria-label="삭제"
  >
    <IcClose width={size === 'mini' ? 14 : 20} height={size === 'mini' ? 14 : 20} />
  </button>
)

export default ButtonDelete
