import { useAuth } from './context/authContext'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import {Routes, Route, Navigate} from 'react-router-dom'
import Chat from './pages/Chat.jsx'


const ProtectedRoute = ({children}) =>{
  const {user, loading} = useAuth();

  if(loading) {
    return <div className='p-4'>loading...</div>
  }
  if (!user) {
    return <Navigate to='/login' />
  }
  return children;
}

function App() {
  const {user} = useAuth()
  return (
    <Routes>
      <Route path='/' element={user ? <Navigate to='/chat'/> : <Navigate to='/login' />} />
      <Route path='/register' element={<Register />} />
      <Route path='/login' element={<Login/>} />
      <Route path='/chat' element={
        <ProtectedRoute>
          <Chat />
        </ProtectedRoute>
      }
      />
    </Routes>
  )
}

export default App
