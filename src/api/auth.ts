import { apiClient } from "./client"
import type { UpdateUserPayload, User } from "@/model/user"

export const authApi = {
  login: async (email: string, password: string) => {
    // console.log("Auth login called")
    
    
    const response = await apiClient.post<{
      user: User
      accessToken: string
      refreshToken: string
    }>("/auth/login", { email, password })
    // console.log("Response fron auth.ts", response.data)
    // console.log()
    // console.log(response.data)
    

    if (response.success && response.data) {
      apiClient.setToken(response.data.accessToken, response.data.refreshToken)
    }

    return response
  },

  register: async (email: string, password: string, first_name: string, last_name: string, refreshToken: string) => {
    const response = await apiClient.post<{
      user: User
      token: string
    }>("/auth/register", { email, password, first_name, last_name, refreshToken })

    // if (response.success && response.data) {
    //   apiClient.setToken(response.data.token)
    // }

    return response
  },

  updateUser: async (updateData: UpdateUserPayload): Promise<User> => {

  const response = await apiClient.patch<User>(
    "/auth/updateUser",
    updateData
  )

  if (!response.success || !response.data) {
    throw new Error("Failed to update user")
  }

  return response.data
},

  logout: async () => {
    const response = await apiClient.post("/auth/logout")
    apiClient.clearToken()
    return response
  },

  getMe: async () => {
    return apiClient.get<User>("/auth/me")
  },

  refreshAccessToken: async (refreshToken: string) => {
      return apiClient.post<{
        user: User
        accessToken: string
        refreshToken: string
      }>("/auth/refreshAccessToken", {refreshToken: refreshToken})
  }
}
