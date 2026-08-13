import React, { useEffect, useRef, useState } from 'react'
import img from "../../assets/empty.jpg"
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate, useParams } from 'react-router-dom';
import { serverUrl } from '../../App';
import { FiCamera } from "react-icons/fi";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { ClipLoader } from 'react-spinners';
import { setCourseData } from '../../redux/courseSlice';

function AddCourses() {
  const navigate = useNavigate()
  const { courseId } = useParams()
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [title, setTitle] = useState("")
  const [subTitle, setSubTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [level, setLevel] = useState("")
  const [price, setPrice] = useState("")
  const [isPublished, setIsPublished] = useState(false)
  const thumb = useRef()
  const [frontendImage, setFrontendImage] = useState(null)
  const [backendImage, setBackendImage] = useState(null)
  let [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const { courseData } = useSelector(state => state.course)

  const categories = ["App Development", "AI/ML", "AI Tools", "Data Science", "Data Analytics", "Ethical Hacking", "UI UX Designing", "Web Development", "Others"];

  const getCourseById = async () => {
    try {
      const result = await axios.get(serverUrl + `/api/course/getcourse/${courseId}`, { withCredentials: true })
      setSelectedCourse(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (selectedCourse) {
      setTitle(selectedCourse.title || "")
      setSubTitle(selectedCourse.subTitle || "")
      setDescription(selectedCourse.description || "")
      setCategory(selectedCourse.category || "")
      setLevel(selectedCourse.level || "")
      setPrice(selectedCourse.price || "")
      setFrontendImage(selectedCourse.thumbnail || img)
      setIsPublished(selectedCourse?.isPublished)
    }
  }, [selectedCourse])

  useEffect(() => { getCourseById() }, [])

  const handleThumbnail = (e) => {
    const file = e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }

  const editCourseHandler = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("subTitle", subTitle);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("level", level);
    formData.append("price", price);
    formData.append("thumbnail", backendImage);
    formData.append("isPublished", isPublished);
    try {
      const result = await axios.post(`${serverUrl}/api/course/editcourse/${courseId}`, formData, { withCredentials: true });
      const updatedCourse = result.data;
      if (updatedCourse.isPublished) {
        const updatedCourses = courseData.map(c => c._id === courseId ? updatedCourse : c);
        if (!courseData.some(c => c._id === courseId)) updatedCourses.push(updatedCourse);
        dispatch(setCourseData(updatedCourses));
      } else {
        dispatch(setCourseData(courseData.filter(c => c._id !== courseId)));
      }
      navigate("/courses");
      toast.success("Course Updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const removeCourse = async () => {
    setLoading(true)
    try {
      await axios.delete(serverUrl + `/api/course/removecourse/${courseId}`, { withCredentials: true })
      toast.success("Course Deleted")
      dispatch(setCourseData(courseData.filter(c => c._id !== courseId)));
      navigate("/courses")
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting course")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto animate-[fadeIn_0.5s_ease-out]">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button className='w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer shadow-sm' onClick={() => navigate("/courses")}>
              <FaArrowLeftLong className='w-4 h-4 text-gray-600' />
            </button>
            <h2 className="text-xl font-bold text-gray-900">Edit Course</h2>
          </div>
          <button className="px-6 py-2.5 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-all cursor-pointer" onClick={() => navigate(`/createlecture/${selectedCourse?._id}`)}>Manage Lectures</button>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">

          {/* Publish / Delete */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all cursor-pointer ${isPublished ? "text-red-600 bg-red-50 border-red-200 hover:bg-red-100" : "text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100"}`} onClick={() => setIsPublished(prev => !prev)}>
              {isPublished ? "Unpublish" : "Publish"}
            </button>
            <button className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-all cursor-pointer" disabled={loading} onClick={removeCourse}>
              {loading ? <ClipLoader size={18} color='white' /> : "Delete Course"}
            </button>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
              <input type="text" placeholder="Course Title" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-black focus:ring-2 focus:ring-black/5 outline-none transition-all" onChange={(e) => setTitle(e.target.value)} value={title} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Subtitle</label>
              <input type="text" placeholder="Subtitle" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-black focus:ring-2 focus:ring-black/5 outline-none transition-all" onChange={(e) => setSubTitle(e.target.value)} value={subTitle} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea placeholder="Course description" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm h-28 resize-none focus:border-black focus:ring-2 focus:ring-black/5 outline-none transition-all" onChange={(e) => setDescription(e.target.value)} value={description}></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                <select className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white focus:border-black focus:ring-2 focus:ring-black/5 outline-none transition-all" onChange={(e) => setCategory(e.target.value)} value={category}>
                  <option value="">Select</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Level</label>
                <select className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white focus:border-black focus:ring-2 focus:ring-black/5 outline-none transition-all" onChange={(e) => setLevel(e.target.value)} value={level}>
                  <option value="">Select</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (INR)</label>
                <input type="number" placeholder="&#8377;" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-black focus:ring-2 focus:ring-black/5 outline-none transition-all" onChange={(e) => setPrice(e.target.value)} value={price} />
              </div>
            </div>

            {/* Thumbnail */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Thumbnail</label>
              <input type="file" ref={thumb} hidden onChange={handleThumbnail} accept='image/*' />
              <div className="relative w-72 h-44 rounded-2xl overflow-hidden border border-gray-200 cursor-pointer group" onClick={() => thumb.current.click()}>
                <img src={frontendImage} alt="" className='w-full h-full object-cover' />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <FiCamera className="text-white w-6 h-6" />
                </div>
              </div>
            </div>

            <div className='flex items-center gap-3 pt-2'>
              <button className='px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-all cursor-pointer' onClick={() => navigate("/courses")}>Cancel</button>
              <button className='px-8 py-2.5 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-all cursor-pointer' disabled={loading} onClick={editCourseHandler}>
                {loading ? <ClipLoader size={18} color='white' /> : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddCourses
