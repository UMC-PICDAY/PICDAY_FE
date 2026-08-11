/**
 * CompareTwoPage 사용법
 *
 * 사진관 2개의 가격, 서비스, 위치, 예약 가능일을 비교하는 페이지
 *
 * 진입 시 navigation state
 *   {
 *     studioIds: string[]
 *     shootingCategory: ShootingCategory
 *     studios: NavigationStudio[]
 *   }
 *
 * 초기 로드
 *   studioIds와 shootingCategory로 비교 결과 조회 API 호출
 *   API 응답을 화면 비교 데이터로 변환하여 렌더링
 *
 * 비교 로직은 useCompareResult 훅에서 CompareThreePage와 공유한다.
 */

import CompareSkeleton from '@/pages/compare/components/CompareSkeleton'
import CompareRow from '@/pages/compare/components/CompareRow'
import CardStudioCompare from '@/components/cards/CardStudioCompare'
import AddButton from '@/components/common/AddButton'
import Button from '@/components/common/Button'
import NavigationBar from '@/components/layout/NavigationBar'
import { getShootingCategoryLabel } from '@/constants/shootingCategory'
import { useCompareResult } from '@/pages/compare/hooks/useCompareResult'

const CompareTwoPage = () => {
  const {
    selectedStudios,
    selectedStudioId,
    isLoading,
    errorMessage,
    shootingCategory,
    isConceptButtonDisabled,
    handleBack,
    handleClose,
    handleStudioDetail,
    handleSelectStudio,
    handleDeleteStudio,
    handleAddStudio,
    handleConceptList,
  } = useCompareResult(2)

  return (
    <div className="relative mx-auto min-h-dvh w-full max-w-[402px] overflow-x-hidden bg-white">
      <div className="sticky top-0 z-20 bg-white">
        <NavigationBar
          title="사진관 비교"
          onBack={handleBack}
          onClose={handleClose}
        />
      </div>

      <main className="pb-[166px]">
        {isLoading ? (
          <CompareSkeleton count={2} />
        ) : errorMessage ? (
          <div
            className="flex min-h-[200px] items-center justify-center px-5"
            role="alert"
          >
            <p className="font-b6 text-center text-gray-40">
              {errorMessage}
            </p>
          </div>
        ) : (
          <>
            <section className="flex w-full items-center justify-between gap-4 px-5 py-[10px]">
              {selectedStudios.map((studio) => (
                <CardStudioCompare
                  key={studio.id}
                  size="default"
                  imageSrc={studio.imageSrc}
                  name={studio.name}
                  rating={studio.rating}
                  reviewCount={studio.reviewCount}
                  onClick={() =>
                    handleStudioDetail(studio.id)
                  }
                  onDelete={() =>
                    handleDeleteStudio(studio.id)
                  }
                />
              ))}
            </section>

            <section className="flex w-full flex-col gap-3">
              <div className="flex w-full flex-col bg-[rgba(252,252,252,0.75)] shadow-[0px_15px_48px_0px_rgba(252,200,215,0.1)] backdrop-blur-[10px]">
                <div className="px-5 py-[10px]">
                  <p className="font-b7 text-brand-100">
                    비교하는 컨셉
                  </p>

                  <p className="font-cap3 text-gray-40">
                    {shootingCategory
                      ? getShootingCategoryLabel(shootingCategory)
                      : '프로필'}
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
                        {
                          studio.compareData
                            .description
                        }
                      </p>

                      {studio.compareData
                        .badgeLabel && (
                        <span className="font-cap3 flex h-[22px] items-center justify-center rounded-full border border-gray-10 bg-brand-20 px-1.5 py-0.5 text-gray-60">
                          {
                            studio.compareData
                              .badgeLabel
                          }
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <CompareRow title="연계 서비스" columns={2}>
                {selectedStudios.map((studio) => (
                  <div
                    key={`${studio.id}-services`}
                    className="flex min-w-0 flex-wrap items-center gap-[5px]"
                  >
                    {studio.compareData.services
                      .length > 0 ? (
                      studio.compareData.services.map(
                        (service) => (
                          <span
                            key={service}
                            className="font-cap3 flex h-[22px] items-center justify-center rounded-full border border-gray-10 bg-white px-2 py-0.5 text-gray-80"
                          >
                            {service}
                          </span>
                        ),
                      )
                    ) : (
                      <span className="font-b8 text-gray-40">
                        없음
                      </span>
                    )}
                  </div>
                ))}
              </CompareRow>

              <CompareRow title="위치" columns={2}>
                {selectedStudios.map((studio) => (
                  <p
                    key={`${studio.id}-location`}
                    className="font-b8 min-w-0 truncate text-gray-60"
                  >
                    {studio.compareData.location}
                  </p>
                ))}
              </CompareRow>

              <CompareRow title="예약 가능일" columns={2}>
                {selectedStudios.map((studio) => (
                  <p
                    key={`${studio.id}-reservation`}
                    className="font-b8 min-w-0 truncate text-gray-60"
                  >
                    {
                      studio.compareData
                        .reservationDate
                    }
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
          </>
        )}
      </main>

      <footer className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[402px] border-t border-gray-10 bg-white">
        <div className="flex flex-col items-center pt-3">
          <div className="flex w-full gap-2 px-5">
            {selectedStudios.map((studio) => {
              const isSelected =
                selectedStudioId === studio.id

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
                  onClick={() =>
                    handleSelectStudio(studio.id)
                  }
                >
                  <span className="truncate">
                    {studio.name}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="w-full px-5 pt-[10px] pb-5">
            <Button
              variant={
                isConceptButtonDisabled
                  ? 'disabled'
                  : 'primary'
              }
              onClick={
                isConceptButtonDisabled
                  ? undefined
                  : handleConceptList
              }
            >
              컨셉목록 보러가기
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default CompareTwoPage
