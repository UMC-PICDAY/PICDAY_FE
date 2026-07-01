import { IcSearch, IcWishlist, IcChat, IcUser } from '../icons'
import Tap from './Tap'
import HomeBar from './HomeBar'
import styles from './TabBar.module.css'

type TabItem = 'search' | 'wishlist' | 'chat' | 'mypage'

type TabBarUserProps = {
  activeTab?: TabItem
  onTabChange?: (tab: TabItem) => void
}

const tabs: { key: TabItem; label: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
  { key: 'search', label: '검색', icon: IcSearch },
  { key: 'wishlist', label: '위시리스트', icon: IcWishlist },
  { key: 'chat', label: '메세지', icon: IcChat },
  { key: 'mypage', label: '마이페이지', icon: IcUser },
]

const TabBarUser = ({ activeTab = 'search', onTabChange }: TabBarUserProps) => (
  <div className={styles.wrapper}>
    <div className={styles.tabs}>
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
