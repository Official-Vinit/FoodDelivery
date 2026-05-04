import React, { useState } from 'react'
import { FaEnvelope, FaEye, FaEyeSlash, FaLock, FaUtensils } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { serverURL } from '../App'
import { FcGoogle } from 'react-icons/fc'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '../../firebase'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'

function SignIn() {
  const navigate = useNavigate()
  const [googleLoading, setGoogleLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const dispatch = useDispatch()

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const email = formData.email.trim()
    if (!email || !formData.password) {
      setErrorMessage('Please enter both email and password.')
      return
    }

    try {
      setErrorMessage('')
      setLoading(true)
      const result = await axios.post(
        `${serverURL}/api/auth/signin`,
        { email, password: formData.password },
        { withCredentials: true }
      )
      dispatch(setUserData(result.data))
      navigate('/home')
    } catch (error) {
      console.error(error.response?.data || error.message || error)
      setErrorMessage(error.response?.data?.message || 'Sign in failed')
    } finally {
      setLoading(false)
    }
  }
  const handleGoogleSignin = async () => {
    if (googleLoading) return;

    setErrorMessage('');
    setGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      const result = await signInWithPopup(auth, provider);
      if (!result || !result.user) {
        throw new Error('No user information returned from Google.');
      }

      const user = result.user;
      const idToken = await user.getIdToken(true);
      const payload = {
        idToken
      };

      const res = await axios.post(`${serverURL}/api/auth/google-auth`, payload, { withCredentials: true });
      dispatch(setUserData(res.data))
      // On successful server-side signup/auth, navigate to home
      if (res.status === 200 || res.data?.success) {
        navigate('/home');
      } else {
        setErrorMessage(res.data?.message || 'Google sign-in failed on server.');
      }
    } catch (err) {
      console.error('Google sign-in error:', err.response?.data || err.message || err);
      setErrorMessage(err.response?.data?.message || err.message || 'Google sign-in failed');
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <section className='relative min-h-screen overflow-hidden bg-linear-to-br from-amber-50 via-stone-50 to-orange-100 px-4 py-8 sm:px-6 lg:px-8'>
      <div className='pointer-events-none absolute -left-20 -top-20 h-72 w-72 animate-pulse rounded-full bg-orange-300/20 blur-3xl' />
      <div className='pointer-events-none absolute -bottom-24 -right-20 h-80 w-80 animate-pulse rounded-full bg-rose-300/20 blur-3xl [animation-delay:400ms]' />

      <div className='relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center'>
        <div className='grid w-full overflow-hidden rounded-3xl border border-stone-200/80 bg-white/85 shadow-2xl shadow-stone-300/25 backdrop-blur-xl lg:grid-cols-2'>
          <div className='relative hidden flex-col justify-between bg-linear-to-br from-[#fb923c] via-[#f97316] to-[#ea580c] p-10 text-white lg:flex'>
            <div className='absolute right-6 top-6 rounded-full bg-white/20 p-3 backdrop-blur-md'>
              <FaUtensils className='text-2xl' />
            </div>
            <div className='space-y-4'>
              <p className='inline-flex rounded-full bg-white/20 px-4 py-1 text-xs font-semibold tracking-widest text-orange-50'>
                WELCOME BACK
              </p>
              <h1 className='text-4xl font-extrabold leading-tight'>
                Food matlab <br /> Foodziee
              </h1>
              <p className='max-w-sm text-sm text-orange-50/90'>
                Sign in to continue your food journey with faster checkout and seamless order tracking.
              </p>
            </div>
            <div className='space-y-2 text-sm text-orange-50/90'>
              <p>Fast ordering</p>
              <p>Live delivery updates</p>
              <p>Personalized experience</p>
            </div>
          </div>

          <div className='p-6 sm:p-10 lg:p-12'>
            <div className='mx-auto w-full max-w-md'>
              <h2 className='text-3xl font-bold text-stone-800'>Sign In</h2>
              <p className='mt-2 text-sm text-stone-500'>Welcome back to Foodziee.</p>
              {!!errorMessage && (
                <p className='mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700'>
                  {errorMessage}
                </p>
              )}

              <form onSubmit={handleSubmit} className='mt-8 space-y-4'>
                <InputField
                  icon={<FaEnvelope />}
                  label='Email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  type='email'
                  placeholder='you@example.com'
                />

                <PasswordField
                  label='Password'
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  isVisible={showPassword}
                  onToggle={() => setShowPassword((prev) => !prev)}
                />

                <div className='flex justify-end'>
                  <button
                    type='button'
                    onClick={() => navigate('/forgot-password')}
                    className='text-sm font-medium text-orange-600 transition-colors hover:text-orange-700 hover:underline'
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type='submit'
                  disabled={loading}
                  className={`mt-2 w-full rounded-xl bg-linear-to-r from-[#f97316] via-[#f59e0b] to-[#f97316] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-300/60 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-400/60 active:translate-y-0 ${loading ? 'cursor-wait opacity-80' : 'cursor-pointer'}`}
                >
                  {loading ? 'Signing In...' : 'Sign In to Foodziee'}
                </button>

                <button
                  type='button'
                  onClick={handleGoogleSignin}
                  disabled={googleLoading}
                  aria-label='Sign in with Google'
                  className={`mt-2 w-full rounded-xl pl-12 pr-12 py-3 text-sm font-semibold text-stone-800 bg-white border border-stone-200 shadow-sm relative transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-md active:scale-95 focus:outline-none focus:ring-4 focus:ring-orange-200/60 ${googleLoading ? 'opacity-80 cursor-wait' : ''} cursor-pointer`}
                >
                  <span className='absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm'>
                    <FcGoogle className='text-2xl' />
                  </span>

                  <span className='flex items-center justify-center'>
                    <span>Sign in with Google</span>
                  </span>

                  {googleLoading && (
                    <span className='absolute right-3 top-1/2 -translate-y-1/2'>
                      <span className='w-4 h-4 border-2 border-stone-300 border-t-orange-500 rounded-full animate-spin' />
                    </span>
                  )}
                </button>

                <p className='text-sm text-stone-600'>
                  Don&apos;t have an account?{' '}
                  <span
                    onClick={() => navigate('/signup')}
                    className='cursor-pointer font-semibold text-orange-500 transition-colors hover:text-orange-600 hover:underline'
                  >
                    Signup
                  </span>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function InputField({ icon, label, ...props }) {
  return (
    <div className='space-y-2'>
      <label htmlFor={props.name} className='text-sm font-semibold text-stone-700'>
        {label}
      </label>
      <div className='group relative'>
        <span className='pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 transition-colors duration-300 group-focus-within:text-orange-500'>
          {icon}
        </span>
        <input
          id={props.name}
          {...props}
          className='w-full rounded-xl border border-stone-200 bg-stone-50/80 py-3 pl-11 pr-4 text-sm text-stone-800 outline-none transition-all duration-300 placeholder:text-stone-400 hover:border-orange-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-200/70'
          required
        />
      </div>
    </div>
  )
}

function PasswordField({ label, name, value, onChange, isVisible, onToggle }) {
  return (
    <div className='space-y-2'>
      <label htmlFor={name} className='text-sm font-semibold text-stone-700'>
        {label}
      </label>
      <div className='group relative'>
        <span className='pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 transition-colors duration-300 group-focus-within:text-orange-500'>
          <FaLock />
        </span>
        <input
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          type={isVisible ? 'text' : 'password'}
          placeholder='Enter your password'
          className='w-full rounded-xl border border-stone-200 bg-stone-50/80 py-3 pl-11 pr-12 text-sm text-stone-800 outline-none transition-all duration-300 placeholder:text-stone-400 hover:border-orange-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-200/70'
          required
        />
        <button
          type='button'
          onClick={onToggle}
          className='absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-stone-500 transition-colors duration-300 hover:bg-orange-100 hover:text-orange-700'
          aria-label={isVisible ? `Hide ${label}` : `Show ${label}`}
        >
          {isVisible ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    </div>
  )
}

export default SignIn
