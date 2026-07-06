/**
 * TopAppBar 사용법
 *
 * 상단 앱바 (PICDAY 로고)
 *   <TopAppBar />
 */
import LogoType from '@/components/layout/LogoType'

const TopAppBar = () => (
  <div className="flex items-center justify-between w-full px-5 py-3">
    <LogoType />
  </div>
)

export default TopAppBar
