import axios from "axios";
import React, { useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { MdTitle, MdCategory } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../../App";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { setCreatorCourseData } from "../../redux/courseSlice";

const CreateCourse = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { creatorCourseData } = useSelector((state) => state.course);

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");

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
    "Software Testing",
    "Others"
  ];

  const createCourseHandler = async (e) => {
    if (e) e.preventDefault();
    if (!title.trim()) return toast.error("Please enter a course title");
    if (!category) return toast.error("Please select a course category");

    setLoading(true);
    try {
      const res = await axios.post(
        `${serverUrl}/api/v1/course/create`,
        { title, category },
        { withCredentials: true }
      );

      if (res.data) {
        toast.success("Course Created Successfully!");
        const currentList = creatorCourseData || [];
        dispatch(setCreatorCourseData([...currentList, res.data]));
        navigate(`/addcourses/${res.data._id}`);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error creating course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-lg animate-[fadeIn_0.5s_ease-out] space-y-6">

        {/* Back Button */}
        <button
          className='w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer shadow-sm'
          onClick={() => navigate("/courses")}
        >
          <FaArrowLeftLong className='w-4 h-4 text-gray-600' />
        </button>

        {/* Form Container */}
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-6">
          <div className="space-y-1 text-center sm:text-left">
            <h1 className="text-2xl font-extrabold text-gray-900">Create New Course</h1>
            <p className="text-xs text-gray-400">Start by entering your course title and primary category</p>
          </div>

          <form className="space-y-5" onSubmit={createCourseHandler}>
            
            {/* Title Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Course Title *</label>
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-1.5 gap-3 focus-within:border-gray-900 focus-within:ring-2 focus-within:ring-gray-900/5 transition-all">
                <MdTitle className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="e.g. Complete AI Engineer Bootcamp 2026"
                  className="w-full py-2.5 bg-transparent text-gray-900 text-xs font-semibold focus:outline-none"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </div>

            {/* Category Dropdown */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Category *</label>
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-1.5 gap-3 focus-within:border-gray-900 focus-within:ring-2 focus-within:ring-gray-900/5 transition-all">
                <MdCategory className="w-4 h-4 text-gray-400 shrink-0" />
                <select
                  className="w-full py-2.5 bg-transparent text-gray-900 text-xs font-semibold focus:outline-none cursor-pointer"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gray-900 hover:bg-black text-white rounded-xl font-bold text-xs transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
              >
                {loading ? <ClipLoader size={18} color='white' /> : "Create Course & Continue"}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};

export default CreateCourse;
