import  { useState } from 'react'
import { useAuth } from '../context/authContext'
import { useNavigate, Link } from 'react-router-dom'

const Register = () => {
    const {register, loading, error} = useAuth()
    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [avatar, setAvatar] = useState(null)
    const [avatarPreview, setAvatarPreview] = useState(null)
    const [touched, setTouched] = useState({})

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file')
                return
            }
            // Validate file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert('Image size must be less than 2MB')
                return
            }

            const reader = new FileReader()
            reader.onloadend = () => {
                setAvatar(reader.result) // Base64 encoded image
                setAvatarPreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        if (!avatar) {
            alert('Please select a profile image')
            return
        }
        const success = await register(username, email, password, avatar)
        if(success){
            navigate('/chat')
        }
    }

    const handleBlur = (field) => {
        setTouched({...touched, [field]: true})
    }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-blue-600 to-purple-700 p-4'>
      <div className='w-full max-w-sm'>
        {/* Card */}
        <div className='bg-white rounded-2xl shadow-2xl overflow-hidden'>
          {/* Header */}
          <div className='bg-gradient-to-r from-blue-600 to-purple-600 px-6 pt-6 pb-4'>
            <div className='text-center'>
              <div className='text-4xl mb-2'>💬</div>
              <h1 className='text-3xl font-bold text-white mb-1'>Batcheet</h1>
              <p className='text-blue-100 text-sm'>Create your account</p>
            </div>
          </div>

          {/* Form */}
          <div className='px-6 py-6'>
            <form onSubmit={handleSubmit} className='space-y-4'>
              {/* Username */}
              <div>
                <label className='block text-xs font-bold text-gray-800 mb-1.5'>👤 Username</label>
                <input 
                  type="text" 
                  value={username} 
                  onChange={(e)=>setUsername(e.target.value)}
                  onBlur={() => handleBlur('username')}
                  required
                  className='w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition bg-gray-50 text-sm' 
                  placeholder='Username' 
                />
              </div>

              {/* Email */}
              <div>
                <label className='block text-xs font-bold text-gray-800 mb-1.5'>📧 Email Address</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e)=>setEmail(e.target.value)}
                  onBlur={() => handleBlur('email')}
                  required
                  className='w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition bg-gray-50 text-sm' 
                  placeholder='email@example.com' 
                />
              </div>

              {/* Password */}
              <div>
                <label className='block text-xs font-bold text-gray-800 mb-1.5'>🔐 Password</label>
                <input
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur('password')}
                  required
                  className='w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition bg-gray-50 text-sm'
                  placeholder='Password'
                />
              </div>

              {/* Profile Image Upload */}
              <div>
                <label className='block text-xs font-bold text-gray-800 mb-2'>📸 Profile Image</label>
                <div className='flex flex-col items-center'>
                  {/* File Upload Input */}
                  <label className='w-full'>
                    <div className='border-2 border-dashed border-blue-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition bg-gray-50'>
                      <div className='text-2xl mb-1'>📷</div>
                      <p className='text-gray-700 font-semibold text-xs mb-0.5'>Click to upload</p>
                      <p className='text-gray-500 text-xs'>PNG/JPG up to 2MB</p>
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange}
                      className='hidden'
                      required
                    />
                  </label>

                  {/* Image Preview */}
                  {avatarPreview && (
                    <div className='mt-3 text-center pt-3 border-t border-gray-200 w-full'>
                      <img 
                        src={avatarPreview} 
                        alt="profile preview" 
                        className='w-20 h-20 rounded-lg border-2 border-blue-600 shadow-lg mx-auto object-cover' 
                      />
                      <button
                        type='button'
                        onClick={() => {
                          setAvatar(null)
                          setAvatarPreview(null)
                        }}
                        className='mt-2 text-xs text-red-600 hover:text-red-700 font-semibold transition'
                      >
                        Change
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className='bg-red-50 border-2 border-red-300 rounded-lg p-2'>
                  <p className='text-red-700 text-xs font-semibold flex items-center'>
                    <span className='text-sm mr-1'>⚠️</span> {error}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button 
                type='submit' 
                disabled={loading} 
                className='w-full py-2 px-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold text-sm hover:from-blue-700 hover:to-purple-700 transition transform hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 mt-4'
              >
                {loading ? (
                  <span className='flex items-center justify-center'>
                    <span className='animate-spin mr-1 text-xs'>⏳</span> Creating...
                  </span>
                ) : (
                  <span>Sign Up</span>
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className='text-center mt-4 pt-4 border-t border-gray-200'>
              <p className='text-gray-700 text-xs'>
                Have an account?{' '}
                <Link to="/login" className='text-blue-600 font-bold hover:text-blue-700 transition underline underline-offset-1'>
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className='text-center text-blue-100 text-xs mt-4'>
          Secure & Fast
        </p>
      </div>
    </div>
  )
}

export default Register
