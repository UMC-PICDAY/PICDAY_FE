// PICDAY_API_1st.pdf 기준 path만 확정, Request/Response DTO는 미정
import { apiGet, apiPatch, apiPost } from '@/services/client'

export const createReservation = (body: unknown) =>
  apiPost<unknown>('/api/v1/reservations', body)

export const cancelReservation = (reservationId: string) =>
  apiPatch<unknown>(`/api/v1/reservations/${reservationId}/cancel`)

export const getReservationDetail = (reservationId: string) =>
  apiGet<unknown>(`/api/v1/reservations/${reservationId}`)

export const getMyReservations = () => apiGet<unknown>('/api/v1/reservations')
