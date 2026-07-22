import type { StudioTimeSlot } from '@/pages/studio/types/dateTime'

/**
 * GET /api/v1/studios/{studioId}/slots 응답을 대신하는 임시 데이터입니다.
 * API 연동 시 ConceptListPage의 날짜 변경 핸들러에서 이 값을 조회 함수로 교체합니다.
 */
export const MOCK_STUDIO_SLOTS: readonly StudioTimeSlot[] = [
  {
    slotId: '1',
    startTime: '10:00',
    endTime: '11:00',
    isAvailable: true,
  },
  {
    slotId: '2',
    startTime: '11:00',
    endTime: '12:00',
    isAvailable: false,
  },
  {
    slotId: '3',
    startTime: '12:00',
    endTime: '13:00',
    isAvailable: true,
  },
  {
    slotId: '4',
    startTime: '13:00',
    endTime: '14:00',
    isAvailable: true,
  },
  {
    slotId: '5',
    startTime: '14:00',
    endTime: '15:00',
    isAvailable: true,
  },
  {
    slotId: '6',
    startTime: '15:00',
    endTime: '16:00',
    isAvailable: false,
  },
  {
    slotId: '7',
    startTime: '16:00',
    endTime: '17:00',
    isAvailable: true,
  },
  {
    slotId: '8',
    startTime: '17:00',
    endTime: '18:00',
    isAvailable: true,
  },
  {
    slotId: '9',
    startTime: '18:00',
    endTime: '19:00',
    isAvailable: true,
  },
]
