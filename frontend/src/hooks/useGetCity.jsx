import React, { useEffect } from 'react'
import { serverURL } from '../App'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setCurrentCity } from '../redux/userSlice'
import { useSelector } from 'react-redux'


function useGetCity() {
  const dispatch = useDispatch()
  const {userData} = useSelector((state) => state.user)
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords
            const result = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${import.meta.env.VITE_GEOAPIFY_API_KEY}`)
            const city = result.data.results[0].address_line1
            dispatch(setCurrentCity(city))
        })
    }, [userData])
}

export default useGetCity