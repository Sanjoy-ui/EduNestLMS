import React, { useEffect, useState } from 'react';
import { FaEdit, FaPlus, FaTrash, FaSearch, FaVideo, FaUsers } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";
import { MdFilterList } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';
import { setCreatorCourseData } from '../../redux/courseSlice';
import img1 from "../../assets/empty.jpg";

function Courses() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { creatorCourseData } = useSelector(state => state.course);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // "all" | "published" | "draft"
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const getCreatorData = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/v1/course/getcreatorcourses`, { withCredentials: true });
        dispatch(setCreatorCourseData(result.data));
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Error loading creator courses");
      }
    };
    getCreatorData();
  }, [dispatch]);

  const handleDeleteCourse = async (courseId, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;

    setDeletingId(courseId);
    try {
      await axios.delete(`${serverUrl}/api/v1/course/remove/${courseId}`, { withCredentials: true });
      const updatedCourses = (creatorCourseData || []).filter(c => c._id !== courseId);
      dispatch(setCreatorCourseData(updatedCourses));
      toast.success("Course deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting course");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredCourses = (creatorCourseData || []).filter(course => {
    const matchesSearch = course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.category?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterStatus === "published") return matchesSearch && course.isPublished;
    if (filterStatus === "draft") return matchesSearch && !course.isPublished;
    return matchesSearch;
  });

  const publishedCount = (creatorCourseData || []).filter(c => c.isPublished).length;
  const draftCount = (creatorCourseData || []).filter(c => !c.isPublished).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-6 animate-[fadeIn_0.5s_ease-out]">

        {/* Top Header & Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className='flex items-center gap-4'>
            <button
              className='w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer shadow-sm'
              onClick={() => navigate("/dashboard")}
            >
              <FaArrowLeftLong className='w-4 h-4 text-gray-600' />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manage Your Courses</h1>
              <p className="text-xs text-gray-400">Curate curriculum, set pricing, and manage publications</p>
            </div>
          </div>

          <button
            className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm flex items-center gap-2"
            onClick={() => navigate("/createcourses")}
          >
            <FaPlus className="w-3 h-3" /> Create New Course
          </button>
        </div>

        {/* Search Bar & Filter Chips Bar */}
        <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm space-y-4 md:space-y-0 md:flex md:items-center md:justify-between md:gap-4">
          
          {/* Live Search Input */}
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2 gap-3 flex-1 focus-within:border-gray-900 transition-all">
            <FaSearch className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search courses by title or category..."
              className="w-full bg-transparent text-xs font-semibold text-gray-900 focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Status Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto shrink-0 pt-1 md:pt-0">
            <span className="text-xs text-gray-400 font-semibold flex items-center gap-1 mr-1">
              <MdFilterList className="w-4 h-4" /> Filter:
            </span>

            <button
              onClick={() => setFilterStatus("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterStatus === "all"
                  ? "bg-gray-900 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All ({creatorCourseData?.length || 0})
            </button>

            <button
              onClick={() => setFilterStatus("published")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterStatus === "published"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              }`}
            >
              Published ({publishedCount})
            </button>

            <button
              onClick={() => setFilterStatus("draft")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterStatus === "draft"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "bg-amber-50 text-amber-700 hover:bg-amber-100"
              }`}
            >
              Drafts ({draftCount})
            </button>
          </div>

        </div>

        {/* Desktop Data Table */}
        <div className="hidden md:block bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
          <table className="min-w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="text-left py-4 px-6">Course Information</th>
                <th className="text-left py-4 px-4">Price</th>
                <th className="text-left py-4 px-4">Status</th>
                <th className="text-left py-4 px-4">Students</th>
                <th className="text-left py-4 px-6">Curriculum</th>
                <th className="text-right py-4 px-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course, index) => (
                  <tr key={index} className="hover:bg-gray-50/60 transition-colors">
                    
                    {/* Course Column */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <img
                          src={course?.thumbnail || img1}
                          alt={course?.title}
                          className="w-16 h-10 object-cover rounded-xl shrink-0 border border-gray-200"
                        />
                        <div className="min-w-0 max-w-xs">
                          <p className="font-bold text-gray-900 truncate text-xs">{course?.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-semibold rounded-md capitalize">
                              {course?.category || "General"}
                            </span>
                            {course?.level && (
                              <span className="text-[10px] text-gray-400 capitalize">{course.level}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Price Column */}
                    <td className="py-4 px-4 font-extrabold text-gray-900">
                      {course?.price ? `₹${course.price}` : 'Free'}
                    </td>

                    {/* Status Column */}
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold ${
                        course?.isPublished
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}>
                        {course?.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>

                    {/* Students Column */}
                    <td className="py-4 px-4 text-gray-700">
                      <div className="flex items-center gap-1.5 font-bold text-xs">
                        <FaUsers className="w-3.5 h-3.5 text-blue-500" />
                        <span>{course?.enrolledStudents?.length || 0}</span>
                      </div>
                    </td>

                    {/* Curriculum Column */}
                    <td className="py-4 px-6">
                      <button
                        onClick={() => navigate(`/createlecture/${course?._id}`)}
                        className="px-3 py-1.5 rounded-xl bg-gray-900 hover:bg-black text-white text-[11px] font-semibold transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
                      >
                        <FaVideo className="w-3 h-3 text-cyan-400" />
                        <span>Curriculum ({course?.lectures?.length || 0})</span>
                      </button>
                    </td>

                    {/* Actions Column */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
                          title="Edit Course Details"
                          onClick={() => navigate(`/addcourses/${course?._id}`)}
                        >
                          <FaEdit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          className="w-8 h-8 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
                          title="Delete Course"
                          disabled={deletingId === course?._id}
                          onClick={() => handleDeleteCourse(course?._id, course?.title)}
                        >
                          <FaTrash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    No courses match your query. Click "Create New Course" above to add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Course Cards */}
        <div className="md:hidden space-y-4">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course, index) => (
              <div key={index} className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm space-y-4">
                <div className="flex items-start gap-4">
                  <img
                    src={course?.thumbnail || img1}
                    alt={course?.title}
                    className="w-16 h-12 rounded-xl object-cover shrink-0 border border-gray-200"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-xs text-gray-900 truncate">{course?.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-extrabold text-gray-900">
                        {course?.price ? `₹${course.price}` : 'Free'}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        course?.isPublished ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                      }`}>
                        {course?.isPublished ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-gray-600">
                    <FaUsers className="w-3.5 h-3.5 text-blue-500" />
                    <span>{course?.enrolledStudents?.length || 0} Students</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/createlecture/${course?._id}`)}
                      className="px-3 py-1.5 bg-gray-900 text-white rounded-xl text-xs font-semibold hover:bg-black transition-all cursor-pointer flex items-center gap-1"
                    >
                      <FaVideo className="w-3 h-3 text-cyan-400" /> ({course?.lectures?.length || 0})
                    </button>
                    <button
                      className="p-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
                      onClick={() => navigate(`/addcourses/${course?._id}`)}
                    >
                      <FaEdit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                      onClick={() => handleDeleteCourse(course?._id, course?.title)}
                    >
                      <FaTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-xs text-center py-8 bg-white rounded-3xl border border-gray-100">
              No courses match your query.
            </p>
          )}
        </div>

      </div>
    </div>
  );
}

export default Courses;
