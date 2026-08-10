import { useQuery } from '@tanstack/react-query'

import { getMyReservations } from '@/services/reservation'

export const myReservationsQueryKey = ['myReservations'] as const

export const useMyReservations = () =>
  useQuery({
    queryKey: myReservationsQueryKey,
    queryFn: () => getMyReservations(),
  })
