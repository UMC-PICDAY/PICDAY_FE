import icStatusBar from '../../assets/icons/ic_statusbar.png'
import styles from './StatusBar.module.css'

const StatusBar = () => (
  <div className={styles.wrapper}>
    <div className={styles.left}>
      <span className={styles.time}>9:41</span>
    </div>
    <div className={styles.center} />
    <div className={styles.right}>
      <img src={icStatusBar} alt="" className={styles.statusIcons} />
    </div>
  </div>
)

export default StatusBar
