import { useQuery } from '@tanstack/react-query'

import {
  getMyReservations,
  getReservationDetail,
} from '@/services/reservation'

export const myReservationsQueryKey = ['myReservations'] as const

export const useMyReservations = () =>
  useQuery({
    queryKey: myReservationsQueryKey,
    queryFn: () => getMyReservations(),
  })

export const reservationDetailQueryKey = (
  reservationId: string,
) => ['reservationDetail', reservationId] as const

// ReservationCompletePage/ReservationDetailPage/ReviewWritePage/
// ReservationCancelPage/CancelCompletePage가 각자 따로 부르던
// getReservationDetail을 공유 쿼리로 묶는다. 페치 실패 시 반응(그 자리에서
// 에러 UI를 보여줄지, /mypage로 돌려보낼지)은 화면마다 달라 호출부에서
// isError를 지켜보는 이펙트로 각자 처리한다 — enabled로 조건부 조회(예:
// CancelCompletePage가 location.state로 이미 데이터를 받았으면 스킵)만
// 이 훅에서 지원한다.
export const useReservationDetail = (
  reservationId: string | undefined,
  { enabled = true }: { enabled?: boolean } = {},
) =>
  useQuery({
    queryKey: reservationDetailQueryKey(reservationId ?? ''),
    queryFn: () => getReservationDetail(reservationId ?? ''),
    enabled: Boolean(reservationId) && enabled,
  })
