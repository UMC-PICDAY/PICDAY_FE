import axios from 'axios'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'

import { useAuthStore } from '@/stores/useAuthStore'
import { ApiError } from '@/types/common'
import type { ApiResponse } from '@/types/common'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

apiClient.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken
  if (accessToken && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

// Access Token 만료(AUTH_4017) 시 자동으로 갱신 후 원래 요청을 1회 재시도.
// 동시에 여러 요청이 401을 맞아도 refresh는 한 번만 실행되도록 진행 중인 refresh를 공유함.
let refreshPromise: Promise<string> | null = null

const requestRefreshedAccessToken = async (): Promise<string> => {
  const refreshToken = useAuthStore.getState().refreshToken
  if (!refreshToken) {
    throw new ApiError('AUTH_4016', '세션이 만료되었습니다. 다시 로그인해 주세요.')
  }

  // interceptor 재귀 호출을 피하기 위해 apiClient가 아닌 axios를 직접 사용
  const response = await axios.post<ApiResponse<{ token: { accessToken: string; refreshToken: string } }>>(
    '/api/v1/auth/refresh',
    undefined,
    {
      baseURL: import.meta.env.VITE_API_BASE_URL,
      headers: { Authorization: `Bearer ${refreshToken}` },
    },
  )

  if (!response.data.success || !response.data.data) {
    throw new ApiError(response.data.code, response.data.message)
  }

  const { token } = response.data.data
  useAuthStore.getState().login({ accessToken: token.accessToken, refreshToken: token.refreshToken })
  return token.accessToken
}

type RetryableRequestConfig = InternalAxiosRequestConfig & { _retried?: boolean }

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse<null>>) => {
    const body = error.response?.data
    const originalRequest = error.config as RetryableRequestConfig | undefined

    if (body?.code === 'AUTH_4017' && originalRequest && !originalRequest._retried) {
      originalRequest._retried = true
      try {
        refreshPromise ??= requestRefreshedAccessToken().finally(() => {
          refreshPromise = null
        })
        const accessToken = await refreshPromise
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return apiClient(originalRequest)
      } catch {
        useAuthStore.getState().logout()
        return Promise.reject(new ApiError('AUTH_4016', '세션이 만료되었습니다. 다시 로그인해 주세요.'))
      }
    }

    if (body?.code === 'AUTH_4016' || body?.code === 'AUTH_4013') {
      useAuthStore.getState().logout()
    }

    if (body) {
      return Promise.reject(new ApiError(body.code, body.message))
    }
    return Promise.reject(error)
  },
)

const unwrap = <T>(response: { data: ApiResponse<T> }): T => {
  const { success, code, message, data } = response.data
  if (!success) {
    throw new ApiError(code, message)
  }
  return data as T
}

export const apiGet = async <T>(url: string, params?: object): Promise<T> => {
  const response = await apiClient.get<ApiResponse<T>>(url, { params })
  return unwrap(response)
}

export const apiPost = async <T>(url: string, body?: unknown, config?: { headers?: Record<string, string> }): Promise<T> => {
  const response = await apiClient.post<ApiResponse<T>>(url, body, config)
  return unwrap(response)
}

export const apiPatch = async <T>(url: string, body?: unknown, config?: { headers?: Record<string, string> }): Promise<T> => {
  const response = await apiClient.patch<ApiResponse<T>>(url, body, config)
  return unwrap(response)
}

export const apiDelete = async <T>(url: string): Promise<T> => {
  const response = await apiClient.delete<ApiResponse<T>>(url)
  return unwrap(response)
}
