import {
  apiGet,
  apiPatch,
  apiPost,
} from '@/services/client'

export type PaymentMethod =
  | 'KAKAOPAY'
  | 'NAVERPAY'
  | 'TOSSPAY'
  | 'TRANSFER'
  | 'CARD'

export type ReservationStatus =
  | 'RESERVED'
  | 'COMPLETED'
  | 'CANCELED'

/**
 * 3-1. 예약 생성
 * POST /api/v1/reservations
 */
export interface CreateReservationRequest {
  studioId: number
  studioProductId: number
  timeSlotId: number
  reserveeName: string
  reserveePhone: string
  paymentMethod: PaymentMethod
  agreedTermIds: number[]
}

export interface CreateReservationData {
  reservationId: number
  status: 'RESERVED'
  totalPrice: number
  createdAt: string
}

export const createReservation = (
  body: CreateReservationRequest,
): Promise<CreateReservationData> =>
  apiPost<CreateReservationData>(
    '/api/v1/reservations',
    body,
  )

/**
 * 3-2. 예약 취소
 * PATCH /api/v1/reservations/{reservationId}/cancel
 */
export interface CancelReservationData {
  reservationId: number
  status: 'CANCELED'
  canceledAt: string
}

export const cancelReservation = (
  reservationId: string | number,
): Promise<CancelReservationData> =>
  apiPatch<CancelReservationData>(
    `/api/v1/reservations/${reservationId}/cancel`,
  )

/**
 * 3-3. 내 예약 내역 목록 조회
 * GET /api/v1/reservations
 */
export interface ReservationListItem {
  reservationId: number
  studioName: string
  conceptName: string
  reservationDate: string
  reservationTime: string
  totalPrice: number
  status: ReservationStatus
}

export const getMyReservations = (
  status?: ReservationStatus,
): Promise<ReservationListItem[]> =>
  apiGet<ReservationListItem[]>(
    '/api/v1/reservations',
    status
      ? {
          status,
        }
      : undefined,
  )

/**
 * 3-4. 예약 상세 조회
 * GET /api/v1/reservations/{reservationId}
 */
export interface ReservationDetailData {
  reservationId: number
  status: ReservationStatus
  reserveeName: string
  reserveePhone: string
  totalPrice: number

  studio: {
    id: number
    name: string
  }

  studioProduct: {
    id: number
    name: string
    price: number
  }

  timeSlot: {
    date: string
    startTime: string
    endTime: string
  }

  checklist: string[]
  reviewId: number | null
  createdAt: string
  canceledAt: string | null
}

export const getReservationDetail = (
  reservationId: string | number,
): Promise<ReservationDetailData> =>
  apiGet<ReservationDetailData>(
    `/api/v1/reservations/${reservationId}`,
  )