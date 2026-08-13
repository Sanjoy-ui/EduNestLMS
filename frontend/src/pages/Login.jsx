import React, { useState } from 'react'
import logo from '../assets/logo.jpg'
import google from '../assets/google.jpg'
import axios from 'axios'
import { serverUrl } from '../App'
import { MdOutlineRemoveRedEye, MdRemoveRedEye } from "react-icons/md";
import { useNavigate } from 'react-router-dom'
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../../utils/Firebase'
import { toast } from 'react-toastify'
import { ClipLoader } from 'react-spinners'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  const handleLogin = async () => {
    setLoading(true)
    try {
      const result = await axios.post(serverUrl + "/api/auth/login", { email, password }, { withCredentials: true })
      dispatch(setUserData(result.data))
      navigate("/")
      setLoading(false)
      toast.success("Login Successfully")
    } catch (error) {
      console.log(error)
      setLoading(false)
      toast.error(error.response?.data?.message || "Login failed")
    }
  }

  const googleLogin = async () => {
    try {
      const response = await signInWithPopup(auth, provider)
      let user = response.user
      let name = user.displayName
      let email = user.email
      let role = ""
      const result = await axios.post(serverUrl + "/api/auth/googlesignup", { name, email, role }, { withCredentials: true })
      dispatch(setUserData(result.data))
      navigate("/")
      toast.success("Login Successfully")
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || "Google login failed")
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4'>
      <div className='w-full max-w-4xl bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] flex overflow-hidden animate-[fadeIn_0.5s_ease-out]'>

        {/* Form Side */}
        <div className='w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center'>
          <div className='mb-8'>
            <h1 className='text-3xl font-bold text-gray-900'>Welcome back</h1>
            <p className='text-gray-500 mt-1'>Login to your account</p>
          </div>

          <form className='space-y-5' onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="email" className='block text-sm font-medium text-gray-700 mb-1.5'>Email</label>
              <input
                id='email' type="email" placeholder='you@example.com'
                className='w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-black focus:ring-2 focus:ring-black/5 outline-none transition-all duration-300'
                onChange={(e) => setEmail(e.target.value)} value={email}
              />
            </div>

            <div className='relative'>
              <label htmlFor="password" className='block text-sm font-medium text-gray-700 mb-1.5'>Password</label>
              <input
                id='password' type={show ? "text" : "password"} placeholder='••••••••'
                className='w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-black focus:ring-2 focus:ring-black/5 outline-none transition-all duration-300 pr-12'
                onChange={(e) => setPassword(e.target.value)} value={password}
              />
              <button type='button' className='absolute right-4 top-[38px] text-gray-400 hover:text-gray-700 transition-colors cursor-pointer' onClick={() => setShow(prev => !prev)}>
                {show ? <MdRemoveRedEye size={20} /> : <MdOutlineRemoveRedEye size={20} />}
              </button>
            </div>

            <div className='flex justify-end'>
              <span className='text-sm text-gray-500 hover:text-black cursor-pointer transition-colors' onClick={() => navigate("/forgotpassword")}>Forgot password?</span>
            </div>

            <button
              className='w-full py-3 bg-black text-white rounded-xl font-medium text-sm hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer'
              disabled={loading} onClick={handleLogin}
            >
              {loading ? <ClipLoader size={20} color='white' /> : "Login"}
            </button>
          </form>

          <div className='flex items-center gap-3 my-6'>
            <div className='flex-1 h-px bg-gray-200' />
            <span className='text-xs text-gray-400 uppercase tracking-wider'>or</span>
            <div className='flex-1 h-px bg-gray-200' />
          </div>

          <button
            className='w-full py-3 border border-gray-200 rounded-xl flex items-center justify-center gap-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 cursor-pointer'
            onClick={googleLogin}
          >
            <img src={google} alt="" className='w-5' />
            Continue with Google
          </button>

          <p className='text-center text-sm text-gray-500 mt-6'>
            Don't have an account?{' '}
            <span className='text-black font-semibold cursor-pointer hover:underline' onClick={() => navigate("/signup")}>Sign up</span>
          </p>
        </div>

        {/* Brand Side */}
        <div className='hidden md:flex w-1/2 bg-gradient-to-br from-black via-gray-900 to-black items-center justify-center flex-col p-10'>
          <img src={logo} className='w-24 rounded-2xl shadow-2xl mb-6' alt="" />
          <h2 className='text-white text-2xl font-bold tracking-wide'>VIRTUAL COURSES</h2>
          <p className='text-gray-400 text-sm mt-2 text-center max-w-xs'>Learn from industry experts and advance your career with our premium courses</p>
        </div>
      </div>
    </div>
  )
}

export default Login
