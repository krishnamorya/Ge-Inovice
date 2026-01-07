/**
 * HTTP Client for API communication
 * Handles request/response, authentication, and error handling
 */


import type { ApiResponse } from "@/model/user"

interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean>
}

class ApiClient {
  private baseUrl: string
  private accessToken: string | null = null
  private refreshToken: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
    // Try to restore token from localStorage (client-side only)
    if (typeof window !== "undefined") {
      this.accessToken = localStorage.getItem("accessToken")
      this.refreshToken = localStorage.getItem("refreshToken")
    }
  }
  

  getToken (): string | null {
    return (this.accessToken, this.refreshToken)
  }

  setAccessToken (accessToken : string): void {
    this.accessToken = accessToken
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", accessToken)
    }
  }

  setToken(accessToken: string, refreshToken: string): void {
    this.accessToken = accessToken
    this.refreshToken = refreshToken
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", accessToken)
      localStorage.setItem("refreshToken", refreshToken)
    }
  }

  clearToken(): void {
    this.accessToken = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
    }
  }

  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
    const baseUrl = "/api"
    const url = new URL(
      `${baseUrl}${endpoint}`,
      typeof window !== "undefined" ? window.location.origin : "http://localhost:3000",
    )
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value))
      })
    }
    return url.toString()
  }

  private getHeaders(): Headers {
    const headers = new Headers({
      "Content-Type": "application/json",
    })

    if (this.accessToken) {
      headers.set("Authorization", `Bearer ${this.accessToken}`)
    }

    return headers
  }

  async request<T>(endpoint: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    try {
      const { params, ...fetchConfig } = config
      const url = this.buildUrl(endpoint, params)

      const response = await fetch(url, {
        ...fetchConfig,
        headers: this.getHeaders(),
      })

      // Handle 401 - token expired or invalid
      if (response.status === 401) {
        this.clearToken()
        // In a real app, trigger logout/redirect
        throw new Error("Unauthorized - please login again")
      }

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.error || data.message || "Unknown error",
        }
      }

      return {
        success: true,
        data: data.data || data,
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Network error"
      return {
        success: false,
        error: message,
      }
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string | number | boolean>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET", params })
  }

  async post<T>(
    endpoint: string,
    body?: unknown,
    params?: Record<string, string | number | boolean>,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
      params,
    })
  }

  async put<T>(
    endpoint: string,
    body?: unknown,
    params?: Record<string, string | number | boolean>,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
      params,
    })
  }

  async patch<T>(
    endpoint: string,
    body?: unknown,
    params?: Record<string, string | number | boolean>,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
      params,
    })
  }

  async delete<T>(endpoint: string, params?: Record<string, string | number | boolean>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE", params })
  }
}

// Create singleton instance
export const apiClient = new ApiClient(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api")
