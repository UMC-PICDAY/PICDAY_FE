import type { ReactNode } from 'react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'

import CardStudioCompare from '@/components/cards/CardStudioCompare'
import AddButton from '@/components/common/AddButton'
import Button from '@/components/common/Button'
import HomeBar from '@/components/layout/HomeBar'
import NavigationBar from '@/components/layout/NavigationBar'
import StatusBar from '@/components/layout/StatusBar'

interface CompareData {
  price: string
  description: string
  badgeLabel?: string
  services: string[]
  location: string
  reservationDate: string
}

interface SelectedStudio {
  id: number
  name: string
  imageSrc?: string
  rating: number
  reviewCount: number
  compareData: CompareData
}

interface NavigationStudio {
  id: number
  name: string
  imageSrc?: string
  rating: number
  reviewCount: number
  compareData?: CompareData
}

interface NavigationState {
  purpose?: string
  studios?: NavigationStudio[]
}

interface CompareRowProps {
  title: string
  children: ReactNode
}

const DEFAULT_COMPARE_DATA: CompareData[] = [
  {
    price: '₩30,000',
    description: '보정 2장 · 의상 포함',
    badgeLabel: '추가금 없음',
    services: ['헤어·메이크업', '주차'],
    location: '홍대 · 도보 3분',
    reservationDate: '6월 27일 (목)',
  },
  {
    price: '₩35,000',
    description: '보정 3장',
    badgeLabel: '추가금 없음',
    services: ['헤어·메이크업', '의상 비치'],
    location: '홍대 · 도보 5분',
    reservationDate: '6월 28일 (금)',
  },
]

const FALLBACK_STUDIOS: SelectedStudio[] = [
  {
    id: 1,
    name: '데이지',
    rating: 4.9,
    reviewCount: 128,
    compareData: DEFAULT_COMPARE_DATA[0],
  },
  {
    id: 2,
    name: '타임온미',
    rating: 4.9,
    reviewCount: 128,
    compareData: DEFAULT_COMPARE_DATA[1],
  },
]

const getInitialStudios = (
  navigationState: NavigationState | null,
): SelectedStudio[] => {
  const receivedStudios = navigationState?.studios?.slice(0, 2)

  if (!receivedStudios?.length) {
    return FALLBACK_STUDIOS
  }

  return receivedStudios.map((studio, index) => ({
    ...studio,
    compareData:
      studio.compareData ??
      DEFAULT_COMPARE_DATA[index] ??
      DEFAULT_COMPARE_DATA[0],
  }))
}

