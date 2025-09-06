import axios, { AxiosError } from 'axios'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'

// Create a custom error class for API errors
export class ApiError extends Error {
  status: number
  message: string
  data?: any

  constructor(status: number, message: string, data?: any) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.message = message
    this.data = data
  }
}

import { storage } from './storage'

// Get base URL from environment
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

// Create the API client
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = storage.getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - trigger logout
      storage.clearAuthData()
      window.dispatchEvent(new CustomEvent('auth:logout'))
      return Promise.reject(error)
    }

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const responseData = error.response.data as any
      let errorMessage = 'An error occurred'
      
      // Try to extract the most detailed error message
      if (responseData?.message) {
        errorMessage = responseData.message
        if (responseData.errors) {
          // Include validation errors if they exist
          const validationErrors = Array.isArray(responseData.errors) 
            ? responseData.errors.join(', ')
            : JSON.stringify(responseData.errors)
          errorMessage += `: ${validationErrors}`
        }
      } else if (responseData?.error) {
        errorMessage = responseData.error
      }
      
      throw new ApiError(
        error.response.status,
        errorMessage,
        error.response.data
      )
    } else if (error.request) {
      // The request was made but no response was received
      throw new ApiError(
        0,
        'No response received from server',
        error.request
      )
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new ApiError(
        0,
        error.message || 'An error occurred while setting up the request'
      )
    }
  }
)

// Generic request function
export const request = async <T>(
  config: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await apiClient.request<T>(config)
    return response.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      0,
      error instanceof Error ? error.message : 'An unknown error occurred'
    )
  }
}

// HTTP method helpers
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: 'GET', url }),
  
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: 'POST', url, data }),
  
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: 'PUT', url, data }),
  
  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: 'PATCH', url, data }),
  
  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: 'DELETE', url }),
}

export default api