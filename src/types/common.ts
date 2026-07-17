export interface ApiResponse<T> {
  success: boolean
  code: string
  message: string
  data: T | null
}

export class ApiError extends Error {
  code: string

  constructor(code: string, message: string) {
    super(message)
    this.code = code
  }
}
