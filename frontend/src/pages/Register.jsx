import  { useState } from 'react'
import { useAuth } from '../context/authContext'
import { useNavigate, Link } from 'react-router-dom'

const AVATARS = [
  'https://api.dicebear.com/7.x/bottts/svg?seed=One',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Two',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Three',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Four',
]

const Register = () => {
    const {register, loading, error} = useAuth()
    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [avatar, setAvatar] = useState(AVATARS[0])
    const [touched, setTouched] = useState({})

    const handleSubmit = async(e) => {
        e.preventDefault()
        const success = await register(username,  email, password, avatar)
        if(success){
            navigate('/chat')
        }
    }

    const handleBlur = (field) => {
        setTouched({...touched, [field]: true})
    }

    const getFieldError = (field) => {
        return touched[field] && !eval(field) ? true : false
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
              <p className='text-blue-100'>Join the community and start chatting</p>
            </div>
          </div>

          {/* Form */}
          <div className='px-8 py-8'>
            <form onSubmit={handleSubmit} className='space-y-6'>
              {/* Username */}
              <div>
                <label className='block text-sm font-bold text-gray-800 mb-3'>👤 Username</label>
                <input 
                  type="text" 
                  value={username} 
                  onChange={(e)=>setUsername(e.target.value)}
                  onBlur={() => handleBlur('username')}
                  required
                  className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition bg-gray-50' 
                  placeholder='Pick a unique username' 
                />
              </div>

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
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur('password')}
                  required
                  className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition bg-gray-50'
                  placeholder='At least 6 characters'
                />
              </div>

              {/* Avatar Selection */}
              <div>
                <label className='block text-sm font-bold text-gray-800 mb-4'>🎨 Choose Your Avatar</label>
                <div className="grid grid-cols-4 gap-4 mb-5">
                  {AVATARS.map((url, index) => (
                    <button
                      key={index}
                      type='button'
                      onClick={() => setAvatar(url)}
                      className={`relative p-2 rounded-2xl border-3 transition transform hover:scale-110 ${
                        avatar === url 
                          ? 'border-blue-600 bg-gradient-to-br from-blue-50 to-purple-50 ring-2 ring-blue-400 ring-offset-1' 
                          : 'border-gray-200 hover:border-blue-300 bg-gray-50'
                      }`}
                    >
                      <img src={url} alt={`Avatar option ${index + 1}`} className='w-16 h-16 rounded-xl' />
                      {avatar === url && (
                        <div className='absolute top-0 right-0 bg-blue-600 rounded-full w-6 h-6 flex items-center justify-center'>
                          <span className='text-white text-sm'>✓</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <div className="flex justify-center pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <p className='text-xs text-gray-500 mb-3'>Your selected avatar</p>
                    <img src={avatar} alt="selected avatar" className='w-24 h-24 rounded-2xl border-3 border-blue-600 shadow-lg mx-auto' />
                  </div>
                </div>
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
                    <span className='animate-spin mr-2'>⏳</span> Creating account...
                  </span>
                ) : (
                  <span>Create Account</span>
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className='text-center mt-8 pt-6 border-t border-gray-200'>
              <p className='text-gray-700 text-sm'>
                Already have an account?{' '}
                <Link to="/login" className='text-blue-600 font-bold hover:text-blue-700 transition underline underline-offset-2'>
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className='text-center text-blue-100 text-xs mt-6'>
          By signing up, you agree to our Terms of Service
        </p>
      </div>
    </div>
  )
}

export default Register
