import axios from 'axios'

const api = axios.create({
    baseURL : "http://localhost:7000/api",
    withCredentials : true
})

api.interceptors.request.use((config)=>{
    const token = localStorage.getItem('token')
    if(token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            // Let React handle redirect via auth context
        }
        return Promise.reject(error)
    }
)

export default api