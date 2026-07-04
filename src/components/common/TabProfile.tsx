/**
 * TabProfile 사용법
 *
 * 프로필 영역 탭 버튼
 *   <TabProfile />
 *
 * 선택 상태 표시
 *   <TabProfile label="프로필" active />
 *
 * 탭 상태 관리
 *   <TabProfile
 *     label="프로필"
 *     active={activeTab === 'profile'}
 *     onClick={() => setActiveTab('profile')}
 *   />
 */

interface Props {
  label?: string
  active?: boolean
  onClick?: () => void
}

const TabProfile = ({
  label = '프로필',
  active = false,
  onClick,
}: Props) => (
  <button
    type="button"
    aria-pressed={active}
    className={`flex h-[32px] w-full items-center justify-center gap-[10px] rounded-full px-5 py-1 whitespace-nowrap ${
      active
        ? 'bg-brand-100 font-b6 text-white'
        : 'bg-transparent font-b7 text-gray-80'
    }`}
    onClick={onClick}
  >
    {label}
  </button>
)

export default TabProfile