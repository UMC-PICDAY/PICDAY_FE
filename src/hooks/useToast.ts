import { useCallback, useEffect, useState } from 'react'

const TOAST_DURATION_MS = 3000

interface ToastState {
  id: number
  message: string
}

/**
 * 화면 하단 토스트 노출/자동 숨김을 관리하는 공용 훅.
 * id를 매번 새로 발급해서, 같은 메시지를 연달아 띄워도 Toast가 다시 마운트되어
 * (key={toast.id}) 노출 타이머가 매번 새로 시작된다.
 *
 *   const { toast, showToast } = useToast()
 *   showToast('찜 처리에 실패했어요')
 *   {toast && <Toast key={toast.id} message={toast.message} />}
 */
export const useToast = () => {
  const [toast, setToast] = useState<ToastState | null>(null)

  const showToast = useCallback((message: string) => {
    setToast({ id: Date.now(), message })
  }, [])

  const clearToast = useCallback(() => setToast(null), [])

  useEffect(() => {
    if (!toast) return

    const timer = window.setTimeout(() => setToast(null), TOAST_DURATION_MS)
    return () => window.clearTimeout(timer)
  }, [toast])

  return { toast, showToast, clearToast }
}
