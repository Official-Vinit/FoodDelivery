import React, { use } from 'react'
import { Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import ForgotPassword from './pages/ForgotPassword'
import useGetCurrentUser from './hooks/useGetCurrentUser'
import { useSelector } from 'react-redux'
import Home from './pages/Home'
import { Navigate } from 'react-router-dom'

export const serverURL = 'http://localhost:8000'

function App() {
  useGetCurrentUser()
  const {userData} = useSelector(state => state.user)
  return (
    <Routes>
      <Route path='/' element={<Navigate to={userData ? '/home' : '/signin'} />} />
      <Route path='/home' element={userData ? <Home /> : <Navigate to='/signin' />} />
      <Route path='/signup' element={!userData ? <SignUp /> : <Navigate to='/home' />} />
      <Route path='/signin' element={!userData ? <SignIn /> : <Navigate to='/home' />} />
      <Route path='/forgot-password' element={<ForgotPassword />} />
      <Route path='*' element={<h1>404 Not Found</h1>} />
    </Routes>
  )
}

export default App
