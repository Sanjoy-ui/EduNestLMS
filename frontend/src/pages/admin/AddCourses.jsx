import React, { useEffect, useRef, useState } from 'react';
import { FaArrowLeftLong, FaIndianRupeeSign } from "react-icons/fa6";
import { useNavigate, useParams } from 'react-router-dom';
import { serverUrl } from '../../App';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { useDispatch, useSelector } from 'react-redux';
import { setCourseData } from '../../redux/courseSlice';
import img from "../../assets/empty.jpg";
import { FiCamera, FiPlusCircle, FiTrash2 } from "react-icons/fi";
import { FaVideo, FaLayerGroup } from 'react-icons/fa6';
import { MdTitle, MdDescription, MdCategory } from 'react-icons/md';

function AddCourses() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { creatorCourseData, courseData } = useSelector(state => state.course);
  const selectedCourse = creatorCourseData?.find(course => course._id === courseId);
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
  const [deleting, setDeleting] = useState(false);

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

  useEffect(() => {
    if (courseId) {
      getCourseById();
    }
  }, [courseId]);

  const handleThumbnail = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendImage(file);
      setFrontendImage(URL.createObjectURL(file));
    }
  };

  const editCourseHandler = async (e) => {
    if (e) e.preventDefault();
    if (!title.trim()) return toast.error("Course title is required");

    setLoading(true);
    let thumbnailUrl = selectedCourse?.thumbnail || frontendImage;

    try {
      if (backendImage instanceof File) {
        const imageFormData = new FormData();
        imageFormData.append("file", backendImage);
        imageFormData.append("folder", "thumbnails");

        const uploadRes = await axios.post(`${serverUrl}/api/storage/upload/image`, imageFormData, { withCredentials: true });
        if (uploadRes.data.success) {
          thumbnailUrl = uploadRes.data.url;
        }
      }

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

      const currentList = courseData || [];
      if (updatedCourse.isPublished) {
        const updatedCourses = currentList.map(c => c._id === courseId ? updatedCourse : c);
        if (!currentList.some(c => c._id === courseId)) updatedCourses.push(updatedCourse);
        dispatch(setCourseData(updatedCourses));
      } else {
        dispatch(setCourseData(currentList.filter(c => c._id !== courseId)));
      }

      toast.success("Course details saved successfully!");
      navigate("/courses");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error saving course");
    } finally {
      setLoading(false);
    }
  };

  const removeCourse = async () => {
    if (!window.confirm("Are you sure you want to delete this entire course? This operation cannot be undone.")) return;

    setDeleting(true);
    try {
      await axios.delete(`${serverUrl}/api/v1/course/removecourse/${courseId}`, { withCredentials: true });
      toast.success("Course deleted successfully");
      const currentList = courseData || [];
      dispatch(setCourseData(currentList.filter(c => c._id !== courseId)));
      navigate("/courses");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting course");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-6 animate-[fadeIn_0.5s_ease-out]">

        {/* Top Header & Status Banner */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <button
              className='w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer shadow-sm'
              onClick={() => navigate("/courses")}
            >
              <FaArrowLeftLong className='w-4 h-4 text-gray-600' />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Course Details</h1>
              <p className="text-xs text-gray-400">Update course metadata, pricing, and publication status</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
              isPublished
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-amber-50 text-amber-700 border border-amber-200"
            }`}>
              {isPublished ? "Published" : "Draft"}
            </span>

            <button
              type="button"
              onClick={() => setIsPublished(prev => !prev)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                isPublished
                  ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                  : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
              }`}
            >
              {isPublished ? "Unpublish Course" : "Publish Course"}
            </button>

            <button
              type="button"
              disabled={deleting}
              onClick={removeCourse}
              className="p-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 transition-all cursor-pointer"
              title="Delete Course"
            >
              {deleting ? <ClipLoader size={14} color="#dc2626" /> : <FiTrash2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Curriculum Callout Card */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
              <FaVideo className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Course Curriculum & Lectures</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {selectedCourse?.lectures?.length || 0} lecture module(s) created so far. Add YouTube videos or MP4 uploads anytime.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate(`/createlecture/${selectedCourse?._id || courseId}`)}
            className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm shrink-0 flex items-center gap-2"
          >
            <FiPlusCircle className="w-4 h-4 text-cyan-400" />
            <span>Manage Curriculum</span>
          </button>
        </div>

        {/* Main Form Box */}
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-6">

          <form className="space-y-6" onSubmit={editCourseHandler}>
            
            {/* Section 1: Basic Information */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 pb-1 border-b border-gray-100">
                1. Basic Information
              </h3>

              {/* Title */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Course Title *</label>
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-1.5 gap-3 focus-within:border-gray-900 focus-within:ring-2 focus-within:ring-gray-900/5 transition-all">
                  <MdTitle className="w-4 h-4 text-gray-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="e.g. Master Full Stack Web Development with React & Node"
                    className="w-full py-2 bg-transparent text-gray-900 text-xs font-semibold focus:outline-none"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
              </div>

              {/* Subtitle */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Subtitle / Short Summary</label>
                <input
                  type="text"
                  placeholder="e.g. Build 10 real-world projects from scratch"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium focus:border-gray-900 focus:ring-2 focus:ring-gray-900/5 outline-none transition-all"
                  value={subTitle}
                  onChange={(e) => setSubTitle(e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Detailed Description</label>
                <div className="flex items-start bg-gray-50 border border-gray-200 rounded-2xl p-4 gap-3 focus-within:border-gray-900 focus-within:ring-2 focus-within:ring-gray-900/5 transition-all">
                  <MdDescription className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                  <textarea
                    placeholder="Write a comprehensive description of what students will learn..."
                    className="w-full bg-transparent text-gray-900 text-xs font-medium focus:outline-none resize-none min-h-[120px]"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Classification & Pricing */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 pb-1 border-b border-gray-100">
                2. Classification & Pricing
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Category */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Category</label>
                  <select
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-900 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/5 outline-none transition-all cursor-pointer"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Level */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Difficulty Level</label>
                  <select
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-900 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/5 outline-none transition-all cursor-pointer"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                  >
                    <option value="">Select Level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                {/* Price */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Course Price (INR)</label>
                  <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-1.5 gap-2 focus-within:border-gray-900 focus-within:ring-2 focus-within:ring-gray-900/5 transition-all">
                    <span className="text-gray-500 font-bold text-xs">₹</span>
                    <input
                      type="number"
                      placeholder="0 (Free)"
                      className="w-full py-2 bg-transparent text-gray-900 text-xs font-bold focus:outline-none"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Thumbnail Media Poster */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 pb-1 border-b border-gray-100">
                3. Course Thumbnail Media
              </h3>

              <div className="space-y-2">
                <input type="file" ref={thumb} hidden onChange={handleThumbnail} accept='image/*' />
                <div
                  className="relative max-w-sm h-48 rounded-3xl overflow-hidden border border-gray-200 cursor-pointer group shadow-sm bg-gray-900"
                  onClick={() => thumb.current.click()}
                >
                  <img src={frontendImage} alt="Thumbnail Preview" className='w-full h-full object-cover group-hover:opacity-85 transition-opacity' />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 text-white">
                    <FiCamera className="w-6 h-6" />
                    <span className="text-xs font-bold">Click to change thumbnail</span>
                  </div>
                </div>
                <p className="text-[10px] text-gray-400">Recommended resolution: 16:9 ratio (1280 x 720 px)</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex items-center justify-end gap-3 pt-4 border-t border-gray-100'>
              <button
                type="button"
                className='px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition-all cursor-pointer'
                onClick={() => navigate("/courses")}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className='px-8 py-3 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm flex items-center gap-2'
              >
                {loading ? <ClipLoader size={18} color='white' /> : "Save Course Changes"}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}

export default AddCourses;
