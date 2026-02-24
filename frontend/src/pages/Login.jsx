import { useAuth } from '../context/authContext'
import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'

const Login = () => {
    const {login, loading, error} = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (e) =>{
        e.preventDefault();
        const success = await login(email, password)
        if(success){
            navigate('/chat')
        }
    }

  return (
    <div className='min-h-screen flex items-center justify-center bg-linear-to-br from-blue-500 via-blue-600 to-purple-700'>
      <div className='w-full max-w-md'>
        <div className='bg-white rounded-2xl shadow-2xl p-8 space-y-6'>
          <div className='text-center'>
            <h1 className='text-4xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2'>
              Batcheet
            </h1>
            <p className='text-gray-600'>Welcome back! Sign in to continue</p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-5'>
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e)=>setEmail(e.target.value)} 
                required 
                className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition' 
                placeholder='you@example.com' 
              />
            </div>

            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e)=>setPassword(e.target.value)} 
                required
                className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition' 
                placeholder='••••••••'
              />
            </div>

            {error && (
              <div className='bg-red-50 border-2 border-red-300 rounded-lg p-3'>
                <p className='text-red-700 text-sm font-medium'>{error}</p>
              </div>
            )}

            <button 
              type='submit' 
              disabled={loading} 
              className='w-full py-3 px-4 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition transform hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className='text-center'>
            <p className='text-gray-600 text-sm'>
              Don't have an account?{' '}
              <Link to='/register' className='text-blue-600 font-semibold hover:text-blue-700 transition'>
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
