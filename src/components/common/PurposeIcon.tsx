/**
 * PurposeIcon 사용법
 *
 * 촬영 목적별 배지 아이콘 (40x40 슬롯, 미선택/선택 색상 자동 전환)
 *   <PurposeIcon type="증명" />
 *   <PurposeIcon type="프로필" selected />
 */
import type { FC, SVGProps } from 'react'

import IcPurposeProfile from '@/components/icons/IcPurposeProfile'
import IcPurposePersonalPhoto from '@/components/icons/IcPurposePersonalPhoto'
import IcPurposeEmployment from '@/components/icons/IcPurposeEmployment'
import IcPurposeFamily from '@/components/icons/IcPurposeFamily'
import IcPurposeFriendship from '@/components/icons/IcPurposeFriendship'
import IcPersonSimple from '@/components/icons/IcPersonSimple'

type PurposeType = '증명' | '프로필' | '개인화보' | '취업' | '가족' | '우정'

interface Props {
  type: PurposeType
  selected?: boolean
  className?: string
}

const ICON_BY_TYPE: Partial<Record<PurposeType, FC<SVGProps<SVGSVGElement>>>> = {
  프로필: IcPurposeProfile,
  개인화보: IcPurposePersonalPhoto,
  취업: IcPurposeEmployment,
  가족: IcPurposeFamily,
  우정: IcPurposeFriendship,
}

const PurposeIcon = ({ type, selected = false, className }: Props) => {
  const colorClass = selected ? 'text-brand-100' : 'text-brand-40'

  if (type === '증명') {
    return (
      <div className={className || 'relative flex size-[40px] items-center justify-center'}>
        <div className={`absolute inset-0 rounded-[4.875px] ${selected ? 'bg-brand-100' : 'bg-brand-40'}`} />
        <IcPersonSimple width={16} height={20} className="relative text-white" />
      </div>
    )
  }

  const Icon = ICON_BY_TYPE[type]
  if (!Icon) return null

  return (
    <div className={className || 'flex size-[40px] items-center justify-center'}>
      <Icon className={colorClass} />
    </div>
  )
}

export default PurposeIcon
