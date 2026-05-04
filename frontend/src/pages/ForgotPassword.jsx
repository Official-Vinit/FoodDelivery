import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { FaEnvelope, FaLock, FaUtensils } from 'react-icons/fa'
import { IoIosArrowRoundBack } from 'react-icons/io'
import { serverURL } from '../App'

function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSendOtp = async () => {
    const sanitizedEmail = email.trim()
    if (!sanitizedEmail) {
      setError('Email is required.')
      return
    }

    setError('')
    setSuccess('')
    setLoading(true)
    try {
      await axios.post(`${serverURL}/api/auth/send-otp`, { email: sanitizedEmail }, { withCredentials: true })
      setStep(2)
      setSuccess('OTP sent successfully.')
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to send OTP.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    const sanitizedOtp = otp.trim()
    if (!sanitizedOtp) {
      setError('OTP is required.')
      return
    }

    setError('')
    setSuccess('')
    setLoading(true)
    try {
      await axios.post(
        `${serverURL}/api/auth/verify-otp`,
        { email: email.trim(), otp: sanitizedOtp },
        { withCredentials: true }
      )
      setStep(3)
      setSuccess('OTP verified. Please set your new password.')
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to verify OTP.')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError('Please fill both password fields.')
      return
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setError('')
    setSuccess('')
    setLoading(true)
    try {
      await axios.post(
        `${serverURL}/api/auth/reset-password`,
        { email: email.trim(), newPassword },
        { withCredentials: true }
      )
      setSuccess('Password reset successful. Redirecting to sign in...')
      setTimeout(() => navigate('/signin'), 900)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to reset password.')
    } finally {
      setLoading(false)
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
                ACCOUNT RECOVERY
              </p>
              <h1 className='text-4xl font-extrabold leading-tight'>
                Reset your <br /> Foodziee password
              </h1>
              <p className='max-w-sm text-sm text-orange-50/90'>
                Secure your account with OTP verification and set a new password in minutes.
              </p>
            </div>
            <div className='space-y-2 text-sm text-orange-50/90'>
              <p>Email verification</p>
              <p>OTP based reset</p>
              <p>Quick account access</p>
            </div>
          </div>

          <div className='p-6 sm:p-10 lg:p-12'>
            <div className='mx-auto w-full max-w-md'>
              <button
                type='button'
                onClick={() => navigate('/signin')}
                className='mb-4 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-orange-600 hover:bg-orange-50 cursor-pointer'
              >
                <IoIosArrowRoundBack className='text-2xl' />
                Back to Sign In
              </button>
              <h2 className='text-3xl font-bold text-stone-800'>Forgot Password</h2>
              <p className='mt-2 text-sm text-stone-500'>
                {step === 1 && 'Enter your email to receive OTP.'}
                {step === 2 && 'Enter the OTP sent to your email.'}
                {step === 3 && 'Set your new password.'}
              </p>

              <div className='mt-8 space-y-4'>
                {step === 1 && (
                  <>
                    <InputField
                      icon={<FaEnvelope />}
                      label='Email'
                      name='email'
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder='you@example.com'
                      type='email'
                    />
                    <button
                      type='button'
                      onClick={handleSendOtp}
                      disabled={loading}
                      className={`w-full rounded-xl bg-linear-to-r from-[#f97316] via-[#f59e0b] to-[#f97316] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-300/60 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-400/60 ${loading ? 'cursor-wait opacity-80' : 'cursor-pointer'}`}
                    >
                      {loading ? 'Sending OTP...' : 'Send OTP'}
                    </button>
                  </>
                )}

                {step === 2 && (
                  <>
                    <InputField
                      icon={<FaLock />}
                      label='OTP'
                      name='otp'
                      value={otp}
                      onChange={(event) => setOtp(event.target.value)}
                      placeholder='Enter OTP'
                      type='text'
                    />
                    <button
                      type='button'
                      onClick={handleVerifyOtp}
                      disabled={loading}
                      className={`w-full rounded-xl bg-linear-to-r from-[#f97316] via-[#f59e0b] to-[#f97316] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-300/60 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-400/60 ${loading ? 'cursor-wait opacity-80' : 'cursor-pointer'}`}
                    >
                      {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                  </>
                )}

                {step === 3 && (
                  <>
                    <InputField
                      icon={<FaLock />}
                      label='New Password'
                      name='newPassword'
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                      placeholder='Enter new password'
                      type='password'
                    />
                    <InputField
                      icon={<FaLock />}
                      label='Confirm Password'
                      name='confirmPassword'
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      placeholder='Confirm password'
                      type='password'
                    />
                    <button
                      type='button'
                      onClick={handleResetPassword}
                      disabled={loading}
                      className={`w-full rounded-xl bg-linear-to-r from-[#f97316] via-[#f59e0b] to-[#f97316] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-300/60 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-400/60 ${loading ? 'cursor-wait opacity-80' : 'cursor-pointer'}`}
                    >
                      {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                  </>
                )}

                {error && <p className='text-sm font-medium text-rose-600'>{error}</p>}
                {success && <p className='text-sm font-medium text-emerald-600'>{success}</p>}
              </div>
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

export default ForgotPassword
