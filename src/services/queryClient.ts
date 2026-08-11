import { QueryClient } from '@tanstack/react-query'

// main.tsx의 QueryClientProvider가 쓰는 것과 동일한 인스턴스를 컴포넌트 트리
// 밖(useAuthStore의 logout 액션)에서도 참조하기 위해 별도 모듈로 분리했다.
export const queryClient = new QueryClient()
