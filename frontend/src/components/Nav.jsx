import React, { useState } from 'react'
import { FaLocationDot, FaPlus } from 'react-icons/fa6'
import { FiShoppingCart } from 'react-icons/fi'
import { IoIosSearch } from 'react-icons/io'
import { RxCross2 } from 'react-icons/rx'
import { TbReceipt2 } from 'react-icons/tb'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { serverURL } from '../App'
import { setUserData } from '../redux/userSlice'

function Nav() {
  const userState = useSelector((state) => state.user || {})
  const ownerState = useSelector((state) => state.owner || {})
  const { userData, currentCity, cartItems } = userState
  const { myShopData } = ownerState
  const [showInfo, setShowInfo] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [query, setQuery] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverURL}/api/auth/signout`, { withCredentials: true })
      dispatch(setUserData(null))
    } catch (error) {
      console.log(error)
    }
  }

  if (!userData) return null

  const normalizedRole = String(userData.role || '').toLowerCase()
  const isUser = normalizedRole === 'user'
  const isOwner = normalizedRole === 'owner' || normalizedRole === 'shop owner'
  const userInitial = userData.fullName?.slice(0, 1)?.toUpperCase() || 'U'
  const mobilePanelPosition =
    normalizedRole === 'deliveryboy' || normalizedRole === 'delivery boy'
      ? 'md:right-[18%] lg:right-[36%]'
      : 'md:right-[7%] lg:right-[18%]'

  return (
    <>
      <header className='fixed inset-x-0 top-0 z-9999 border-b border-stone-200/70 bg-white/80 backdrop-blur-xl'>
        <div className='mx-auto flex h-20 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8'>
          <button
            type='button'
            onClick={() => navigate('/home')}
            className='shrink-0 text-left'
          >
            <span className='block bg-linear-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent sm:text-3xl'>
              Foodziee
            </span>
            <span className='text-xs font-medium tracking-[0.24em] text-stone-400 sm:block'>
              Food matlab Fooziee
            </span>
          </button>

          {isUser && (
            <div className='hidden min-w-0 flex-1 justify-center md:flex'>
              <SearchPanel
                currentCity={currentCity}
                query={query}
                setQuery={setQuery}
                className='max-w-2xl'
              />
            </div>
          )}

          <div className='flex items-center gap-2 sm:gap-3'>
            {isUser && (
              <IconAction
                label={showSearch ? 'Close search' : 'Open search'}
                onClick={() => setShowSearch((prev) => !prev)}
                className='md:hidden'
              >
                {showSearch ? <RxCross2 size={20} /> : <IoIosSearch size={22} />}
              </IconAction>
            )}

            {isOwner ? (
              <>
                {myShopData && (
                  <>
                    <ActionButton
                      label='Add Food Item'
                      onClick={() => navigate('/add-item')}
                      className='hidden sm:inline-flex'
                    >
                      <FaPlus size={16} />
                    </ActionButton>
                    <IconAction
                      label='Add food item'
                      onClick={() => navigate('/add-item')}
                      className='sm:hidden'
                    >
                      <FaPlus size={18} />
                    </IconAction>
                  </>
                )}

                <BadgeAction
                  label='My Orders'
                  count={0}
                  onClick={() => navigate('/my-orders')}
                  className='hidden sm:inline-flex'
                >
                  <TbReceipt2 size={18} />
                </BadgeAction>
                <BadgeIconAction
                  label='My orders'
                  count={0}
                  onClick={() => navigate('/my-orders')}
                  className='sm:hidden'
                >
                  <TbReceipt2 size={18} />
                </BadgeIconAction>
              </>
            ) : (
              <>
                {isUser && (
                  <BadgeIconAction
                    label='Cart'
                    count={cartItems?.length || 0}
                    onClick={() => navigate('/cart')}
                  >
                    <FiShoppingCart size={20} />
                  </BadgeIconAction>
                )}

                <ActionButton
                  label='My Orders'
                  onClick={() => navigate('/my-orders')}
                  className='hidden sm:inline-flex'
                >
                  <TbReceipt2 size={18} />
                </ActionButton>
              </>
            )}

            <button
              type='button'
              onClick={() => setShowInfo((prev) => !prev)}
              className='flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-orange-500 via-orange-500 to-amber-500 text-sm font-bold text-white shadow-lg shadow-orange-300/60 transition-transform duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-orange-200/70'
              aria-label='Open profile menu'
            >
              {userInitial}
            </button>
          </div>
        </div>
      </header>

      {showSearch && isUser && (
        <div className='fixed left-4 right-4 top-24 z-[9998] md:hidden'>
          <SearchPanel currentCity={currentCity} query={query} setQuery={setQuery} />
        </div>
      )}

      {showInfo && (
        <div
          className={`fixed right-4 top-24 z-[9999] w-64 overflow-hidden rounded-3xl border border-stone-200/80 bg-white/95 shadow-2xl shadow-stone-300/30 backdrop-blur-xl sm:right-6 ${mobilePanelPosition}`}
        >
          <div className='bg-linear-to-r from-orange-500 via-amber-500 to-orange-500 px-5 py-4 text-white'>
            <p className='text-xs font-semibold uppercase tracking-[0.24em] text-orange-50/90'>
              Signed In
            </p>
            <p className='mt-1 truncate text-lg font-bold'>{userData.fullName}</p>
          </div>

          <div className='space-y-2 p-3'>
            {isUser && (
              <button
                type='button'
                onClick={() => navigate('/my-orders')}
                className='flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-semibold text-stone-700 transition-colors duration-200 hover:bg-orange-50 hover:text-orange-600 sm:hidden'
              >
                <span>My Orders</span>
                <TbReceipt2 size={18} />
              </button>
            )}

            <button
              type='button'
              onClick={handleLogOut}
              className='flex w-full items-center justify-center rounded-2xl bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-600 transition-colors duration-200 hover:bg-orange-100'
            >
              Log Out
            </button>
          </div>
        </div>
      )}
    </>
  )
}

function SearchPanel({ currentCity, query, setQuery, className = '' }) {
  return (
    <div
      className={`flex w-full items-center gap-3 rounded-3xl border border-stone-200/80 bg-white/95 p-2 shadow-xl shadow-stone-300/20 backdrop-blur-xl ${className}`}
    >
      <div className='flex min-w-0 items-center gap-3 rounded-2xl bg-orange-50 px-3 py-3 text-sm text-stone-700 sm:w-[32%]'>
        <FaLocationDot size={18} className='shrink-0 text-orange-500' />
        <span className='truncate font-medium'>{currentCity || 'Select city'}</span>
      </div>

      <div className='flex min-w-0 flex-1 items-center gap-3 px-2'>
        <IoIosSearch size={22} className='shrink-0 text-orange-500' />
        <input
          type='text'
          placeholder='Search delicious food...'
          className='w-full bg-transparent text-sm text-stone-700 outline-none placeholder:text-stone-400'
          onChange={(event) => setQuery(event.target.value)}
          value={query}
        />
      </div>
    </div>
  )
}

function ActionButton({ children, label, onClick, className = '' }) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={`items-center gap-2 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-2.5 text-sm font-semibold text-orange-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-100 focus:outline-none focus:ring-4 focus:ring-orange-200/70 ${className}`}
    >
      {children}
      <span>{label}</span>
    </button>
  )
}

function IconAction({ children, label, onClick, className = '' }) {
  return (
    <button
      type='button'
      aria-label={label}
      onClick={onClick}
      className={`flex h-11 w-11 items-center justify-center rounded-2xl border border-orange-200 bg-orange-50 text-orange-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-100 focus:outline-none focus:ring-4 focus:ring-orange-200/70 ${className}`}
    >
      {children}
    </button>
  )
}

function BadgeAction({ children, label, count, onClick, className = '' }) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={`relative items-center gap-2 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-2.5 text-sm font-semibold text-orange-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-100 focus:outline-none focus:ring-4 focus:ring-orange-200/70 ${className}`}
    >
      {children}
      <span>{label}</span>
      <Badge count={count} />
    </button>
  )
}

function BadgeIconAction({ children, label, count, onClick, className = '' }) {
  return (
    <button
      type='button'
      aria-label={label}
      onClick={onClick}
      className={`relative flex h-11 w-11 items-center justify-center rounded-2xl border border-orange-200 bg-orange-50 text-orange-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-100 focus:outline-none focus:ring-4 focus:ring-orange-200/70 ${className}`}
    >
      {children}
      <Badge count={count} compact />
    </button>
  )
}

function Badge({ count, compact = false }) {
  return (
    <span
      className={`absolute flex min-w-5 items-center justify-center rounded-full bg-orange-500 px-1.5 text-[10px] font-bold leading-5 text-white shadow-md shadow-orange-300/60 ${
        compact ? '-right-1 -top-1' : '-right-2 -top-2'
      }`}
    >
      {count}
    </span>
  )
}

export default Nav
