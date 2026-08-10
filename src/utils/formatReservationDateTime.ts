const parseReservationDate = (reservationDate: string) => {
  const [year, month, day] = reservationDate.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  const weekday = new Intl.DateTimeFormat('ko-KR', { weekday: 'short' }).format(date)

  return { year, month, day, weekday }
}

/** "2026년 3월 15일 (토) 14:00" 형식 */
export const formatReservationDateTimeLong = (
  reservationDate: string,
  reservationTime: string,
) => {
  const { year, month, day, weekday } = parseReservationDate(reservationDate)

  return `${year}년 ${month}월 ${day}일 (${weekday}) ${reservationTime}`
}

/** "2026.03.15 (토) 14:00" 형식 */
export const formatReservationDateTimeDotted = (
  reservationDate: string,
  reservationTime: string,
) => {
  const { year, month, day, weekday } = parseReservationDate(reservationDate)

  return `${year}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')} (${weekday}) ${reservationTime}`
}

/** "2026.03.15 14:00" 형식 (요일 없음) */
export const formatReservationDateTimeShort = (
  reservationDate: string,
  reservationTime: string,
) => {
  const [year, month, day] = reservationDate.split('-').map(Number)

  return `${year}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')} ${reservationTime}`
}
