import React from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeftLong } from "react-icons/fa6";

function EnrolledCourse() {
  const navigate = useNavigate()
  const { userData } = useSelector((state) => state.user);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto animate-[fadeIn_0.5s_ease-out]">

        <div className="flex items-center gap-4 mb-8">
          <button className='w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer shadow-sm' onClick={() => navigate("/")}>
            <FaArrowLeftLong className='w-4 h-4 text-gray-600' />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">My Enrolled Courses</h1>
        </div>

        {userData?.enrolledCourses?.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">You haven't enrolled in any course yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userData?.enrolledCourses?.map((course) => (
              <div key={course._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="overflow-hidden">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">{course.category}</span>
                    <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">{course.level}</span>
                  </div>
                  <h2 className="text-base font-semibold text-gray-900 line-clamp-2 mb-4">{course.title}</h2>
                  <button className="w-full py-2.5 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-all cursor-pointer" onClick={() => navigate(`/viewlecture/${course._id}`)}>Watch Now</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default EnrolledCourse
