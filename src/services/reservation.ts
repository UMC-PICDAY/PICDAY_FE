import {
  apiGet,
  apiPatch,
  apiPost,
  withMockFallback,
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
  | 'CANCELLED'

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
  withMockFallback(
    () => apiPost<CreateReservationData>('/api/v1/reservations', body),
    {
      reservationId: 1,
      status: 'RESERVED',
      totalPrice: 55000,
      createdAt: new Date().toISOString(),
    },
  )

/**
 * 3-2. 예약 취소
 * PATCH /api/v1/reservations/{reservationId}/cancel
 */
export interface CancelReservationData {
  reservationId: number
  status: 'CANCELLED'
  canceledAt: string
}

export const cancelReservation = (
  reservationId: string | number,
): Promise<CancelReservationData> =>
  withMockFallback(
    () =>
      apiPatch<CancelReservationData>(
        `/api/v1/reservations/${reservationId}/cancel`,
      ),
    {
      reservationId: Number(reservationId) || 1,
      status: 'CANCELLED',
      canceledAt: new Date().toISOString(),
    },
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
  reviewId: number | null
}

const MOCK_RESERVATION_LIST: ReservationListItem[] = [
  {
    reservationId: 1,
    studioName: '데이지 스튜디오',
    conceptName: '체리베리벌쓰데이',
    reservationDate: '2026-08-01',
    reservationTime: '14:00',
    totalPrice: 55000,
    status: 'RESERVED',
    reviewId: null,
  },
  {
    reservationId: 2,
    studioName: '보노 스튜디오',
    conceptName: '프로필 기본',
    reservationDate: '2026-06-10',
    reservationTime: '11:00',
    totalPrice: 30000,
    status: 'COMPLETED',
    reviewId: null,
  },
]

export const getMyReservations = (
  status?: ReservationStatus,
): Promise<ReservationListItem[]> =>
  withMockFallback(
    () =>
      apiGet<ReservationListItem[]>(
        '/api/v1/reservations',
        status
          ? {
              status,
            }
          : undefined,
      ),
    status
      ? MOCK_RESERVATION_LIST.filter((item) => item.status === status)
      : MOCK_RESERVATION_LIST,
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
  reviewId: number | null
  checklist: string[]
  createdAt: string
  canceledAt?: string | null
}

export const getReservationDetail = (
  reservationId: string | number,
): Promise<ReservationDetailData> =>
  withMockFallback(
    () =>
      apiGet<ReservationDetailData>(
        `/api/v1/reservations/${reservationId}`,
      ),
    {
      reservationId: Number(reservationId) || 1,
      status: 'RESERVED',
      reserveeName: '이수현',
      reserveePhone: '01012345678',
      totalPrice: 55000,
      studio: { id: 1, name: '데이지 스튜디오' },
      studioProduct: { id: 1, name: '체리베리벌쓰데이', price: 55000 },
      timeSlot: { date: '2026-08-01', startTime: '14:00', endTime: '15:00' },
      reviewId: null,
      checklist: ['예약 시간 10분 전까지 도착해주세요.', '촬영 3일 전까지 변경/취소가 가능합니다.'],
      createdAt: new Date().toISOString(),
    },
  )