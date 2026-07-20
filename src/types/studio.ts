// PICDAY_API_Spec.md 기준. 홈(2-1)·자동완성(2-2) 응답만 우선 정의 (김이준 담당분) — 나머지 Studio 타입은 남현준이 추가 예정
export interface StudioSummary {
  studioId: number
  studioName: string
  thumbnailUrl: string
  locationCategory: string
  minPrice: number
  rating: number
}

export interface BannerStudio {
  studioId: number
  studioName: string
  thumbnailUrl: string
  locationCategory: string
}

export interface HomeResult {
  bannerStudios: BannerStudio[]
  recentStudios?: StudioSummary[]
  popularStudios: StudioSummary[]
  regionalStudios: {
    locationCategory: string
    studios: StudioSummary[]
  }
}

export interface AutocompleteSuggestion {
  studioId: number
  studioName: string
  locationCategory: string
}

export interface AutocompleteResult {
  keyword: string
  suggestions: AutocompleteSuggestion[]
}
