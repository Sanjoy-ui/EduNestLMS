import axios from 'axios'
import React, { useState } from 'react'
import { FaArrowLeftLong } from "react-icons/fa6"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { serverUrl } from '../../App'
import { setLectureData } from '../../redux/lectureSlice'
import { toast } from 'react-toastify'
import { ClipLoader } from 'react-spinners'

function EditLecture() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [loading1, setLoading1] = useState(false)
  const { courseId, lectureId } = useParams()
  const { lectureData } = useSelector(state => state.lecture)
  const dispatch = useDispatch()
  const selectedLecture = lectureData.find(lecture => lecture._id === lectureId)
  const [videoUrl, setVideoUrl] = useState(null)
  const [lectureTitle, setLectureTitle] = useState(selectedLecture?.lectureTitle || "")
  const [isPreviewFree, setIsPreviewFree] = useState(false)

  const editLecture = async () => {
    setLoading(true)
    const formData = new FormData()
    formData.append("lectureTitle", lectureTitle)
    formData.append("videoUrl", videoUrl)
    formData.append("isPreviewFree", isPreviewFree)
    try {
      const result = await axios.post(serverUrl + `/api/course/editlecture/${lectureId}`, formData, { withCredentials: true })
      dispatch(setLectureData([...lectureData, result.data]))
      toast.success("Lecture Updated")
      navigate("/courses")
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating lecture")
    } finally {
      setLoading(false)
    }
  }

  const removeLecture = async () => {
    setLoading1(true)
    try {
      await axios.delete(serverUrl + `/api/course/removelecture/${lectureId}`, { withCredentials: true })
      toast.success("Lecture Removed")
      navigate(`/createlecture/${courseId}`)
    } catch (error) {
      toast.error("Error removing lecture")
    } finally {
      setLoading1(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-xl mx-auto animate-[fadeIn_0.5s_ease-out]">

        <button className='w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer shadow-sm mb-6' onClick={() => navigate(`/createlecture/${courseId}`)}>
          <FaArrowLeftLong className='w-4 h-4 text-gray-600' />
        </button>

        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Edit Lecture</h2>
              <p className="text-sm text-gray-400 mt-0.5">Update lecture details and video</p>
            </div>
            <button className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-medium hover:bg-red-100 transition-all cursor-pointer" disabled={loading1} onClick={removeLecture}>
              {loading1 ? <ClipLoader size={16} color='#dc2626' /> : "Remove"}
            </button>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
              <input type="text" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-black focus:ring-2 focus:ring-black/5 outline-none transition-all" placeholder={selectedLecture?.lectureTitle} onChange={(e) => setLectureTitle(e.target.value)} value={lectureTitle} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Video</label>
              <input type="file" required accept='video/*' className="w-full border border-gray-200 rounded-xl p-2.5 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-black file:text-white hover:file:bg-gray-800 file:cursor-pointer" onChange={(e) => setVideoUrl(e.target.files[0])} />
            </div>

            <div className="flex items-center gap-3">
              <input type="checkbox" className="accent-black h-4 w-4 rounded" onChange={() => setIsPreviewFree(prev => !prev)} checked={isPreviewFree} />
              <label className="text-sm text-gray-700">Make this lecture free to preview</label>
            </div>
          </div>

          {loading && <p className="text-sm text-gray-400">Uploading video... Please wait.</p>}

          <button className="w-full bg-black text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition-all cursor-pointer" disabled={loading} onClick={editLecture}>
            {loading ? <ClipLoader size={18} color='white' /> : "Update Lecture"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditLecture
