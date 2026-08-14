import React from 'react';
import { useSelector } from "react-redux";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import img from "../../assets/empty.jpg";
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaVideo } from 'react-icons/fa';
import { FaArrowLeftLong, FaUserCheck, FaGraduationCap, FaPlus } from "react-icons/fa6";
import { MdAttachMoney, MdLibraryBooks, MdVideoLibrary, MdSchool } from "react-icons/md";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border border-gray-700 p-3 rounded-xl shadow-2xl text-xs text-white">
        <p className="font-bold text-gray-300 mb-1">{label}</p>
        <p className="text-cyan-400 font-semibold">
          {payload[0].name}: <span className="text-white font-extrabold">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

function Dashboard() {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const { creatorCourseData } = useSelector((state) => state.course);

  const courseProgressData = creatorCourseData?.map(course => ({
    name: course.title?.length > 14 ? course.title.slice(0, 14) + "..." : course.title,
    fullTitle: course.title,
    Lectures: course.lectures?.length || 0
  })) || [];

  const enrollData = creatorCourseData?.map(course => ({
    name: course.title?.length > 14 ? course.title.slice(0, 14) + "..." : course.title,
    fullTitle: course.title,
    Students: course.enrolledStudents?.length || 0
  })) || [];

  const totalEarnings = creatorCourseData?.reduce((sum, course) => {
    const studentCount = course.enrolledStudents?.length || 0;
    const courseRevenue = course.price ? course.price * studentCount : 0;
    return sum + courseRevenue;
  }, 0) || 0;

  const totalStudents = creatorCourseData?.reduce((sum, course) => {
    return sum + (course.enrolledStudents?.length || 0);
  }, 0) || 0;

  const totalLectures = creatorCourseData?.reduce((sum, course) => {
    return sum + (course.lectures?.length || 0);
  }, 0) || 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8 animate-[fadeIn_0.5s_ease-out]">

        {/* Back Button */}
        <button
          className='w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer shadow-sm'
          onClick={() => navigate("/")}
        >
          <FaArrowLeftLong className='w-4 h-4 text-gray-600' />
        </button>

        {/* Welcome Header Banner */}
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 text-center md:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-5">
              {userData?.photoUrl ? (
                <img
                  src={userData.photoUrl}
                  alt={userData?.name}
                  className="w-20 h-20 rounded-2xl object-cover ring-4 ring-gray-100 shadow-md shrink-0"
                />
              ) : (
                <div className='w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-800 to-black flex items-center justify-center text-white text-3xl font-extrabold ring-4 ring-gray-100 shadow-md shrink-0'>
                  {userData?.name?.slice(0, 1).toUpperCase()}
                </div>
              )}

              <div className="space-y-1">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <h1 className="text-2xl font-extrabold text-gray-900">Welcome, {userData?.name || "Educator"}</h1>
                  <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-md flex items-center gap-1">
                    <FaUserCheck className="w-3 h-3 text-blue-600" /> Educator
                  </span>
                </div>
                <p className="text-xs text-gray-500 max-w-md">
                  {userData?.description || "Curate structured courses, track student analytics, and build your academy."}
                </p>
              </div>
            </div>

            {/* Quick Action Shortcuts */}
            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <button
                onClick={() => navigate("/createcourses")}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <FaPlus className="w-3 h-3" /> Create New Course
              </button>
              <button
                onClick={() => navigate("/courses")}
                className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm"
              >
                Manage My Courses
              </button>
            </div>
          </div>
        </div>

        {/* 4 Metric KPI Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Card 1: Revenue */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <MdAttachMoney className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Total Earnings</p>
              <p className="text-xl font-extrabold text-gray-900">&#8377;{totalEarnings.toLocaleString()}</p>
            </div>
          </div>

          {/* Card 2: Created Courses */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <MdLibraryBooks className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Active Courses</p>
              <p className="text-xl font-extrabold text-gray-900">{creatorCourseData?.length || 0}</p>
            </div>
          </div>

          {/* Card 3: Enrollments */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <MdSchool className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Total Students</p>
              <p className="text-xl font-extrabold text-gray-900">{totalStudents}</p>
            </div>
          </div>

          {/* Card 4: Total Lectures */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
              <MdVideoLibrary className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Curriculum Modules</p>
              <p className="text-xl font-extrabold text-gray-900">{totalLectures}</p>
            </div>
          </div>

        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Chart 1: Lectures per Course */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900">Curriculum Depth</h3>
                <p className="text-xs text-gray-400">Total lectures created per course module</p>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={courseProgressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="barGrad1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="Lectures" fill="url(#barGrad1)" radius={[8, 8, 0, 0]} maxBarSize={45} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Student Enrollment */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900">Student Enrollment</h3>
                <p className="text-xs text-gray-400">Total enrolled students per course</p>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={enrollData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="barGrad2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#0d9488" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="Students" fill="url(#barGrad2)" radius={[8, 8, 0, 0]} maxBarSize={45} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Educator Courses Quick Overview List */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900">Created Courses Overview</h3>
            <button
              onClick={() => navigate("/courses")}
              className="text-xs font-semibold text-purple-600 hover:text-purple-800 transition-colors cursor-pointer"
            >
              View Full Course List
            </button>
          </div>

          <div className="space-y-2">
            {creatorCourseData?.length > 0 ? (
              creatorCourseData.map((course, index) => (
                <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-gray-100/60 transition-all">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={course.thumbnail || img}
                      alt={course.title}
                      className="w-12 h-12 rounded-xl object-cover shrink-0 border border-gray-200"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">{course.title}</p>
                      <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-0.5">
                        <span className="capitalize">{course.category || "General"}</span>
                        <span>•</span>
                        <span>{course.lectures?.length || 0} Lectures</span>
                        <span>•</span>
                        <span>{course.enrolledStudents?.length || 0} Students</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <span className="text-xs font-extrabold text-gray-900">
                      {course.price ? `₹${course.price}` : 'Free'}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/addcourses/${course._id}`)}
                        className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-[11px] font-semibold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <FaEdit className="w-3 h-3" /> Edit Details
                      </button>
                      <button
                        onClick={() => navigate(`/createlecture/${course._id}`)}
                        className="px-3 py-1.5 bg-gray-900 text-white rounded-xl text-[11px] font-semibold hover:bg-black transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <FaVideo className="w-3 h-3 text-cyan-400" /> Lectures
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-xs text-center py-8">
                No courses created yet. Click "Create New Course" above to build your first course!
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
