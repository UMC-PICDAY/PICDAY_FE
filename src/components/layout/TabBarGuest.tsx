import { IcSearch, IcWishlist, IcUser } from '../icons'
import Tap from './Tap'
import HomeBar from './HomeBar'

type TabItem = 'search' | 'wishlist' | 'login'

interface Props {
  activeTab?: TabItem
  onTabChange?: (tab: TabItem) => void
}

const tabs: { key: TabItem; label: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
  { key: 'search', label: '검색', icon: IcSearch },
  { key: 'wishlist', label: '위시리스트', icon: IcWishlist },
  { key: 'login', label: '로그인', icon: IcUser },
]

const TabBarGuest = ({ activeTab = 'search', onTabChange }: Props) => (
  <div className="flex flex-col items-center gap-[5px] w-full pt-[10px] px-5 bg-white backdrop-blur-[10px] border border-[rgba(238,238,238,0.6)] rounded-t-[20px] shadow-[0px_15px_40px_0px_rgba(206,206,206,0.08)] overflow-hidden">
    <div className="flex items-center justify-between w-full pb-1">
      {tabs.map(({ key, label, icon }) => (
        <Tap
          key={key}
          icon={icon}
          label={label}
          active={activeTab === key}
          onClick={() => onTabChange?.(key)}
        />
      ))}
    </div>
    <HomeBar />
  </div>
)

export default TabBarGuest
