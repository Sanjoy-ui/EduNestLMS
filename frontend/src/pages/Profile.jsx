import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeftLong } from "react-icons/fa6";
import { MdEmail, MdSchool } from "react-icons/md";
import { FiEdit3 } from "react-icons/fi";

function Profile() {
  const { userData } = useSelector(state => state.user)
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 px-4 py-12 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-8 md:p-10 max-w-lg w-full relative animate-[fadeIn_0.5s_ease-out]">

        {/* Back Button */}
        <button className='absolute top-6 left-6 w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer' onClick={() => navigate("/")}>
          <FaArrowLeftLong className='w-4 h-4 text-gray-600' />
        </button>

        {/* Avatar */}
        <div className="flex flex-col items-center text-center mt-4">
          {userData?.photoUrl ? (
            <img src={userData.photoUrl} alt="" className="w-24 h-24 rounded-2xl object-cover ring-4 ring-gray-100" />
          ) : (
            <div className='w-24 h-24 rounded-2xl bg-gradient-to-br from-gray-800 to-black flex items-center justify-center text-white text-3xl font-bold ring-4 ring-gray-100'>
              {userData?.name?.slice(0, 1).toUpperCase()}
            </div>
          )}
          <h2 className="text-2xl font-bold mt-5 text-gray-900">{userData?.name}</h2>
          <span className="inline-block mt-1.5 px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full capitalize">{userData?.role}</span>
        </div>

        {/* Info Cards */}
        <div className="mt-8 space-y-3">
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-100">
            <MdEmail className='w-5 h-5 text-gray-400' />
            <div>
              <p className='text-xs text-gray-400 font-medium'>Email</p>
              <p className='text-sm text-gray-800'>{userData?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-100">
            <MdSchool className='w-5 h-5 text-gray-400' />
            <div>
              <p className='text-xs text-gray-400 font-medium'>Enrolled Courses</p>
              <p className='text-sm text-gray-800'>{userData?.enrolledCourses?.length || 0} courses</p>
            </div>
          </div>

          {userData?.description && (
            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
              <p className='text-xs text-gray-400 font-medium mb-1'>Bio</p>
              <p className='text-sm text-gray-700 leading-relaxed'>{userData.description}</p>
            </div>
          )}
        </div>

        {/* Edit Button */}
        <button
          className="mt-8 w-full py-3 bg-black text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-gray-800 transition-all duration-300 cursor-pointer"
          onClick={() => navigate("/editprofile")}
        >
          <FiEdit3 className='w-4 h-4' /> Edit Profile
        </button>
      </div>
    </div>
  )
}

export default Profile
