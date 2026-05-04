import React, { useEffect } from 'react'
import { serverURL } from '../App'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'


function useGetCurrentUser() {
  const dispatch = useDispatch()
  useEffect(() => {
    const fetchUser = async () => {
        try {
          const result = await axios.get(`${serverURL}/api/user/current`, { withCredentials: true })
          dispatch(setUserData(result.data))
          console.log('Current user:', result.data)
        } catch (error) {
          console.error('Error fetching user:', error)
        }
      }
    fetchUser()
  },[])
}

export default useGetCurrentUser