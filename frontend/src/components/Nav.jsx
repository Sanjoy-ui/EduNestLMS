import React, { useState, useRef, useEffect } from 'react'
import logo from "../assets/main_logo.webp"
import { IoMdPerson } from "react-icons/io";
import { HiMenuAlt3 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { useNavigate, useLocation } from 'react-router-dom';
import { serverUrl } from '../App';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../redux/userSlice';

function Nav() {
  const [showHam, setShowHam] = useState(false)
  const [showPro, setShowPro] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { userData } = useSelector(state => state.user)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setShowHam(false)
    setShowPro(false)
  }, [location])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowPro(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      await axios.get(serverUrl + "/api/v1/auth/logout", { withCredentials: true })
      dispatch(setUserData(null))
      toast.success("Logged out successfully")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <nav className={`w-full h-[70px] fixed top-0 px-5 lg:px-12 flex items-center justify-between z-50 transition-all duration-500 ${scrolled ? 'bg-black/90 backdrop-blur-xl shadow-lg' : 'bg-black/50 backdrop-blur-md'}`}>
        {/* Logo */}
        <div 
          className='flex items-center gap-3 bg-[#060a17] border border-white/15 rounded-2xl px-4 py-2 cursor-pointer hover:border-white/30 hover:scale-[1.02] transition-all duration-300 shadow-md'
          onClick={() => navigate("/")}
        >
          {/* Geometric N Icon */}
          <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-cyan-500/20 via-indigo-500/20 to-purple-500/20 border border-cyan-500/30 rounded-xl">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 20V4L14 16V4M14 16L20 4V20" stroke="url(#navNexusGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="navNexusGrad" x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#38bdf8" />
                  <stop offset="0.5" stopColor="#818cf8" />
                  <stop offset="1" stopColor="#c084fc" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Crisp HTML/CSS Typography */}
          <div className='flex flex-col leading-tight justify-center'>
            <span className='text-sm lg:text-base font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400'>
              NEXUS LEARN
            </span>
            <span className='text-[8px] lg:text-[9px] font-bold tracking-widest text-gray-400 uppercase'>
              Growth Through Intelligent Learning
            </span>
          </div>
        </div>

        {/* Desktop Actions */}
        <div className='lg:flex items-center gap-3 hidden'>
          {userData?.role === "educator" && (
            <button className='px-5 py-2.5 border border-white/30 text-white rounded-xl text-sm font-medium hover:bg-white hover:text-black transition-all duration-300 cursor-pointer' onClick={() => navigate("/dashboard")}>
              Dashboard
            </button>
          )}
          {!userData ? (
            <button className='px-5 py-2.5 bg-white text-black rounded-xl text-sm font-semibold hover:bg-gray-100 transition-all duration-300 cursor-pointer shadow-lg' onClick={() => navigate("/login")}>
              Login
            </button>
          ) : (
            <button className='px-5 py-2.5 border border-white/30 text-white rounded-xl text-sm font-medium hover:bg-white/10 transition-all duration-300 cursor-pointer' onClick={handleLogout}>
              Logout
            </button>
          )}

          {/* Avatar / Profile */}
          <div className='relative' ref={dropdownRef}>
            {!userData ? (
              <IoMdPerson className='w-10 h-10 text-white cursor-pointer border border-white/30 bg-white/10 rounded-full p-2 hover:bg-white/20 transition-all duration-300' onClick={() => setShowPro(prev => !prev)} />
            ) : (
              <div className='w-10 h-10 rounded-full cursor-pointer ring-2 ring-white/30 hover:ring-white/60 transition-all duration-300 overflow-hidden' onClick={() => setShowPro(prev => !prev)}>
                {userData.photoUrl ? (
                  <img src={userData.photoUrl} className='w-full h-full object-cover' alt="" />
                ) : (
                  <div className='w-full h-full bg-gradient-to-br from-gray-700 to-black flex items-center justify-center text-white text-sm font-semibold'>
                    {userData?.name?.slice(0, 1).toUpperCase()}
                  </div>
                )}
              </div>
            )}

            {/* Dropdown */}
            {showPro && (
              <div className='absolute top-14 right-0 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-[fadeIn_0.2s_ease-out]'>
                {userData && (
                  <div className='px-4 py-3 border-b border-gray-100 bg-gray-50'>
                    <p className='text-sm font-semibold text-gray-800 truncate'>{userData.name}</p>
                    <p className='text-xs text-gray-500 truncate'>{userData.email}</p>
                  </div>
                )}
                <div className='py-1'>
                  <button className='w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer' onClick={() => navigate("/profile")}>My Profile</button>
                  <button className='w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer' onClick={() => navigate("/enrolledcourses")}>My Courses</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <HiMenuAlt3 className='w-7 h-7 lg:hidden text-white cursor-pointer hover:scale-110 transition-transform' onClick={() => setShowHam(true)} />
      </nav>

      {/* Mobile Slide-in Panel */}
      {showHam && <div className='fixed inset-0 bg-black/40 z-50 lg:hidden' onClick={() => setShowHam(false)} />}
      <div className={`fixed top-0 right-0 w-72 h-full bg-black z-50 lg:hidden transition-transform duration-500 ease-out ${showHam ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className='flex items-center justify-between p-5 border-b border-white/10'>
          <span className='text-white font-semibold text-lg'>Menu</span>
          <IoClose className='w-7 h-7 text-white cursor-pointer hover:rotate-90 transition-transform duration-300' onClick={() => setShowHam(false)} />
        </div>

        {userData && (
          <div className='px-5 py-4 border-b border-white/10 flex items-center gap-3'>
            <div className='w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/20 flex-shrink-0'>
              {userData.photoUrl ? (
                <img src={userData.photoUrl} className='w-full h-full object-cover' alt="" />
              ) : (
                <div className='w-full h-full bg-gradient-to-br from-gray-600 to-black flex items-center justify-center text-white text-sm font-semibold'>
                  {userData?.name?.slice(0, 1).toUpperCase()}
                </div>
              )}
            </div>
            <div className='min-w-0'>
              <p className='text-white text-sm font-medium truncate'>{userData.name}</p>
              <p className='text-gray-400 text-xs truncate'>{userData.role}</p>
            </div>
          </div>
        )}

        <div className='flex flex-col p-3 gap-1'>
          <button className='w-full text-left text-white px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-sm cursor-pointer' onClick={() => navigate("/profile")}>My Profile</button>
          <button className='w-full text-left text-white px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-sm cursor-pointer' onClick={() => navigate("/enrolledcourses")}>My Courses</button>
          {userData?.role === "educator" && (
            <button className='w-full text-left text-white px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-sm cursor-pointer' onClick={() => navigate("/dashboard")}>Dashboard</button>
          )}
          <div className='border-t border-white/10 mt-2 pt-2'>
            {!userData ? (
              <button className='w-full bg-white text-black py-3 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-colors cursor-pointer' onClick={() => navigate("/login")}>Login</button>
            ) : (
              <button className='w-full border border-white/20 text-white py-3 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors cursor-pointer' onClick={handleLogout}>Logout</button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Nav