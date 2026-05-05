import React from 'react'
import { useSelector } from 'react-redux'
import useGetCurrentUser from '../hooks/useGetCurrentUser'
import UserDashboard from '../components/userDashboard'
import OwnerDashboard from '../components/ownerDashboard'
import DeliveryBoy from '../components/deliveryBoy'

function Home() {
  const {userData} = useSelector((state) => state.user)
  return (
    <div className='w-screen min-h-screen pt-25 flex flex-col items-center' >
      {userData.role=="User" && <UserDashboard />}
      {userData.role=="Shop Owner" && <OwnerDashboard />}
      {userData.role=="Delivery Boy" && <DeliveryBoy />}
    </div>
  )
}

export default Home