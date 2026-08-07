import { useEffect, useRef, useState } from 'react'
import type { ComponentType, SVGProps } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router'

import CardPortfolioGrid from '@/components/cards/CardPortfolioGrid'
import ReviewZero from '@/components/common/ReviewZero'
import Toast from '@/components/common/Toast'
import {
  IcBeauty,
  IcClothing,
  IcError,
  IcParking,
  IcPin,
  IcRight,
  IcStar,
  IcWifi,
} from '@/components/icons'
import AppTabBar from '@/components/layout/AppTabBar'
import NavigationBar from '@/components/layout/NavigationBar'
import NavigationBarTransparent from '@/components/layout/NavigationBarTransparent'

import BottomSheet from '@/pages/studio/components/BottomSheet'
import ErrorNotice from '@/pages/studio/components/ErrorNotice'
import HairMakeupSheet from '@/pages/studio/components/HairMakeupSheet'
import ReviewCard from '@/pages/studio/components/ReviewCard'
import StudioDetailSkeleton from '@/pages/studio/components/StudioDetailSkeleton'
import StudioInfoSheet from '@/pages/studio/components/StudioInfoSheet'
import StudioLocationMap from '@/pages/studio/components/StudioLocationMap'
import { STUDIO_SERVICE_LABEL } from '@/constants/studioService'
import { useStudioDetail } from '@/hooks/useStudio'
import { saveRecentStudioView } from '@/services/studio'
import { addWishlist, removeWishlist } from '@/services/wishlist'
import { useAuthStore } from '@/stores/useAuthStore'
import type { StudioServiceCode } from '@/types/studio'

type OpenSheet = 'info' | 'hairmakeup' | null

const SERVICE_ICON: Record<StudioServiceCode, ComponentType<SVGProps<SVGSVGElement>>> = {
  WIFI: IcWifi,
  PARKING: IcParking,
  COSTUME: IcClothing,
  HAIR_MAKEUP: IcBeauty,
}


const stationLabel = (code: number) => {
  if (code >= 1 && code <= 9) return `${code}호선`
  if (code === 11) return '공항철도'
  if (code === 12) return '경의중앙선'
  if (code === 13) return '신분당선'
  return ''
}

const Bullet = ({ text }: { text: string }) => (
  <li className="flex items-start gap-1.5">
    <span className="mt-[7px] size-1 shrink-0 rounded-full bg-brand-100" />
    <span className="font-b8 text-gray-80">{text}</span>
  </li>
)

const Divider = () => <div className="h-1.5 w-full bg-gray-10" />

const StudioDetailPage = () => {
  const navigate = useNavigate()
  const { studioId } = useParams()
  const [searchParams] = useSearchParams()
  // 검색에서 고른 날짜. 상세는 쓰지 않고 컨셉 목록(C-7)까지 넘겨주기만 한다.
  const searchDate = searchParams.get('date')
  const { data: detail, isError, refetch } = useStudioDetail(studioId)
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const [openSheet, setOpenSheet] = useState<OpenSheet>(null)
  const [favorited, setFavorited] = useState(false)
  const [addressCopied, setAddressCopied] = useState(false)
  const [introExpanded, setIntroExpanded] = useState(false)
  const [introOverflow, setIntroOverflow] = useState(false)
  const introRef = useRef<HTMLParagraphElement>(null)

  // 상세 로드 시 서버의 찜 상태로 초기화 (토글은 handleToggleFavorite에서 위시리스트 API 호출)
  useEffect(() => {
    if (detail) setFavorited(detail.isWishlisted)
  }, [detail])

  // 로그인 사용자가 상세에 진입할 때만 최근 본 사진관으로 기록. 실패해도 화면엔 영향 없음.
  useEffect(() => {
    if (!isLoggedIn || !studioId) return
    saveRecentStudioView(studioId).catch(() => {})
  }, [isLoggedIn, studioId])

  // 소개 글이 3줄을 넘길 때만 더보기/접기 버튼 노출
  // (펼친 상태에서는 clamp가 풀려 측정이 불가하므로 접힌 상태에서만 측정)
  useEffect(() => {
    const el = introRef.current
    if (!el || introExpanded) return

    let alive = true
    const measure = () => {
      if (alive) setIntroOverflow(el.scrollHeight > el.clientHeight + 1)
    }

    measure()
    document.fonts?.ready.then(measure)

    const observer = new ResizeObserver(measure)
    observer.observe(el)

    return () => {
      alive = false
      observer.disconnect()
    }
  }, [detail?.introduction, introExpanded])

  const closeSheet = () => setOpenSheet(null)
  const goToReviews = () => navigate(`/studios/${studioId}/reviews`)
  const goToConcepts = () =>
    navigate(
      searchDate
        ? `/studios/${studioId}/concepts?date=${searchDate}`
        : `/studios/${studioId}/concepts`,
    )

  const fullAddress = detail?.location.address ?? ''

  const handleToggleFavorite = async () => {
    if (!studioId) return

    const next = !favorited
    setFavorited(next)
    try {
      if (next) {
        await addWishlist(Number(studioId))
      } else {
        await removeWishlist(Number(studioId))
      }
    } catch {
      setFavorited(!next)
    }
  }

  const handleCopyAddress = () => {
    if (!fullAddress) return
    navigator.clipboard
      ?.writeText(fullAddress)
      .then(() => {
        setAddressCopied(true)
        setTimeout(() => setAddressCopied(false), 2000)
      })
      .catch(() => {})
  }

  if (isError) {
    return (
      <div className="flex min-h-dvh flex-col bg-white">
        <NavigationBar variant="default" showRight={false} onBack={() => navigate(-1)} />
        <div className="flex flex-1 items-center justify-center">
          <ErrorNotice
            icon={<IcError width={48} height={48} className="text-brand-80" />}
            title="정보를 불러오지 못했어요"
            onRetry={() => refetch()}
          />
        </div>
        <AppTabBar activeTab="search" />
      </div>
    )
  }

  if (!detail) {
    return (
      // 로드 후 레이아웃과 같은 컨테이너를 써야 데이터 도착 시 흔들리지 않는다.
      <div className="relative flex min-h-dvh flex-col bg-white pb-24">
        <StudioDetailSkeleton onBack={() => navigate(-1)} />
      </div>
    )
  }

  const stationLine = [
    ...detail.location.stationLineCodes.map(stationLabel),
    detail.location.nearestStation,
  ]
    .filter(Boolean)
    .join(' · ')
  // 역·도보시간이 하나라도 없으면 "null 도보 null분"이 되므로 줄 자체를 숨긴다.
  const stationWalkText =
    detail.location.nearestStation !== null &&
    detail.location.walkingMinutes !== null
      ? `${detail.location.nearestStation} 도보 ${detail.location.walkingMinutes}분`
      : null
  // 이름 아래 요약 줄은 구까지만 보여준다. 전체 주소는 '위치 및 주변 정보'에 있다.
  const districtText = detail.location.district ?? ''
  const services = detail.serviceCodes.filter((code) => SERVICE_ICON[code])
  const infoBullets = [
    ...detail.studioInfo.operation,
    ...detail.studioInfo.parking,
    ...detail.studioInfo.shootingGuide,
    ...detail.studioInfo.refundGuide,
  ]
  const bestReview = detail.reviewSummary.previewReview
  const hasReviews = detail.reviewSummary.reviewCount > 0
  const avgRatingText =
    detail.reviewSummary.averageRating != null
      ? detail.reviewSummary.averageRating.toFixed(1)
      : '0.0'

  return (
    <div className="relative flex min-h-dvh flex-col bg-white pb-24">
      {/* 히어로 */}
      <div className="relative h-[302px] w-full shrink-0">
        <img
          src={detail.imageUrls[0] ?? undefined}
          alt={detail.studioName}
          className="size-full bg-gray-10 object-cover"
        />
        <div className="absolute inset-x-0 top-0">
          <NavigationBarTransparent
            isFavorited={favorited}
            onBack={() => navigate(-1)}
            onFavorite={handleToggleFavorite}
          />
        </div>
      </div>

      {/* 이름 / 위치 / 별점 */}
      <div className="px-5 py-3">
        <h1 className="py-2 font-h3 text-black">{detail.studioName}</h1>
        {(stationWalkText || districtText) && (
          <div className="flex items-center pb-1 font-b6 text-gray-60">
            <IcPin width={20} height={20} className="shrink-0 text-brand-100" />
            {stationWalkText && <span>{stationWalkText}</span>}
            {stationWalkText && districtText && <span className="px-1">|</span>}
            {districtText && <span>{districtText}</span>}
          </div>
        )}
        {/* 리뷰가 없으면 이동할 곳이 없어 링크로 두지 않는다. */}
        {hasReviews ? (
          <button
            type="button"
            onClick={goToReviews}
            className="flex items-center gap-0.5 pb-2"
          >
            <IcStar width={20} height={20} className="shrink-0 text-brand-100" />
            <span className="font-b7 text-black">{avgRatingText}</span>
            <span className="font-b8 text-gray-40">
              ({detail.reviewSummary.reviewCount}개 평가)
            </span>
            <IcRight width={20} height={20} className="shrink-0 text-gray-60" />
          </button>
        ) : (
          <div className="flex items-center gap-0.5 pb-2">
            <IcStar width={20} height={20} className="shrink-0 text-brand-100" />
            <span className="font-b8 text-gray-40">리뷰가 아직 없습니다</span>
            <IcRight width={20} height={20} className="shrink-0 text-gray-20" />
          </div>
        )}
      </div>

      <Divider />

      {/* 촬영 컨셉 */}
      <section className="px-5 pb-5">
        <h2 className="pb-3 pt-5 font-b3 text-black">촬영 컨셉</h2>
        <CardPortfolioGrid
          className="grid w-full grid-cols-2 gap-2"
          items={detail.representativeProducts.map((product) => ({
            imageSrc: product.thumbnailUrl,
            title: product.productName,
            price: `₩${product.price.toLocaleString()}~`,
          }))}
        />
        <button
          type="button"
          onClick={goToConcepts}
          className="mt-5 flex w-full items-center justify-center rounded-lg border border-brand-100 px-5 py-3"
        >
          <span className="flex-1 text-center font-b3 text-brand-100">모든 컨셉 보기</span>
          <IcRight width={24} height={24} className="text-brand-100" />
        </button>
      </section>

      <Divider />

      {/* 편의시설 및 서비스 */}
      <section className="px-5">
        <div className="flex items-center pb-3 pt-5">
          <h2 className="flex-1 font-b3 text-black">편의시설 및 서비스</h2>
        </div>
        <div className="flex items-center justify-around pb-5">
          {services.map((code) => {
            const Icon = SERVICE_ICON[code]
            return (
              <div
                key={code}
                className="flex h-[48px] w-[68px] flex-col items-center justify-center gap-1"
              >
                <Icon width={24} height={24} className="text-brand-100" />
                <span className="whitespace-nowrap font-b10 text-gray-60">
                  {STUDIO_SERVICE_LABEL[code]}
                </span>
              </div>
            )
          })}
        </div>
      </section>

      <Divider />

      {/* 위치 및 주변 정보 */}
      <section className="px-5">
        <h2 className="pb-3 pt-5 font-b3 text-black">위치 및 주변 정보</h2>
        <StudioLocationMap
          latitude={detail.location.latitude}
          longitude={detail.location.longitude}
          studioName={detail.studioName}
        />
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center">
            <IcPin width={20} height={20} className="shrink-0 text-brand-100" />
            <span className="font-b4 text-black">{fullAddress}</span>
          </div>
          <button
            type="button"
            onClick={handleCopyAddress}
            className="shrink-0 font-b8 text-brand-100"
          >
            주소 복사
          </button>
        </div>
        <ul className="flex flex-col gap-1 pb-5">
          {stationWalkText && <Bullet text={stationWalkText} />}
          {stationLine && <Bullet text={stationLine} />}
        </ul>
      </section>

      <Divider />

      {/* 사진관 소개 */}
      {detail.introduction && (
        <>
          <section className="px-5 pb-5">
            <h2 className="pb-3 pt-5 font-b3 text-black">사진관 소개</h2>
            <p ref={introRef} className={`font-b6 text-gray-80${introExpanded ? '' : ' line-clamp-3'}`}>
              {detail.introduction}
            </p>
            {introOverflow && (
              <button
                type="button"
                onClick={() => setIntroExpanded((prev) => !prev)}
                aria-expanded={introExpanded}
                className="mt-5 flex w-full items-center justify-center rounded-lg border border-brand-100 px-5 py-3 font-b3 text-brand-100"
              >
                {introExpanded ? '접기' : '더보기'}
              </button>
            )}
          </section>

          <Divider />
        </>
      )}

      {/* 공지사항 */}
      {detail.notice && (
        <>
          <section className="px-5 py-5">
            <h2 className="pb-3 font-b3 text-black">공지사항</h2>
            <div className="rounded-xl bg-brand-20 px-3 py-2">
              <p className="py-2 font-b7 text-black">{detail.notice.title}</p>
              <ul className="flex flex-col gap-1 pb-1">
                {detail.notice.items.map((line, index) => (
                  <Bullet key={index} text={line} />
                ))}
              </ul>
            </div>
          </section>

          <Divider />
        </>
      )}

      {/* 사진관 이용 정보 */}
      <section className="px-5 py-5">
        <button
          type="button"
          onClick={() => setOpenSheet('info')}
          className="flex w-full items-center pb-3"
        >
          <h2 className="flex-1 text-left font-b3 text-black">사진관 이용 정보</h2>
          <IcRight width={24} height={24} className="text-gray-40" />
        </button>
        <ul className="flex flex-col gap-1">
          {infoBullets.map((line, index) => (
            <Bullet key={index} text={line} />
          ))}
        </ul>
      </section>

      <Divider />

      {/* 헤어메이크업 연계 */}
      <section className="px-5 py-5">
        <button
          type="button"
          onClick={() => setOpenSheet('hairmakeup')}
          className="flex w-full items-center pb-3"
        >
          <h2 className="flex-1 text-left font-b3 text-black">헤어메이크업 연계</h2>
          <IcRight width={24} height={24} className="text-gray-40" />
        </button>
        <p className="font-b6 text-gray-80">
          제휴 헤어메이크업샵 {detail.hairMakeupPartnerCount}곳
        </p>
      </section>

      <Divider />

      {/* 리뷰 요약. 리뷰가 없으면 평점 대신 진입점만 보여준다. */}
      {hasReviews ? (
        <section className="px-5 py-5">
          <button
            type="button"
            onClick={goToReviews}
            className="flex w-full items-center pb-4"
          >
            <IcStar width={20} height={20} className="shrink-0 text-brand-80" />
            <span className="flex-1 pl-1 text-left">
              <span className="font-b3 text-black">{avgRatingText}</span>
              <span className="pl-1 font-b6 text-gray-60">
                ({detail.reviewSummary.reviewCount}개 평가)
              </span>
            </span>
            <IcRight width={24} height={24} className="text-gray-40" />
          </button>
          {bestReview && (
            <ReviewCard
              reviewerName={bestReview.writerNickname}
              isBest={bestReview.isBest}
              rating={bestReview.rating}
              date={bestReview.createdAt ? bestReview.createdAt.slice(0, 10).replaceAll('-', '.') : ''}
              body={bestReview.content}
              photos={bestReview.imageUrls}
            />
          )}
        </section>
      ) : (
        <ReviewZero />
      )}

      <Divider />

      {/* 판매자 고지 */}
      <section className="px-5 py-5">
        <p className="font-b8 text-gray-40">
          통신판매중개자로서 PICDAY는 거래 당사자가 아니며, 예약·이용·환불 관련 책임은 각
          사진관에 있습니다.
        </p>
      </section>

      {/* 하단 고정 CTA */}
      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto flex max-w-[390px] justify-center bg-white p-5">
        <button
          type="button"
          onClick={goToConcepts}
          className="flex h-12 w-full items-center justify-center rounded-lg bg-brand-100 font-b5 text-white"
        >
          모든 컨셉 보기
        </button>
      </div>

      {addressCopied && (
        <div className="fixed inset-x-0 bottom-24 z-40 mx-auto flex max-w-[390px] justify-center px-5">
          <Toast message="주소가 복사되었어요" />
        </div>
      )}

      {openSheet === 'info' && (
        <BottomSheet dim onClose={closeSheet}>
          <StudioInfoSheet sections={infoBullets} onClose={closeSheet} />
        </BottomSheet>
      )}
      {openSheet === 'hairmakeup' && (
        <BottomSheet dim onClose={closeSheet}>
          <HairMakeupSheet studioId={studioId ?? ''} onClose={closeSheet} />
        </BottomSheet>
      )}
    </div>
  )
}

export default StudioDetailPage
