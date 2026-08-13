import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaEdit } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { serverUrl } from '../../App';
import { ClipLoader } from 'react-spinners';
import { useDispatch, useSelector } from 'react-redux';
import { setLectureData } from '../../redux/lectureSlice';

function CreateLecture() {
  const navigate = useNavigate()
  const { courseId } = useParams()
  const [lectureTitle, setLectureTitle] = useState("")
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const { lectureData } = useSelector(state => state.lecture)

  const createLectureHandler = async () => {
    setLoading(true)
    try {
      const result = await axios.post(serverUrl + `/api/course/createlecture/${courseId}`, { lectureTitle }, { withCredentials: true })
      dispatch(setLectureData([...lectureData, result.data.lecture]))
      toast.success("Lecture Created")
      setLectureTitle("")
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating lecture")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const getLecture = async () => {
      try {
        const result = await axios.get(serverUrl + `/api/course/getcourselecture/${courseId}`, { withCredentials: true })
        dispatch(setLectureData(result.data.lectures))
      } catch (error) {
        console.log(error)
      }
    }
    getLecture()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto animate-[fadeIn_0.5s_ease-out]">

        <button className='w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer shadow-sm mb-6' onClick={() => navigate(`/addcourses/${courseId}`)}>
          <FaArrowLeftLong className='w-4 h-4 text-gray-600' />
        </button>

        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Add Lectures</h1>
          <p className="text-sm text-gray-400 mb-6">Add video lectures to enhance your course content.</p>

          <div className="flex gap-3 mb-8">
            <input type="text" placeholder="e.g. Introduction to MERN Stack" className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-black focus:ring-2 focus:ring-black/5 outline-none transition-all" onChange={(e) => setLectureTitle(e.target.value)} value={lectureTitle} />
            <button className="px-5 py-3 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-all cursor-pointer whitespace-nowrap" disabled={loading} onClick={createLectureHandler}>
              {loading ? <ClipLoader size={18} color='white' /> : "+ Add"}
            </button>
          </div>

          <div className="space-y-2">
            {lectureData.map((lecture, index) => (
              <div key={index} className="flex justify-between items-center px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl">
                <span className="text-sm text-gray-700"><span className="text-gray-400 mr-2">{index + 1}.</span>{lecture.lectureTitle}</span>
                <button className="w-8 h-8 rounded-lg hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer" onClick={() => navigate(`/editlecture/${courseId}/${lecture._id}`)}>
                  <FaEdit className="text-gray-500 w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateLecture
