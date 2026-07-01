import { IcSearch, IcWishlist, IcUser } from '../icons'
import Tap from './Tap'
import HomeBar from './HomeBar'
import styles from './TabBar.module.css'

type TabItem = 'search' | 'wishlist' | 'login'

type TabBarGuestProps = {
  activeTab?: TabItem
  onTabChange?: (tab: TabItem) => void
}

const tabs: { key: TabItem; label: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
  { key: 'search', label: '검색', icon: IcSearch },
  { key: 'wishlist', label: '위시리스트', icon: IcWishlist },
  { key: 'login', label: '로그인', icon: IcUser },
]

const TabBarGuest = ({ activeTab = 'search', onTabChange }: TabBarGuestProps) => (
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

export default TabBarGuest
