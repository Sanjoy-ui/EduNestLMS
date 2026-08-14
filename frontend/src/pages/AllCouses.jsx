import React, { useEffect, useState } from 'react';
import Card from "../components/Card.jsx";
import { FaArrowLeftLong, FaXmark } from "react-icons/fa6";
import { IoFilter, IoSearch, IoSwapVertical } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav';
import ai from '../assets/SearchAi.png';
import { useSelector } from 'react-redux';

function AllCourses() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const navigate = useNavigate();
  const [category, setCategory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [filterCourses, setFilterCourses] = useState([]);
  const { courseData } = useSelector(state => state.course);

  const categories = [
    'App Development',
    'AI/ML',
    'AI Tools',
    'Data Science',
    'Data Analytics',
    'Ethical Hacking',
    'UI UX Designing',
    'Web Development',
    'Others'
  ];

  const toggleCategory = (catName) => {
    if (category.includes(catName)) {
      setCategory(prev => prev.filter(item => item !== catName));
    } else {
      setCategory(prev => [...prev, catName]);
    }
  };

  const clearAllFilters = () => {
    setCategory([]);
    setSearchQuery('');
    setSortBy('latest');
  };

  // Helper to compute average rating for sorting
  const getAvgRating = (reviewsList) => {
    if (!reviewsList || reviewsList.length === 0) return 0;
    const total = reviewsList.reduce((sum, r) => sum + (r.rating || 0), 0);
    return total / reviewsList.length;
  };

  const getCategoryCount = (catName) => {
    if (!courseData) return 0;
    return courseData.filter(item => item.category === catName).length;
  };

  useEffect(() => {
    let result = (courseData || []).slice();

    // 1. Filter by category
    if (category.length > 0) {
      result = result.filter(item => category.includes(item.category));
    }

    // 2. Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(item =>
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.subTitle && item.subTitle.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q))
      );
    }

    // 3. Sort courses
    if (sortBy === 'lowToHigh') {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'highToLow') {
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === 'topRated') {
      result.sort((a, b) => getAvgRating(b.reviews) - getAvgRating(a.reviews));
    }

    setFilterCourses(result);
  }, [courseData, category, searchQuery, sortBy]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Nav />

      {/* Mobile Filter Toggle */}
      <button
        onClick={() => setIsSidebarVisible(prev => !prev)}
        className="fixed top-20 left-4 z-40 bg-white text-black px-3.5 py-2 rounded-xl md:hidden border border-gray-200 shadow-md flex items-center gap-2 text-xs font-semibold"
      >
        <IoFilter className="w-4 h-4" /> {isSidebarVisible ? 'Hide Filters' : 'Filter Courses'}
      </button>

      {/* Sidebar Filter Component */}
      <aside className={`w-72 h-screen overflow-y-auto bg-white fixed top-0 left-0 pt-24 px-6 pb-8 border-r border-gray-100 shadow-sm transition-transform duration-300 z-30
        ${isSidebarVisible ? 'translate-x-0' : '-translate-x-full'}
        md:block md:translate-x-0`}>

        <div className='flex items-center justify-between mb-6'>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigate("/")}
              className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <FaArrowLeftLong className='text-gray-600 w-3.5 h-3.5' />
            </button>
            <h2 className="text-lg font-bold text-gray-900">Filters</h2>
          </div>
          {(category.length > 0 || searchQuery || sortBy !== 'latest') && (
            <button
              onClick={clearAllFilters}
              className="text-xs font-semibold text-purple-600 hover:text-purple-800 transition-colors cursor-pointer"
            >
              Clear All
            </button>
          )}
        </div>

        {/* AI Search Launch Banner */}
        <button
          className='w-full mb-6 p-3 bg-gradient-to-r from-gray-900 via-indigo-950 to-purple-950 text-white rounded-2xl text-xs font-bold flex items-center justify-between gap-2 hover:opacity-95 transition-all duration-300 cursor-pointer shadow-md border border-white/10 group'
          onClick={() => navigate("/searchwithai")}
        >
          <div className="flex items-center gap-2">
            <img src={ai} className='w-6 h-6 rounded-full border border-purple-300/40 group-hover:scale-105 transition-transform' alt="AI Icon" />
            <span>Search with AI</span>
          </div>
          <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-md text-[10px] uppercase tracking-wider">Smart</span>
        </button>

        {/* Category Filter Checkboxes */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Course Categories</h3>
          <div className="space-y-1.5">
            {categories.map((cat) => {
              const count = getCategoryCount(cat);
              const isChecked = category.includes(cat);
              return (
                <label
                  key={cat}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer text-xs font-medium transition-all ${
                    isChecked ? 'bg-purple-50 text-purple-700 font-semibold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    toggleCategory(cat);
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      value={cat}
                      readOnly
                      checked={isChecked}
                      className="accent-purple-600 w-4 h-4 rounded cursor-pointer"
                    />
                    <span>{cat}</span>
                  </div>
                  <span className={`text-[11px] px-2 py-0.5 rounded-md ${isChecked ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-400'}`}>
                    {count}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="w-full transition-all duration-300 pt-24 md:pl-72 px-4 md:px-8 pb-16">
        <div className='max-w-6xl mx-auto space-y-6'>

          {/* Header Title & Controls Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200">
            <div>
              <h1 className='text-2xl font-extrabold text-gray-900'>Explore All Courses</h1>
              <p className='text-xs text-gray-500 mt-1'>
                Showing {filterCourses?.length || 0} of {courseData?.length || 0} courses
              </p>
            </div>

            {/* Search & Sort Inputs */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search Bar */}
              <div className="flex items-center bg-white border border-gray-200 rounded-xl px-3 py-2 gap-2 text-xs focus-within:border-gray-900 focus-within:ring-2 focus-within:ring-gray-900/5 transition-all shadow-sm w-full sm:w-64">
                <IoSearch className="text-gray-400 w-4 h-4 shrink-0" />
                <input
                  type="text"
                  placeholder="Search course title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent focus:outline-none text-gray-900 placeholder-gray-400"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600">
                    <FaXmark className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Sort Selector */}
              <div className="flex items-center bg-white border border-gray-200 rounded-xl px-3 py-2 gap-2 text-xs text-gray-700 shadow-sm">
                <IoSwapVertical className="text-gray-400 w-4 h-4 shrink-0" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent focus:outline-none text-xs font-medium cursor-pointer"
                >
                  <option value="latest">Sort: Latest</option>
                  <option value="lowToHigh">Price: Low to High</option>
                  <option value="highToLow">Price: High to Low</option>
                  <option value="topRated">Top Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          {category.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-400 font-medium mr-1">Active Filters:</span>
              {category.map(cat => (
                <span
                  key={cat}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 border border-purple-100 text-purple-700 text-xs font-semibold rounded-full"
                >
                  {cat}
                  <button onClick={() => toggleCategory(cat)} className="hover:text-purple-900 cursor-pointer">
                    <FaXmark className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Course Cards Grid */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2'>
            {filterCourses?.map((item, index) => (
              <Card
                key={index}
                thumbnail={item.thumbnail}
                title={item.title}
                subTitle={item.subTitle}
                price={item.price}
                category={item.category}
                level={item.level}
                id={item._id}
                reviews={item.reviews}
              />
            ))}
          </div>

          {/* Empty Results State */}
          {filterCourses?.length === 0 && (
            <div className='text-center py-20 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-3'>
              <p className='text-base font-bold text-gray-800'>No courses matching your criteria</p>
              <p className='text-xs text-gray-400 max-w-sm mx-auto'>
                Try adjusting your search query, selecting different categories, or resetting active filters.
              </p>
              <button
                onClick={clearAllFilters}
                className="mt-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-semibold hover:bg-black transition-all cursor-pointer shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default AllCourses;
