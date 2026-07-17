import axios from 'axios'
import type { AxiosError } from 'axios'

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

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse<null>>) => {
    const body = error.response?.data
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

export const apiPatch = async <T>(url: string, body?: unknown): Promise<T> => {
  const response = await apiClient.patch<ApiResponse<T>>(url, body)
  return unwrap(response)
}

export const apiDelete = async <T>(url: string): Promise<T> => {
  const response = await apiClient.delete<ApiResponse<T>>(url)
  return unwrap(response)
}
