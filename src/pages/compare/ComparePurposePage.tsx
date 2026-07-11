import { useState } from 'react'
import { useNavigate } from 'react-router'

import Button from '@/components/common/Button'
import ButtonCompareSlot from '@/components/common/ButtonCompareSlot'
import CategoryButton from '@/components/common/CategoryButton'
import Title from '@/components/common/Title'
import { IcBack } from '@/components/icons'
import HomeBar from '@/components/layout/HomeBar'
import StatusBar from '@/components/layout/StatusBar'

type PurposeType = '증명' | '프로필' | '개인화보' | '취업' | '가족' | '우정'

const PURPOSES: PurposeType[] = [
  '증명',
  '프로필',
  '개인화보',
  '취업',
  '가족',
  '우정',
]

const ComparePurposePage = () => {
  const navigate = useNavigate()
  const [selectedPurpose, setSelectedPurpose] =
    useState<PurposeType>('프로필')

  return (
    <div className="relative flex min-h-dvh w-full flex-col bg-white text-black">
      <StatusBar />

      <header className="flex w-full items-center justify-between px-5 py-3">
        <button
          type="button"
          aria-label="뒤로가기"
          className="flex size-9 items-center justify-center border-none bg-transparent p-0"
          onClick={() => navigate(-1)}
        >
          <IcBack width={24} height={24} />
        </button>

        <h1 className="font-h6 flex-1 text-center">사진관 비교</h1>

        <div className="size-9" />
      </header>

      <main className="flex-1 px-5 pt-2 pb-[220px]">
        <section className="-mx-5">
          <Title
            variant="large"
            title="어떤 촬영으로 비교할까요?"
            description="같은 촬영 기준으로 가격과 포트폴리오를 비교해 드려요"
          />
        </section>

        <section
          className="grid grid-cols-2 gap-4 py-[10px]"
          aria-label="촬영 목적 선택"
        >
          {PURPOSES.map((purpose) => (
            <CategoryButton
              key={purpose}
              type={purpose}
              active={selectedPurpose === purpose}
              onClick={() => setSelectedPurpose(purpose)}
            />
          ))}
        </section>
      </main>

      <footer className="absolute inset-x-0 bottom-0 bg-white">
        <div className="flex items-center justify-between px-5 pb-4">
          <div className="flex items-center gap-[5px]">
            <ButtonCompareSlot label="데이지" />
            <ButtonCompareSlot label="타임" />
            <ButtonCompareSlot state="add" />
          </div>

          <span className="font-b6 whitespace-nowrap text-gray-20">
            2개 선택됨
          </span>
        </div>

        <div className="px-5 pb-[9px]">
          <Button>비교 시작</Button>
        </div>

        <HomeBar />
      </footer>
    </div>
  )
}

export default ComparePurposePage