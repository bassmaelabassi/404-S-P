import axios from "axios"
import toast from "react-hot-toast"

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
  timeout: 10000, 
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error("API request error:", error)
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("userRole")
      localStorage.removeItem("userData")

      toast.error("Session expired. Please login again.")

      setTimeout(() => {
        window.location.href = "/login"
      }, 500)
    }
    if (error.response && error.response.status === 403) {
      toast.error("You don't have permission to access this resource.")
    }
    if (error.code === "ECONNABORTED" || !error.response) {
      toast.error("Network error. Please check your connection.")
    }

    return Promise.reject(error)
  },
)

export const authApi = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  logout: () => api.get("/auth/logout"),
  me: () => api.get("/auth/me/jwt"),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { password }),
  verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
  resendVerification: (email) => api.post("/auth/resend-verification", { email }),
  verifyPhone: (code, phone) => api.post("/auth/verify-phone", { code, phone }),
  updateProfile: (userData) => api.put("/users/profile", userData),
}

export const userApi = {
  getAll: (page = 1, limit = 10) => api.get(`/users?page=${page}&limit=${limit}`),
  getById: (id) => api.get(`/users/${id}`),
  search: (query) => api.get(`/users/search?q=${query}`),
  getActivityLogs: () => api.get("/users/activity-logs"),
}

export default api