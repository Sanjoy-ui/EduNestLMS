import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClipLoader } from 'react-spinners'
import { serverUrl } from '../App'
import { toast } from 'react-toastify'
import { FaArrowLeftLong } from "react-icons/fa6";

function ForgotPassword() {
  let navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [newpassword, setNewPassword] = useState("")
  const [conPassword, setConpassword] = useState("")

  const handleStep1 = async () => {
    setLoading(true)
    try {
      const result = await axios.post(`${serverUrl}/api/auth/sendotp`, { email }, { withCredentials: true })
      setStep(2)
      toast.success(result.data.message)
    } catch (error) {
      toast.error(error.response?.data?.message || "Error sending OTP")
    } finally {
      setLoading(false)
    }
  }

  const handleStep2 = async () => {
    setLoading(true)
    try {
      const result = await axios.post(`${serverUrl}/api/auth/verifyotp`, { email, otp }, { withCredentials: true })
      toast.success(result.data.message)
      setStep(3)
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed")
    } finally {
      setLoading(false)
    }
  }

  const handleStep3 = async () => {
    setLoading(true)
    try {
      if (newpassword !== conPassword) {
        setLoading(false)
        return toast.error("Passwords do not match")
      }
      const result = await axios.post(`${serverUrl}/api/auth/resetpassword`, { email, password: newpassword }, { withCredentials: true })
      toast.success(result.data.message)
      navigate("/login")
    } catch (error) {
      toast.error(error.response?.data?.message || "Reset failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 px-4">
      <div className="w-full max-w-md animate-[fadeIn_0.5s_ease-out]">

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${s <= step ? 'bg-black w-10' : 'bg-gray-200 w-6'}`} />
          ))}
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">

          {step === 1 && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Forgot Password?</h2>
              <p className="text-sm text-gray-400 mb-6">Enter your email to receive a verification code</p>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                  <input type="email" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-black focus:ring-2 focus:ring-black/5 outline-none transition-all" placeholder="you@example.com" onChange={(e) => setEmail(e.target.value)} value={email} required />
                </div>
                <button type="submit" className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-xl font-medium text-sm cursor-pointer transition-all duration-300" disabled={loading} onClick={handleStep1}>
                  {loading ? <ClipLoader size={20} color='white' /> : "Send OTP"}
                </button>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Enter OTP</h2>
              <p className="text-sm text-gray-400 mb-6">Enter the 4-digit code sent to your email</p>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Verification Code</label>
                  <input type="text" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-center tracking-[0.5em] font-mono focus:border-black focus:ring-2 focus:ring-black/5 outline-none transition-all" placeholder="----" onChange={(e) => setOtp(e.target.value)} value={otp} required maxLength={4} />
                </div>
                <button type="submit" className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-xl font-medium text-sm cursor-pointer transition-all duration-300" disabled={loading} onClick={handleStep2}>
                  {loading ? <ClipLoader size={20} color='white' /> : "Verify OTP"}
                </button>
              </form>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Reset Password</h2>
              <p className="text-sm text-gray-400 mb-6">Enter a new password for your account</p>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                  <input type="password" placeholder="Enter new password" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-black focus:ring-2 focus:ring-black/5 outline-none transition-all" onChange={(e) => setNewPassword(e.target.value)} value={newpassword} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                  <input type="password" placeholder="Re-enter new password" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-black focus:ring-2 focus:ring-black/5 outline-none transition-all" onChange={(e) => setConpassword(e.target.value)} value={conPassword} />
                </div>
                <button type="submit" className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-xl font-medium text-sm cursor-pointer transition-all duration-300" onClick={handleStep3}>
                  {loading ? <ClipLoader size={20} color='white' /> : "Reset Password"}
                </button>
              </form>
            </>
          )}

          <button className="w-full text-center text-sm text-gray-400 hover:text-gray-600 mt-5 cursor-pointer transition-colors" onClick={() => navigate("/login")}>
            <span className="flex items-center justify-center gap-2"><FaArrowLeftLong className="w-3 h-3" /> Back to Login</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