const CompareTwoPage = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const navigationState = location.state as NavigationState | null

  const [selectedStudios, setSelectedStudios] = useState<SelectedStudio[]>(() =>
    getInitialStudios(navigationState),
  )

  const [selectedStudioId, setSelectedStudioId] = useState<number | null>(
    selectedStudios[0]?.id ?? null,
  )

  const hasSelectedStudio = selectedStudios.some(
    (studio) => studio.id === selectedStudioId,
  )

  const handleBack = () => {
    navigate('/compare')
  }

  const handleClose = () => {
    navigate('/studios/list')
  }

  const handleStudioDetail = (studioId: number) => {
    navigate(`/studios/${studioId}`)
  }

  const handleSelectStudio = (studioId: number) => {
    setSelectedStudioId(studioId)
  }

  const handleDeleteStudio = (studioId: number) => {
    setSelectedStudios((currentStudios) => {
      const remainingStudios = currentStudios.filter(
        (studio) => studio.id !== studioId,
      )

      if (selectedStudioId === studioId) {
        setSelectedStudioId(remainingStudios[0]?.id ?? null)
      }

      return remainingStudios
    })
  }

  const handleAddStudio = () => {
    navigate('/studios/list', {
      state: {
        selectedStudios,
        purpose: navigationState?.purpose,
      },
    })
  }

  const handleConceptList = () => {
    if (!hasSelectedStudio || selectedStudioId === null) {
      return
    }

    navigate(`/studios/${selectedStudioId}/concepts`)
  }

  return (
    <div className="relative mx-auto min-h-dvh w-full max-w-[402px] overflow-x-hidden bg-white">
      <div className="sticky top-0 z-20 bg-white">
        <StatusBar />

        <NavigationBar
          title="사진관 비교"
          onBack={handleBack}
          onClose={handleClose}
        />
      </div>

      <main className="pb-[166px]">
        <section className="flex w-full items-center justify-between gap-4 px-5 py-[10px]">
          {selectedStudios.map((studio) => (
            <CardStudioCompare
              key={studio.id}
              size="default"
              imageSrc={studio.imageSrc}
              name={studio.name}
              rating={studio.rating}
              reviewCount={studio.reviewCount}
              onClick={() => handleStudioDetail(studio.id)}
              onDelete={() => handleDeleteStudio(studio.id)}
            />
          ))}
        </section>

        <section className="flex w-full flex-col gap-3">
          <div className="flex w-full flex-col bg-[rgba(252,252,252,0.75)] shadow-[0px_15px_48px_0px_rgba(252,200,215,0.1)] backdrop-blur-[10px]">
            <div className="px-5 py-[10px]">
              <p className="font-b7 text-brand-100">비교하는 컨셉</p>

              <p className="font-cap3 text-gray-40">
                {navigationState?.purpose ?? '프로필'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 px-5 pb-[10px]">
              {selectedStudios.map((studio) => (
                <div
                  key={`${studio.id}-price`}
                  className="flex min-w-0 flex-col items-start gap-1"
                >
                  <p className="font-b3 text-[#222]">
                    {studio.compareData.price}
                  </p>

                  <p className="font-cap3 w-full truncate text-[#888]">
                    {studio.compareData.description}
                  </p>

                  {studio.compareData.badgeLabel && (
                    <span className="font-cap3 flex h-[22px] items-center justify-center rounded-full border border-gray-10 bg-brand-20 px-1.5 py-0.5 text-gray-60">
                      {studio.compareData.badgeLabel}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <CompareRow title="연계 서비스">
            {selectedStudios.map((studio) => (
              <div
                key={`${studio.id}-services`}
                className="flex min-w-0 flex-wrap items-center gap-[5px]"
              >
                {studio.compareData.services.length > 0 ? (
                  studio.compareData.services.map((service) => (
                    <span
                      key={service}
                      className="font-cap3 flex h-[22px] items-center justify-center rounded-full border border-gray-10 bg-white px-2 py-0.5 text-gray-80"
                    >
                      {service}
                    </span>
                  ))
                ) : (
                  <span className="font-b8 text-gray-40">없음</span>
                )}
              </div>
            ))}
          </CompareRow>

          <CompareRow title="위치">
            {selectedStudios.map((studio) => (
              <p
                key={`${studio.id}-location`}
                className="font-b8 min-w-0 truncate text-gray-60"
              >
                {studio.compareData.location}
              </p>
            ))}
          </CompareRow>

          <CompareRow title="예약 가능일">
            {selectedStudios.map((studio) => (
              <p
                key={`${studio.id}-reservation`}
                className="font-b8 min-w-0 truncate text-gray-60"
              >
                {studio.compareData.reservationDate}
              </p>
            ))}
          </CompareRow>

          <div className="px-5 py-5">
            <AddButton
              label="사진관 추가"
              subLabel="최대 3개까지 비교 가능해요"
              onClick={handleAddStudio}
            />
          </div>
        </section>
      </main>

      <footer className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[402px] border-t border-gray-10 bg-white">
        <div className="flex flex-col items-center pt-3">
          <div className="flex w-full gap-2 px-5">
            {selectedStudios.map((studio) => {
              const isSelected = selectedStudioId === studio.id

              return (
                <button
                  key={studio.id}
                  type="button"
                  aria-pressed={isSelected}
                  className={`flex h-[42px] min-w-0 flex-1 items-center justify-center rounded-lg border px-1 ${
                    isSelected
                      ? 'font-b7 border-brand-60 bg-[rgba(254,228,235,0.3)] text-brand-80'
                      : 'font-b8 border-gray-20 bg-white text-gray-40'
                  }`}
                  onClick={() => handleSelectStudio(studio.id)}
                >
                  <span className="truncate">{studio.name}</span>
                </button>
              )
            })}
          </div>

          <div className="w-full px-5 pt-[10px] pb-5">
            <Button
              variant={hasSelectedStudio ? 'primary' : 'disabled'}
              onClick={hasSelectedStudio ? handleConceptList : undefined}
            >
              컨셉목록 보러가기
            </Button>
          </div>
        </div>

        <HomeBar />
      </footer>
    </div>
  )
}

const CompareRow = ({ title, children }: CompareRowProps) => (
  <div className="flex w-full flex-col bg-[rgba(252,252,252,0.75)] py-[5px] shadow-[0px_15px_48px_0px_rgba(252,200,215,0.1)] backdrop-blur-[10px]">
    <div className="px-5 py-[5px]">
      <p className="font-b7 text-brand-100">{title}</p>
    </div>

    <div className="grid grid-cols-2 gap-4 px-5 py-[5px]">
      {children}
    </div>
  </div>
)

export default CompareTwoPage