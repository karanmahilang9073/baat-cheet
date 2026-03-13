import { useAuth } from '../context/authContext'
import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'

const Login = () => {
    const {login, loading, error} = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [touched, setTouched] = useState({})

    const handleSubmit = async (e) =>{
        e.preventDefault();
        const success = await login(email, password)
        if(success){
            navigate('/chat')
        }
    }

    const handleBlur = (field) => {
        setTouched({...touched, [field]: true})
    }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-blue-600 to-purple-700 p-4'>
      <div className='w-full max-w-lg'>
        {/* Card */}
        <div className='bg-white rounded-3xl shadow-2xl overflow-hidden'>
          {/* Header */}
          <div className='bg-gradient-to-r from-blue-600 to-purple-600 px-8 pt-8 pb-6'>
            <div className='text-center'>
              <div className='text-5xl mb-3'>💬</div>
              <h1 className='text-4xl font-bold text-white mb-2'>Batcheet</h1>
              <p className='text-blue-100'>Welcome back! Let's stay connected</p>
            </div>
          </div>

          {/* Form */}
          <div className='px-8 py-8'>
            <form onSubmit={handleSubmit} className='space-y-6'>
              {/* Email */}
              <div>
                <label className='block text-sm font-bold text-gray-800 mb-3'>📧 Email Address</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e)=>setEmail(e.target.value)}
                  onBlur={() => handleBlur('email')}
                  required 
                  className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition bg-gray-50' 
                  placeholder='your@email.com' 
                />
              </div>

              {/* Password */}
              <div>
                <label className='block text-sm font-bold text-gray-800 mb-3'>🔐 Password</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e)=>setPassword(e.target.value)}
                  onBlur={() => handleBlur('password')}
                  required
                  className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition bg-gray-50' 
                  placeholder='Enter your password' 
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className='bg-red-50 border-2 border-red-300 rounded-xl p-4'>
                  <p className='text-red-700 text-sm font-semibold flex items-center'>
                    <span className='text-lg mr-2'>⚠️</span> {error}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button 
                type='submit' 
                disabled={loading} 
                className='w-full py-4 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition transform hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 mt-8'
              >
                {loading ? (
                  <span className='flex items-center justify-center'>
                    <span className='animate-spin mr-2'>⏳</span> Signing in...
                  </span>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>

            {/* Signup Link */}
            <div className='text-center mt-8 pt-6 border-t border-gray-200'>
              <p className='text-gray-700 text-sm'>
                Don't have an account?{' '}
                <Link to='/register' className='text-blue-600 font-bold hover:text-blue-700 transition underline underline-offset-2'>
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className='text-center text-blue-100 text-xs mt-6'>
          Secure login • Your data is protected
        </p>
      </div>
    </div>
  )
}

export default Login
