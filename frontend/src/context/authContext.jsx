import { useEffect, useContext, useState, createContext } from 'react';
import api from '../utils/api';


const Authcontext = createContext();

export const Authprovider = ({children}) =>{
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // FIX: Load user and token from localStorage on app startup
    // This runs first to restore the user before the second useEffect runs
    // This prevents the race condition where loading was set to false before user state was updated
    useEffect(()=>{
        const storedtoken = localStorage.getItem('token')
        const storedUser = localStorage.getItem('user')
        
        if (storedUser && storedtoken) {
            setUser(JSON.parse(storedUser))
            setToken(storedtoken)
        }
        setLoading(false)
    },[])

    // FIX: Setup API authorization header and sync localStorage whenever token changes
    // This runs AFTER the first useEffect, ensuring user is already restored
    // This prevents ProtectedRoute from redirecting to login before user is fully restored
    useEffect(()=>{
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            localStorage.setItem('token', token)
        }else {
            delete api.defaults.headers.common['Authorization']
            localStorage.removeItem('token')
        }
    }, [token])

    //register
    const register = async(username, email, password, avatar) =>{
        setLoading(true)
        setError(null)
        try {
           const {data} = await api.post('/auth/register',{
            username, email, password, avatar
           })

        setUser(data.user)
        setToken(data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        localStorage.setItem('token', data.token)
        return true;
        } catch (err) {
            const msg = err.response?.data?.message || 'registration failed'
            setError(msg)
        } finally{
            setLoading(false)
        }
    }

    //login
    const login = async(email,password) =>{
        setLoading(true)
        setError(null)
        try {
            const {data} = await api.post("/auth/login", {email, password})
            setUser(data.user)
            setToken(data.token)
            localStorage.setItem("user",JSON.stringify(data.user))
            localStorage.setItem("token", data.token)
            return true
        } catch (error) {
            const msg = error.response?.data?.message || error.message
            setError(msg)
            return false
        } finally {
            setLoading(false)
        }
    }

    //logout
    // FIX: Added localStorage.removeItem("token") - was missing before, causing stale tokens to persist
    const logout = () =>{
        setUser(null)
        setToken(null)
        localStorage.removeItem("user")
        localStorage.removeItem("token") // FIX: This line was missing - now properly clears token on logout
    }

    return (
        <Authcontext.Provider
          value={{
            user,
            token,
            loading,
            error,
            register,
            login,
            logout,
          }} 
          >
            {children}
        </Authcontext.Provider>
    )
}

//custom hook
export const useAuth = () => useContext(Authcontext)