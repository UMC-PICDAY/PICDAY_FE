import { IcSearch, IcWishlist, IcChat, IcUser } from '@/components/icons'
import Tap from '@/components/layout/Tap'
import HomeBar from '@/components/layout/HomeBar'

type TabItem = 'search' | 'wishlist' | 'chat' | 'mypage'

interface Props {
  activeTab?: TabItem
  onTabChange?: (tab: TabItem) => void
}

const tabs: { key: TabItem; label: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
  { key: 'search', label: '검색', icon: IcSearch },
  { key: 'wishlist', label: '위시리스트', icon: IcWishlist },
  { key: 'chat', label: '메세지', icon: IcChat },
  { key: 'mypage', label: '마이페이지', icon: IcUser },
]

const TabBarUser = ({ activeTab = 'search', onTabChange }: Props) => (
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

export default TabBarUser
