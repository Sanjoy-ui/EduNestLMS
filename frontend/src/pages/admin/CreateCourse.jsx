import axios from "axios";
import React, { useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../../App";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

const CreateCourse = () => {
  let navigate = useNavigate()
  let [loading, setLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")

  const CreateCourseHandler = async () => {
    setLoading(true)
    try {
      await axios.post(serverUrl + "/api/course/create", { title, category }, { withCredentials: true })
      toast.success("Course Created")
      navigate("/courses")
      setTitle("")
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating course")
    } finally {
      setLoading(false)
    }
  }

  const categories = ["App Development", "AI/ML", "AI Tools", "Data Science", "Data Analytics", "Ethical Hacking", "UI UX Designing", "Web Development", "Others"];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 px-4">
      <div className="w-full max-w-lg animate-[fadeIn_0.5s_ease-out]">

        <button className='w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer shadow-sm mb-6' onClick={() => navigate("/courses")}>
          <FaArrowLeftLong className='w-4 h-4 text-gray-600' />
        </button>

        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Create Course</h2>
          <p className="text-sm text-gray-400 mb-6">Start by adding a title and category</p>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Course Title</label>
              <input type="text" placeholder="Enter course title" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-black focus:ring-2 focus:ring-black/5 outline-none transition-all" onChange={(e) => setTitle(e.target.value)} value={title} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
              <select className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white focus:border-black focus:ring-2 focus:ring-black/5 outline-none transition-all" onChange={(e) => setCategory(e.target.value)}>
                <option value="">Select category</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <button type="submit" className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-xl font-medium text-sm cursor-pointer transition-all duration-300" disabled={loading} onClick={CreateCourseHandler}>
              {loading ? <ClipLoader size={20} color='white' /> : "Create Course"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;
