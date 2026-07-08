/**
 * Menu 사용법
 *
 * 메뉴 탭 텍스트
 *   <Menu />
 *
 * 선택 상태 표시
 *   <Menu label="포트폴리오" active />
 *
 * 메뉴 상태 관리
 *   <Menu
 *     label="포트폴리오"
 *     active={activeMenu === 'portfolio'}
 *     onClick={() => setActiveMenu('portfolio')}
 *   />
 */

interface Props {
  label?: string
  active?: boolean
  onClick?: () => void
}

const Menu = ({
  label = '포트폴리오',
  active = false,
  onClick,
}: Props) => (
  <button
    type="button"
    aria-pressed={active}
    className={`flex h-[32px] items-center justify-center px-2 py-1 ${
      active
        ? 'border-b border-black font-b7 text-black'
        : 'font-b8 text-gray-60'
    }`}
    onClick={onClick}
  >
    {label}
  </button>
)

export default Menu