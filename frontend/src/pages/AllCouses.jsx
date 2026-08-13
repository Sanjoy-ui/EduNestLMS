import React, { useEffect, useState } from 'react';
import Card from "../components/Card.jsx";
import { FaArrowLeftLong } from "react-icons/fa6";
import { IoFilter } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav';
import ai from '../assets/SearchAi.png'
import { useSelector } from 'react-redux';

function AllCourses() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const navigate = useNavigate()
  const [category, setCategory] = useState([])
  const [filterCourses, setFilterCourses] = useState([])
  const { courseData } = useSelector(state => state.course)

  const categories = ['App Development', 'AI/ML', 'AI Tools', 'Data Science', 'Data Analytics', 'Ethical Hacking', 'UI UX Designing', 'Web Development', 'Others']

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory(prev => prev.filter(item => item !== e.target.value))
    } else {
      setCategory(prev => [...prev, e.target.value])
    }
  }

  const applyFilter = () => {
    let courseCopy = courseData.slice();
    if (category.length > 0) {
      courseCopy = courseCopy.filter(item => category.includes(item.category))
    }
    setFilterCourses(courseCopy)
  }

  useEffect(() => {
    setFilterCourses(courseData)
  }, [courseData])

  useEffect(() => {
    applyFilter()
  }, [category])

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Nav />

      {/* Mobile Filter Toggle */}
      <button
        onClick={() => setIsSidebarVisible(prev => !prev)}
        className="fixed top-20 left-4 z-40 bg-white text-black px-3 py-2 rounded-xl md:hidden border border-gray-200 shadow-sm flex items-center gap-2 text-sm font-medium"
      >
        <IoFilter /> {isSidebarVisible ? 'Hide' : 'Filters'}
      </button>

      {/* Sidebar */}
      <aside className={`w-64 h-screen overflow-y-auto bg-white fixed top-0 left-0 pt-24 px-6 pb-6 border-r border-gray-100 shadow-sm transition-transform duration-300 z-30
        ${isSidebarVisible ? 'translate-x-0' : '-translate-x-full'}
        md:block md:translate-x-0`}>

        <div className='flex items-center gap-3 mb-6'>
          <FaArrowLeftLong className='text-gray-400 cursor-pointer hover:text-black transition-colors w-4 h-4' onClick={() => navigate("/")} />
          <h2 className="text-lg font-bold text-gray-900">Filters</h2>
        </div>

        <button
          className='w-full mb-5 px-4 py-2.5 bg-black text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition-all duration-300 cursor-pointer'
          onClick={() => navigate("/searchwithai")}
        >
          Search with AI <img src={ai} className='w-6 h-6 rounded-full' alt="" />
        </button>

        <div className="space-y-2.5">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-3 cursor-pointer text-sm text-gray-600 hover:text-gray-900 transition-colors py-1">
              <input
                type="checkbox" value={cat} onChange={toggleCategory}
                className="accent-black w-4 h-4 rounded"
                checked={category.includes(cat)}
              />
              {cat}
            </label>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="w-full transition-all duration-300 pt-24 md:pl-64 px-4 md:px-8 pb-12">
        <div className='max-w-6xl mx-auto'>
          <h1 className='text-2xl font-bold text-gray-900 mb-2'>All Courses</h1>
          <p className='text-sm text-gray-500 mb-8'>{filterCourses?.length || 0} courses available</p>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filterCourses?.map((item, index) => (
              <Card key={index} thumbnail={item.thumbnail} title={item.title} price={item.price} category={item.category} id={item._id} reviews={item.reviews} />
            ))}
          </div>

          {filterCourses?.length === 0 && (
            <div className='text-center py-20 text-gray-400'>
              <p className='text-lg'>No courses found</p>
              <p className='text-sm mt-1'>Try adjusting your filters</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AllCourses;
