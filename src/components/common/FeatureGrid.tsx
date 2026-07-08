/**
 * FeatureGrid 사용법
 *
 * 사진관 제공 기능 목록
 *   <FeatureGrid />
 *
 * 기본 기능
 *   와이파이 / 주차 / 의상비치 / 헤어메이크업 제휴
 *
 * 기능 목록 변경
 *   <FeatureGrid
 *     features={[
 *       { label: '와이파이', icon: 'wifi' },
 *       { label: '주차', icon: 'wishlist' },
 *     ]}
 *   />
 */

import { IcWifi, IcWishlist } from '@/components/icons'

interface Props {
  wifiLabel?: string
  parkingLabel?: string
  clothesLabel?: string
  makeupLabel?: string
}

const FeatureGrid = ({
  wifiLabel = '와이파이',
  parkingLabel = '주차',
  clothesLabel = '의상비치',
  makeupLabel = '헤어메이크업 제휴',
}: Props) => (
  <div className="flex w-[362px] items-center justify-between">
    <div className="flex h-[48px] w-[68px] flex-col items-center justify-center gap-1">
      <IcWifi width={24} height={24} className="text-brand-100" />
      <span className="whitespace-nowrap font-b10 text-gray-60">
        {wifiLabel}
      </span>
    </div>

    <div className="flex h-[48px] w-[68px] flex-col items-center justify-center gap-1">
      <IcWishlist width={24} height={24} className="text-brand-100" />
      <span className="whitespace-nowrap font-b10 text-gray-60">
        {parkingLabel}
      </span>
    </div>

    <div className="flex h-[48px] w-[68px] flex-col items-center justify-center gap-1">
      <IcWishlist width={24} height={24} className="text-brand-100" />
      <span className="whitespace-nowrap font-b10 text-gray-60">
        {clothesLabel}
      </span>
    </div>

    <div className="flex h-[48px] w-[68px] flex-col items-center justify-center gap-1">
      <IcWishlist width={24} height={24} className="text-brand-100" />
      <span className="whitespace-nowrap font-b10 text-gray-60">
        {makeupLabel}
      </span>
    </div>
  </div>
)

export default FeatureGrid