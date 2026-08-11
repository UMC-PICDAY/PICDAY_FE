import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import {
  checkNicknameAvailable,
  getMe,
  logout,
  updateNickname,
  withdraw,
} from '@/services/auth'

export const meQueryKey = ['me'] as const

// 마이페이지(예약관리/프로필)가 각자 부르던 getMe()를 하나의 쿼리로 공유해
// 탭 전환할 때마다 중복 조회하지 않게 한다. staleTime을 주지 않으면 기본값(0)
// 때문에 캐시가 있어도 화면을 옮길 때마다 백그라운드로 다시 불러 호출이
// 줄지 않는다 — 닉네임 변경(useUpdateNickname)이 끝나면 명시적으로
// invalidate하므로 그 전까지는 캐시를 그대로 신뢰해도 된다.
export const useMe = () =>
  useQuery({
    queryKey: meQueryKey,
    queryFn: getMe,
    staleTime: 5 * 60 * 1000,
  })

export const useUpdateNickname = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateNickname,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: meQueryKey })
    },
  })
}

export const useWithdraw = () => useMutation({ mutationFn: withdraw })

export const useLogout = () => useMutation({ mutationFn: logout })

// 닉네임 중복 확인은 입력이 멈춘 뒤 300ms 후에만 조회해야 해서, 디바운스된
// 값을 호출부에서 만들어 queryKey/enabled로 넘겨받는다.
export const useNicknameAvailability = (
  nickname: string,
  enabled: boolean,
) =>
  useQuery({
    queryKey: ['nicknameAvailability', nickname],
    queryFn: () => checkNicknameAvailable(nickname),
    enabled,
    staleTime: Infinity,
  })
