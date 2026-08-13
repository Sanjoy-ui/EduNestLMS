import React, { useEffect } from 'react'
import { FaEdit } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';
import { setCreatorCourseData } from '../../redux/courseSlice';
import img1 from "../../assets/empty.jpg"
import { FaArrowLeftLong } from "react-icons/fa6";

function Courses() {
  let navigate = useNavigate()
  let dispatch = useDispatch()
  const { creatorCourseData } = useSelector(state => state.course)

  useEffect(() => {
    const getCreatorData = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/course/getcreatorcourses", { withCredentials: true })
        await dispatch(setCreatorCourseData(result.data))
      } catch (error) {
        console.log(error)
        toast.error(error.response?.data?.message || "Error loading courses")
      }
    }
    getCreatorData()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto animate-[fadeIn_0.5s_ease-out]">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className='flex items-center gap-4'>
            <button className='w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer shadow-sm' onClick={() => navigate("/dashboard")}>
              <FaArrowLeftLong className='w-4 h-4 text-gray-600' />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Your Courses</h1>
          </div>
          <button className="px-6 py-2.5 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-all cursor-pointer" onClick={() => navigate("/createcourses")}>+ Create Course</button>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left py-3.5 px-5 font-medium text-gray-500 text-xs uppercase tracking-wider">Course</th>
                <th className="text-left py-3.5 px-5 font-medium text-gray-500 text-xs uppercase tracking-wider">Price</th>
                <th className="text-left py-3.5 px-5 font-medium text-gray-500 text-xs uppercase tracking-wider">Status</th>
                <th className="text-left py-3.5 px-5 font-medium text-gray-500 text-xs uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {creatorCourseData?.map((course, index) => (
                <tr key={index} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-3.5 px-5 flex items-center gap-4">
                    <img src={course?.thumbnail || img1} alt="" className="w-20 h-12 object-cover rounded-lg" />
                    <span className="font-medium text-gray-800">{course?.title}</span>
                  </td>
                  <td className="py-3.5 px-5 text-gray-700">{course?.price ? `₹${course.price}` : '—'}</td>
                  <td className="py-3.5 px-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${course?.isPublished ? "text-emerald-600 bg-emerald-50" : "text-amber-600 bg-amber-50"}`}>
                      {course?.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="py-3.5 px-5">
                    <button className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer" onClick={() => navigate(`/addcourses/${course?._id}`)}>
                      <FaEdit className="text-gray-600 w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {creatorCourseData?.map((course, index) => (
            <div key={index} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <div className="flex gap-4 items-center">
                <img src={course?.thumbnail || img1} alt="" className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <h2 className="font-medium text-sm text-gray-900 truncate">{course?.title}</h2>
                  <p className="text-gray-500 text-xs mt-0.5">{course?.price ? `₹${course.price}` : '—'}</p>
                  <span className={`inline-block mt-1.5 px-2.5 py-0.5 text-xs rounded-full font-medium ${course?.isPublished ? "text-emerald-600 bg-emerald-50" : "text-amber-600 bg-amber-50"}`}>
                    {course?.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
                <button className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer shrink-0" onClick={() => navigate(`/addcourses/${course?._id}`)}>
                  <FaEdit className="text-gray-600 w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {creatorCourseData?.length > 0 && (
          <p className="text-center text-xs text-gray-300 mt-6">{creatorCourseData.length} course{creatorCourseData.length !== 1 ? 's' : ''}</p>
        )}
      </div>
    </div>
  );
}

export default Courses
