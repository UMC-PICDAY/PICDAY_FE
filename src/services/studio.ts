// PICDAY_API_1st.pdf 기준 path만 확정, Response DTO는 미정 (다음 주 확정 후 unknown -> 실제 타입으로 교체)
import { apiGet } from '@/services/client'

export interface StudioSearchParams {
  name?: string
  location?: string
  date?: string
  concept?: string
  minPrice?: number
  maxPrice?: number
  service?: string[]
  minRating?: number
}

export const getHome = () => apiGet<unknown>('/api/v1/home')

export const autocompleteStudios = (keyword: string) =>
  apiGet<unknown>('/api/v1/studios/autocomplete', { keyword })

export const searchStudios = (params: StudioSearchParams) =>
  apiGet<unknown>('/api/v1/studios/search', params)

export const getStudioDetail = (studioId: string) =>
  apiGet<unknown>(`/api/v1/studios/${studioId}`)

export const getStudioConcepts = (studioId: string) =>
  apiGet<unknown>(`/api/v1/studios/${studioId}/concepts`)

export const getStudioConceptDetail = (studioId: string, conceptId: string) =>
  apiGet<unknown>(`/api/v1/studios/${studioId}/concepts/${conceptId}`)

export const getStudioSlots = (studioId: string) =>
  apiGet<unknown>(`/api/v1/studios/${studioId}/slots`)
