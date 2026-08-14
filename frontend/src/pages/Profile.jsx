import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeftLong, FaUserCheck, FaGraduationCap, FaArrowRight } from "react-icons/fa6";
import { MdEmail, MdSchool, MdSecurity } from "react-icons/md";
import { FiEdit3, FiLogOut } from "react-icons/fi";
import axios from 'axios';
import { serverUrl } from '../App';
import { setUserData } from '../redux/userSlice';
import { toast } from 'react-toastify';
import Card from "../components/Card.jsx";

function Profile() {
  const { userData } = useSelector(state => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-8 animate-[fadeIn_0.5s_ease-out]">

        {/* Back Button */}
        <button
          className='w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer shadow-sm'
          onClick={() => navigate("/")}
        >
          <FaArrowLeftLong className='w-4 h-4 text-gray-600' />
        </button>

        {/* Top Profile Header & Cover Banner */}
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
          
          {/* Cover Header Graphic */}
          <div className="h-44 w-full bg-gradient-to-r from-gray-900 via-indigo-950 to-purple-950 relative p-6">
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => navigate("/editprofile")}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-xl text-xs font-semibold border border-white/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <FiEdit3 className='w-3.5 h-3.5' /> Edit Profile
              </button>
              <button
                onClick={handleLogout}
                className="px-3.5 py-2 bg-red-500/20 hover:bg-red-500/30 backdrop-blur-md text-red-300 rounded-xl text-xs font-semibold border border-red-500/30 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <FiLogOut className='w-3.5 h-3.5' /> Logout
              </button>
            </div>
          </div>

          {/* Profile Identity Details Bar */}
          <div className="px-8 pb-8 pt-0 relative flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-5 -mt-14">
              
              {/* User Avatar */}
              {userData?.photoUrl ? (
                <img
                  src={userData.photoUrl}
                  alt={userData?.name}
                  className="w-28 h-28 rounded-3xl object-cover ring-4 ring-white shadow-lg shrink-0"
                />
              ) : (
                <div className='w-28 h-28 rounded-3xl bg-gradient-to-br from-gray-800 to-black flex items-center justify-center text-white text-4xl font-extrabold ring-4 ring-white shadow-lg shrink-0'>
                  {userData?.name?.slice(0, 1).toUpperCase()}
                </div>
              )}

              {/* Identity Info */}
              <div className="space-y-1.5 pt-2 md:pt-0 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <h1 className="text-2xl font-extrabold text-gray-900 leading-none">{userData?.name}</h1>
                  <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-md flex items-center gap-1">
                    <FaUserCheck className="w-3 h-3 text-blue-600" /> Verified
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 font-semibold rounded-full capitalize">
                    {userData?.role || "Student"}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-500 font-medium">{userData?.email}</span>
                </div>
              </div>
            </div>

            {/* Quick Action Link */}
            <button
              onClick={() => navigate("/enrolledcourses")}
              className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-semibold hover:bg-black transition-all cursor-pointer shadow-sm flex items-center gap-1.5 shrink-0"
            >
              <span>My Enrolled Courses</span>
              <FaArrowRight className="w-3 h-3" />
            </button>
          </div>

        </div>

        {/* Account Details & Bio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Email Info Card */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <MdEmail className='w-6 h-6' />
            </div>
            <div>
              <p className='text-xs text-gray-400 font-semibold uppercase tracking-wider'>Email Address</p>
              <p className='text-sm font-bold text-gray-900 truncate'>{userData?.email}</p>
            </div>
          </div>

          {/* Role Info Card */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <MdSecurity className='w-6 h-6' />
            </div>
            <div>
              <p className='text-xs text-gray-400 font-semibold uppercase tracking-wider'>Account Type</p>
              <p className='text-sm font-bold text-gray-900 capitalize'>{userData?.role || "Student"} Account</p>
            </div>
          </div>

          {/* Enrolled Count Card */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <MdSchool className='w-6 h-6' />
            </div>
            <div>
              <p className='text-xs text-gray-400 font-semibold uppercase tracking-wider'>Enrolled Courses</p>
              <p className='text-sm font-bold text-gray-900'>{userData?.enrolledCourses?.length || 0} Active Courses</p>
            </div>
          </div>

        </div>

        {/* Biography / Description Card */}
        {userData?.description && (
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-2">
            <h3 className='text-xs font-bold uppercase tracking-wider text-gray-400'>About Me</h3>
            <p className='text-sm text-gray-700 leading-relaxed font-normal'>{userData.description}</p>
          </div>
        )}

        {/* Enrolled Courses Gallery Showcase */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FaGraduationCap className="w-5 h-5 text-purple-600" />
              <span>Enrolled Learning Gallery ({userData?.enrolledCourses?.length || 0})</span>
            </h2>
            {userData?.enrolledCourses?.length > 0 && (
              <button
                onClick={() => navigate("/enrolledcourses")}
                className="text-xs font-semibold text-purple-600 hover:text-purple-800 transition-colors cursor-pointer"
              >
                View All
              </button>
            )}
          </div>

          {userData?.enrolledCourses?.length > 0 ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {userData.enrolledCourses.map((course, index) => {
                const item = typeof course === 'object' ? course : null;
                if (!item) return null;
                return (
                  <Card
                    key={index}
                    thumbnail={item.thumbnail}
                    title={item.title}
                    subTitle={item.subTitle}
                    price={item.price}
                    category={item.category}
                    level={item.level}
                    id={item._id}
                    reviews={item.reviews}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-3">
              <p className="text-sm font-bold text-gray-800">No courses enrolled yet</p>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                Explore our catalog of web development, AI, and data science courses to start learning.
              </p>
              <button
                onClick={() => navigate("/allcourses")}
                className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-semibold hover:bg-black transition-all cursor-pointer shadow-sm"
              >
                Explore Catalog
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Profile;
