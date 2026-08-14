import React, { useState, useRef, useEffect } from 'react';
import { HiMenuAlt3 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { serverUrl } from '../App';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { FaGraduationCap, FaUser, FaRobot } from 'react-icons/fa6';
import { FiLogOut, FiLayout } from 'react-icons/fi';

function Nav() {
  const [showHam, setShowHam] = useState(false);
  const [showPro, setShowPro] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { userData } = useSelector(state => state.user);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setShowHam(false);
    setShowPro(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowPro(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/v1/auth/logout`, { withCredentials: true });
      dispatch(setUserData(null));
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      dispatch(setUserData(null));
      navigate("/login");
    }
  };

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Courses", path: "/allcourses" },
    { label: "AI Search", path: "/searchwithai" },
  ];

  return (
    <>
      <nav className={`w-full h-[72px] fixed top-0 px-5 lg:px-12 flex items-center justify-between z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#050811]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl' : 'bg-[#050811]/80 backdrop-blur-md border-b border-white/5'
      }`}>
        
        {/* Brand Logo */}
        <div 
          className='flex items-center gap-3 bg-[#0a0f24] border border-white/15 rounded-2xl px-4 py-2 cursor-pointer hover:border-cyan-500/40 transition-all duration-300 shadow-md group'
          onClick={() => navigate("/")}
        >
          <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-cyan-500/20 via-indigo-500/20 to-purple-500/20 border border-cyan-500/30 rounded-xl group-hover:scale-105 transition-transform">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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

          <div className='flex flex-col leading-tight justify-center'>
            <span className='text-sm lg:text-base font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400'>
              NEXUS LEARN
            </span>
            <span className='text-[8px] lg:text-[9px] font-bold tracking-widest text-gray-400 uppercase'>
              Growth Through Intelligent Learning
            </span>
          </div>
        </div>

        {/* Center Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`text-xs font-semibold tracking-wide transition-all relative py-1 ${
                  isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right Desktop Actions */}
        <div className='hidden lg:flex items-center gap-4'>
          
          {/* Educator Dashboard Shortcut */}
          {userData?.role === "educator" && (
            <button
              className='px-4 py-2 border border-white/20 text-white rounded-xl text-xs font-semibold hover:bg-white/10 transition-all cursor-pointer flex items-center gap-1.5'
              onClick={() => navigate("/dashboard")}
            >
              <FiLayout className="w-3.5 h-3.5 text-cyan-400" />
              <span>Dashboard</span>
            </button>
          )}

          {/* Visitor CTA (Start Learning & Sign In) vs Logged-In User */}
          {!userData ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/login")}
                className="text-xs font-semibold text-gray-300 hover:text-white transition-colors cursor-pointer px-2"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate("/allcourses")}
                className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg shadow-cyan-500/20 border border-white/20 flex items-center gap-1.5"
              >
                <span>Start Learning</span>
                <FaGraduationCap className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className='relative' ref={dropdownRef}>
              <div
                className='w-9 h-9 rounded-xl cursor-pointer ring-2 ring-cyan-500/40 hover:ring-cyan-400 transition-all overflow-hidden shadow-md flex items-center justify-center bg-gray-800'
                onClick={() => setShowPro(prev => !prev)}
              >
                {userData.photoUrl ? (
                  <img src={userData.photoUrl} className='w-full h-full object-cover' alt="User Avatar" />
                ) : (
                  <div className='w-full h-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center text-white text-xs font-bold'>
                    {userData?.name?.slice(0, 1).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              {showPro && (
                <div className='absolute top-12 right-0 w-60 bg-[#0a0f24] rounded-2xl shadow-2xl border border-white/15 p-2 space-y-1 z-50 animate-[fadeIn_0.15s_ease-out] text-xs'>
                  <div className='px-3.5 py-3 border-b border-white/10 rounded-xl bg-white/5 space-y-0.5'>
                    <p className='font-bold text-white truncate'>{userData.name}</p>
                    <p className='text-[11px] text-gray-400 truncate'>{userData.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-cyan-500/20 text-cyan-300 text-[10px] font-semibold rounded-md capitalize">
                      {userData.role || "Student"}
                    </span>
                  </div>

                  <div className='py-1 space-y-0.5'>
                    <button
                      className='w-full flex items-center gap-2.5 px-3.5 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer'
                      onClick={() => navigate("/profile")}
                    >
                      <FaUser className="w-3.5 h-3.5 text-cyan-400" /> My Profile
                    </button>
                    <button
                      className='w-full flex items-center gap-2.5 px-3.5 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer'
                      onClick={() => navigate("/enrolledcourses")}
                    >
                      <FaGraduationCap className="w-3.5 h-3.5 text-purple-400" /> Enrolled Courses
                    </button>
                    <button
                      className='w-full flex items-center gap-2.5 px-3.5 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer'
                      onClick={() => navigate("/searchwithai")}
                    >
                      <FaRobot className="w-3.5 h-3.5 text-indigo-400" /> AI Search Assistant
                    </button>
                    {userData?.role === "educator" && (
                      <button
                        className='w-full flex items-center gap-2.5 px-3.5 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer'
                        onClick={() => navigate("/dashboard")}
                      >
                        <FiLayout className="w-3.5 h-3.5 text-blue-400" /> Educator Dashboard
                      </button>
                    )}
                  </div>

                  <div className="border-t border-white/10 pt-1">
                    <button
                      className='w-full flex items-center gap-2.5 px-3.5 py-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer font-semibold'
                      onClick={handleLogout}
                    >
                      <FiLogOut className="w-3.5 h-3.5" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <HiMenuAlt3 className='w-7 h-7 lg:hidden text-white cursor-pointer hover:scale-105 transition-transform' onClick={() => setShowHam(true)} />
      </nav>

      {/* Mobile Slide-in Drawer */}
      {showHam && <div className='fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden' onClick={() => setShowHam(false)} />}
      <div className={`fixed top-0 right-0 w-72 h-full bg-[#0a0f24] border-l border-white/10 z-50 lg:hidden transition-transform duration-300 ease-out flex flex-col justify-between ${showHam ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div>
          <div className='flex items-center justify-between p-5 border-b border-white/10'>
            <span className='text-white font-bold text-base'>Navigation Menu</span>
            <IoClose className='w-6 h-6 text-gray-400 cursor-pointer hover:text-white transition-colors' onClick={() => setShowHam(false)} />
          </div>

          {userData && (
            <div className='p-5 border-b border-white/10 flex items-center gap-3 bg-white/5'>
              <div className='w-10 h-10 rounded-xl overflow-hidden ring-2 ring-cyan-500/30 shrink-0'>
                {userData.photoUrl ? (
                  <img src={userData.photoUrl} className='w-full h-full object-cover' alt="" />
                ) : (
                  <div className='w-full h-full bg-gradient-to-br from-gray-700 to-black flex items-center justify-center text-white text-xs font-bold'>
                    {userData?.name?.slice(0, 1).toUpperCase()}
                  </div>
                )}
              </div>
              <div className='min-w-0'>
                <p className='text-white text-xs font-bold truncate'>{userData.name}</p>
                <p className='text-gray-400 text-[10px] truncate'>{userData.email}</p>
              </div>
            </div>
          )}

          <div className='flex flex-col p-4 space-y-1 text-xs'>
            {navLinks.map((link) => (
              <button
                key={link.path}
                className='w-full text-left text-gray-300 font-semibold px-4 py-3 rounded-xl hover:bg-white/10 hover:text-white transition-all cursor-pointer'
                onClick={() => navigate(link.path)}
              >
                {link.label}
              </button>
            ))}

            {userData && (
              <>
                <button className='w-full text-left text-gray-300 font-semibold px-4 py-3 rounded-xl hover:bg-white/10 hover:text-white transition-all cursor-pointer' onClick={() => navigate("/profile")}>My Profile</button>
                <button className='w-full text-left text-gray-300 font-semibold px-4 py-3 rounded-xl hover:bg-white/10 hover:text-white transition-all cursor-pointer' onClick={() => navigate("/enrolledcourses")}>Enrolled Courses</button>
              </>
            )}

            {userData?.role === "educator" && (
              <button className='w-full text-left text-gray-300 font-semibold px-4 py-3 rounded-xl hover:bg-white/10 hover:text-white transition-all cursor-pointer' onClick={() => navigate("/dashboard")}>Educator Dashboard</button>
            )}
          </div>
        </div>

        <div className='p-5 border-t border-white/10'>
          {!userData ? (
            <div className="space-y-2">
              <button
                className='w-full py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md'
                onClick={() => navigate("/allcourses")}
              >
                Start Learning
              </button>
              <button
                className='w-full py-2.5 bg-white/5 border border-white/10 text-gray-300 rounded-xl text-xs font-semibold hover:bg-white/10 transition-all cursor-pointer'
                onClick={() => navigate("/login")}
              >
                Sign In
              </button>
            </div>
          ) : (
            <button
              className='w-full py-3 border border-red-500/30 bg-red-500/10 text-red-400 rounded-xl text-xs font-semibold hover:bg-red-500/20 transition-all cursor-pointer'
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
        </div>

      </div>
    </>
  );
}

export default Nav;