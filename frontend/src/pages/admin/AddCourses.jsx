import React, { useEffect, useRef, useState } from 'react';
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate, useParams } from 'react-router-dom';
import { serverUrl } from '../../App';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { useDispatch, useSelector } from 'react-redux';
import { setCourseData } from '../../redux/courseSlice';
import img from "../../assets/empty.jpg";
import { FiCamera, FiPlusCircle } from "react-icons/fi";

function AddCourses() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { creatorCourseData, courseData } = useSelector(state => state.course);
  const selectedCourse = creatorCourseData.find(course => course._id === courseId);
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [price, setPrice] = useState("");
  const [frontendImage, setFrontendImage] = useState(img);
  const [backendImage, setBackendImage] = useState(null);
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(false);

  const thumb = useRef(null);

  const categories = [
    "App Development",
    "Web Development",
    "Data Science",
    "Artificial Intelligence",
    "Cloud Computing",
    "Cyber Security",
    "DevOps",
    "Game Development",
    "UI/UX Design",
    "Software Testing"
  ];

  const getCourseById = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/v1/course/getcourse/${courseId}`, { withCredentials: true });
      const course = result.data;
      setTitle(course.title || "");
      setSubTitle(course.subTitle || "");
      setDescription(course.description || "");
      setCategory(course.category || "");
      setLevel(course.level || "");
      setPrice(course.price || "");
      setFrontendImage(course.thumbnail || img);
      setIsPublished(course?.isPublished || false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (selectedCourse) {
      setTitle(selectedCourse.title || "");
      setSubTitle(selectedCourse.subTitle || "");
      setDescription(selectedCourse.description || "");
      setCategory(selectedCourse.category || "");
      setLevel(selectedCourse.level || "");
      setPrice(selectedCourse.price || "");
      setFrontendImage(selectedCourse.thumbnail || img);
      setIsPublished(selectedCourse?.isPublished || false);
    }
  }, [selectedCourse]);

  useEffect(() => { getCourseById(); }, []);

  const handleThumbnail = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const editCourseHandler = async () => {
    setLoading(true);
    let thumbnailUrl = selectedCourse?.thumbnail;

    try {
      // Step 1: Upload thumbnail image to storage-service via API Gateway if selected
      if (backendImage instanceof File) {
        const imageFormData = new FormData();
        imageFormData.append("file", backendImage);
        imageFormData.append("folder", "thumbnails");

        const uploadRes = await axios.post(`${serverUrl}/api/storage/upload/image`, imageFormData, { withCredentials: true });
        if (uploadRes.data.success) {
          thumbnailUrl = uploadRes.data.url;
        }
      }

      // Step 2: Update course metadata with JSON payload via API Gateway
      const payload = {
        title,
        subTitle,
        description,
        category,
        level,
        price,
        isPublished,
        thumbnail: thumbnailUrl
      };

      const result = await axios.post(`${serverUrl}/api/v1/course/editcourse/${courseId}`, payload, { withCredentials: true });
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
    setLoading(true);
    try {
      await axios.delete(serverUrl + `/api/v1/course/removecourse/${courseId}`, { withCredentials: true });
      toast.success("Course Deleted");
      dispatch(setCourseData(courseData.filter(c => c._id !== courseId)));
      navigate("/courses");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting course");
    } finally {
      setLoading(false);
    }
  };

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
          <button
            className="px-6 py-2.5 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-all cursor-pointer flex items-center gap-2"
            onClick={() => navigate(`/createlecture/${selectedCourse?._id || courseId}`)}
          >
            <FiPlusCircle className="w-4 h-4" /> Add / Manage Lectures
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">

          {/* Curriculum Banner Card */}
          <div className="mb-6 p-5 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-gray-900 text-base">Course Curriculum & Lectures</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {selectedCourse?.lectures?.length || 0} lecture(s) created so far. Add or update videos anytime.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate(`/createlecture/${selectedCourse?._id || courseId}`)}
              className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-semibold hover:bg-black transition-all cursor-pointer shadow-sm shrink-0 flex items-center gap-1.5"
            >
              + Add New Lecture
            </button>
          </div>

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
  );
}

export default AddCourses;
