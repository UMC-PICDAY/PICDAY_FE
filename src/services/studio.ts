// 홈(2-1)·자동완성(2-2)은 PICDAY_API_Spec.md 확정본 기준 (김이준 담당분)
// 비교(2-9, 2-10)는 전지혜 담당분. 검색·상세·상품·슬롯·헤어메이크업(2-3~2-8)은 남현준 담당분.
import { apiGet, withMockFallback } from '@/services/client'
import type {
  AutocompleteResult,
  HairMakeupData,
  HomeResult,
  StudioDetail,
  StudioProductDetail,
  StudioProductsData,
  StudioProductsParams,
  StudioSearchParams,
  StudioSearchResult,
  StudioTimeSlot,
} from '@/types/studio'

import cardImage1 from '@/assets/images/CardImage1.png'
import cardImage2 from '@/assets/images/CardImage2.png'
import cardImage3 from '@/assets/images/CardImage3.png'
import cardImage4 from '@/assets/images/CardImage4.png'
import cardImage5 from '@/assets/images/CardImage5.png'
import cardImage6 from '@/assets/images/CardImage6.png'
import cardImage7 from '@/assets/images/CardImage7.png'

// ===== 2-1. 홈 / 2-2. 자동완성 (김이준) =====

// 백엔드 미배포 데모용 mock — services/client.ts의 withMockFallback 참고
const MOCK_HOME_DATA: HomeResult = {
  bannerStudios: [
    { studioId: 1, studioName: '데이지 스튜디오', thumbnailUrl: cardImage1, locationCategory: '홍대' },
    { studioId: 2, studioName: '타임온미 스튜디오', thumbnailUrl: cardImage2, locationCategory: '강남' },
    { studioId: 3, studioName: '무드바이 스튜디오', thumbnailUrl: cardImage3, locationCategory: '성수' },
  ],
  popularStudios: [
    { studioId: 4, studioName: '스펙플렉스', thumbnailUrl: cardImage4, locationCategory: '연남', minPrice: 55000, rating: 4.9 },
    { studioId: 5, studioName: '보노 스튜디오', thumbnailUrl: cardImage5, locationCategory: '홍대', minPrice: 30000, rating: 4.8 },
    { studioId: 6, studioName: '포토그래피 by J', thumbnailUrl: cardImage6, locationCategory: '건대', minPrice: 70000, rating: 4.7 },
  ],
  regionalStudios: {
    locationCategory: '홍대',
    studios: [
      { studioId: 7, studioName: '데이지 포토 홍대', thumbnailUrl: cardImage7, locationCategory: '홍대', minPrice: 45000, rating: 4.9 },
      { studioId: 1, studioName: '데이지 스튜디오', thumbnailUrl: cardImage1, locationCategory: '홍대', minPrice: 55000, rating: 4.9 },
    ],
  },
}

export const getHome = () =>
  withMockFallback(() => apiGet<HomeResult>('/api/v1/home'), MOCK_HOME_DATA)

const MOCK_AUTOCOMPLETE_DATA: AutocompleteResult = {
  keyword: '',
  suggestions: [
    { studioId: 1, studioName: '데이지 스튜디오', locationCategory: '홍대' },
    { studioId: 7, studioName: '데이지 포토 홍대', locationCategory: '홍대' },
  ],
}

export const autocompleteStudios = (keyword: string) =>
  withMockFallback(
    () => apiGet<AutocompleteResult>('/api/v1/studios/autocomplete', { keyword }),
    { ...MOCK_AUTOCOMPLETE_DATA, keyword },
  )

// ===== 2-3 ~ 2-8. 사진관 검색/상세/상품/슬롯/헤어메이크업 (남현준) =====

// 백엔드 미배포 데모용 mock — services/client.ts의 withMockFallback 참고
const MOCK_SEARCH_STUDIO = {
  studioId: 1,
  studioName: '데이지 스튜디오',
  thumbnailUrls: [cardImage1, cardImage2],
  locationCategory: '홍대',
  latitude: 37.5563,
  longitude: 126.9236,
  minPrice: 55000,
  rating: 4.9,
  reviewCount: 128,
  shootingCategory: ['PROFILE', 'PERSONAL_PORTRAIT'],
  serviceTags: ['HAIR_MAKEUP', 'PARKING'],
  isWishlisted: false,
  productSummaries: [
    { productId: 1, productName: '프로필 기본', shootingCategory: 'PROFILE', price: 55000 },
  ],
}

export const searchStudios = (
  params: StudioSearchParams,
): Promise<StudioSearchResult> =>
  withMockFallback(() => apiGet<StudioSearchResult>('/api/v1/studios/search', params), {
    totalCount: 1,
    appliedFilters: {
      location: params.location ?? null,
      date: params.date ?? null,
      concept: params.concept ?? [],
      name: params.name ?? null,
      sort: params.sort ?? null,
      minPrice: params.minPrice ?? null,
      maxPrice: params.maxPrice ?? null,
      serviceTags: params.service ?? [],
      minRating: params.minRating ?? null,
    },
    studios: [MOCK_SEARCH_STUDIO],
  })

// 2-4. 사진관 상세
const MOCK_STUDIO_DETAIL: StudioDetail = {
  studioId: 1,
  studioName: '데이지 스튜디오',
  thumbnailUrl: cardImage1,
  isWishlisted: false,
  locationCategory: '홍대',
  mainAddress: '서울 마포구',
  subAddress: '동교동 (홍대입구)',
  latitude: 37.5563,
  longitude: 126.9236,
  nearestStation: '홍대입구역',
  walkingMinute: 5,
  stationDetail: [2, 11, 12],
  conceptPreview: [
    { productId: 1, productName: '개인화보', thumbnailUrl: cardImage2, price: 55000, isMinPrice: true },
    { productId: 2, productName: '프로필', thumbnailUrl: cardImage3, price: 70000, isMinPrice: false },
  ],
  studioService: [
    { serviceCode: 'HAIR_MAKEUP', serviceName: '헤어·메이크업' },
    { serviceCode: 'PARKING', serviceName: '주차' },
    { serviceCode: 'COSTUME', serviceName: '의상 비치' },
    { serviceCode: 'WIFI', serviceName: '와이파이' },
  ],
  hairMakeupPartnersCount: 4,
  introduction:
    '홍대 감성의 자연광 셀프/개인화보 전문 스튜디오입니다. 넓은 촬영 공간과 다양한 컨셉존을 갖추고 있어 원하는 분위기의 사진을 남길 수 있습니다.',
  notice: '예약 변경은 촬영 3일 전까지 가능합니다.',
  studioInfo: [
    { infoSectionId: 1, content: '운영시간: 매일 12:00 - 20:00\n휴무일: 연중무휴' },
    { infoSectionId: 2, content: '건물 내 주차 가능, 2시간 무료' },
  ],
  review: {
    summary: { avgRating: 4.9, totalCount: 721, photoReviewCount: 200 },
    page: 1,
    size: 10,
    items: [],
  },
}

export const getStudioDetail = (studioId: string): Promise<StudioDetail> =>
  withMockFallback(
    () => apiGet<StudioDetail>(`/api/v1/studios/${studioId}`),
    { ...MOCK_STUDIO_DETAIL, studioId: Number(studioId) || MOCK_STUDIO_DETAIL.studioId },
  )

// 2-5. 컨셉(상품) 목록 조회
export const getStudioProducts = (
  studioId: string,
  params?: StudioProductsParams,
): Promise<StudioProductsData> =>
  withMockFallback(
    () => apiGet<StudioProductsData>(`/api/v1/studios/${studioId}/products`, params),
    {
      studioId: Number(studioId) || 1,
      studioName: '데이지 스튜디오',
      selectedDate: params?.date ?? null,
      selectedTime: params?.time ?? null,
      productGroups: [
        {
          shootingCategory: 'PERSONAL_PORTRAIT',
          products: [
            {
              productId: 1,
              productName: '체리베리벌쓰데이',
              imageUrls: cardImage2,
              imageCount: 8,
              price: 70000,
              basePeople: 1,
              shortDescription: '자연광 스튜디오 · 의상 무료대여 · 보정본 2매 · 약 40분',
              description: '체리베리벌쓰데이 컨셉 촬영 상품입니다.',
              isAvailable: params?.date && params?.time ? true : null,
            },
          ],
        },
        {
          shootingCategory: 'PROFILE',
          products: [
            {
              productId: 3,
              productName: '프로필 기본',
              imageUrls: cardImage3,
              imageCount: 6,
              price: 55000,
              basePeople: 1,
              shortDescription: '기본 프로필 · 보정본 1매',
              description: '프로필 기본 촬영 상품입니다.',
              isAvailable: params?.date && params?.time ? true : null,
            },
          ],
        },
      ],
    },
  )

// 2-6. 컨셉 사진 상세
export const getStudioProductDetail = (
  studioId: string,
  productId: string,
): Promise<StudioProductDetail> =>
  withMockFallback(
    () =>
      apiGet<StudioProductDetail>(
        `/api/v1/studios/${studioId}/products/${productId}`,
      ),
    {
      studioId: Number(studioId) || 1,
      studioName: '데이지 스튜디오',
      imageList: [cardImage1, cardImage2, cardImage3],
    },
  )

// 2-7. 예약 가능 시간 조회
export const getStudioSlots = (
  studioId: string,
  date: string,
): Promise<StudioTimeSlot[]> =>
  withMockFallback(
    () => apiGet<StudioTimeSlot[]>(`/api/v1/studios/${studioId}/slots`, { date }),
    [
      { slotId: '1', startTime: '10:00', endTime: '11:00', isAvailable: true },
      { slotId: '2', startTime: '11:00', endTime: '12:00', isAvailable: false },
      { slotId: '3', startTime: '14:00', endTime: '15:00', isAvailable: true },
    ],
  )

// 2-8. 헤어메이크업 연계 상세
export const getStudioHairMakeup = (studioId: string): Promise<HairMakeupData> =>
  withMockFallback(
    () => apiGet<HairMakeupData>(`/api/v1/studios/${studioId}/hairMakeupDetail`),
    {
      studioId: Number(studioId) || 1,
      hairMakeupList: [
        { studioServiceId: 1, partnerName: '뷰티스튜디오 홍대점', additionalPrice: 30000, displayOrder: 1 },
        { studioServiceId: 2, partnerName: '메이크업 온 홍대', additionalPrice: 25000, displayOrder: 2 },
      ],
    },
  )

// ===== 2-9. 비교 목적 / 2-10. 비교 결과 (전지혜) =====

export type ShootingCategory =
  | 'ID_PHOTO'
  | 'PROFILE'
  | 'PERSONAL_PORTRAIT'
  | 'JOB_PHOTO'
  | 'FAMILY'
  | 'FRIENDSHIP'

export interface ComparePurposeStudio {
  studioId: number
  studioName: string
  shootingCategories: ShootingCategory[]
}

export interface ComparePurposeResponse {
  studios: ComparePurposeStudio[]
}

export interface CompareResultParams {
  studioIds: number[]
  shootingCategory: ShootingCategory
}

export interface CompareProductInformation {
  price: number
  isMine: boolean
  comparisonSummary: string
  hasAdditionalPrice: boolean
}

export interface CompareStudioLocation {
  locationCategory: string
  nearestStation: string
  walkingMinutes: number
}

export interface CompareResultStudio {
  studioId: number
  studioName: string
  thumbnailUrl: string
  rating: number
  reviewCount: number
  productsInformation: CompareProductInformation
  serviceTags: string[]
  location: CompareStudioLocation
  earliestReservationDate: string
}

export interface CompareResultResponse {
  shootingCategory: ShootingCategory
  shootingCategoryName: string
  studios: CompareResultStudio[]
}

export const getComparePurposes = (studioIds: number[]) => {
  const searchParams = new URLSearchParams()

  studioIds.forEach((studioId) => {
    searchParams.append('studioIds', String(studioId))
  })

  const mockResult: ComparePurposeResponse = {
    studios: studioIds.map((studioId) => ({
      studioId,
      studioName: `데이지 스튜디오 ${studioId}`,
      shootingCategories: ['PROFILE', 'PERSONAL_PORTRAIT'],
    })),
  }

  return withMockFallback(
    () =>
      apiGet<ComparePurposeResponse>(
        `/api/v1/studios/compare?${searchParams.toString()}`,
      ),
    mockResult,
  )
}

export const getCompareResult = ({
  studioIds,
  shootingCategory,
}: CompareResultParams) => {
  const searchParams = new URLSearchParams()

  studioIds.forEach((studioId) => {
    searchParams.append('studioIds', String(studioId))
  })

  searchParams.append('shootingCategory', shootingCategory)

  const mockResult: CompareResultResponse = {
    shootingCategory,
    shootingCategoryName: '프로필',
    studios: studioIds.map((studioId, index) => ({
      studioId,
      studioName: `데이지 스튜디오 ${studioId}`,
      thumbnailUrl: [cardImage1, cardImage2, cardImage3][index % 3],
      rating: 4.8,
      reviewCount: 120,
      productsInformation: {
        price: 55000 + index * 10000,
        isMine: index === 0,
        comparisonSummary: index === 0 ? '가장 저렴해요' : '평균보다 비싸요',
        hasAdditionalPrice: false,
      },
      serviceTags: ['HAIR_MAKEUP', 'PARKING'],
      location: {
        locationCategory: '홍대',
        nearestStation: '홍대입구역',
        walkingMinutes: 5,
      },
      earliestReservationDate: '2026-08-01',
    })),
  }

  return withMockFallback(
    () =>
      apiGet<CompareResultResponse>(
        `/api/v1/studios/compare/result?${searchParams.toString()}`,
      ),
    mockResult,
  )
}
