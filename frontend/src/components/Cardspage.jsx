import React, { useEffect, useState } from 'react'
import Card from "./Card.jsx"
import { useSelector } from 'react-redux';
import { SiViaplay } from "react-icons/si";
import { useNavigate } from 'react-router-dom';

function Cardspage() {
  const [popularCourses, setPopularCourses] = useState([]);
  const { courseData } = useSelector(state => state.course)
  const navigate = useNavigate()

  useEffect(() => {
    setPopularCourses(courseData.slice(0, 6));
  }, [courseData])

  return (
    <section className='py-16 px-4'>
      <div className='max-w-7xl mx-auto'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900'>Our Popular Courses</h2>
          <p className='text-gray-500 mt-4 max-w-2xl mx-auto text-sm md:text-base leading-relaxed'>
            Explore top-rated courses designed to boost your skills, enhance careers, and unlock opportunities in tech, AI, business, and beyond.
          </p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10'>
          {popularCourses.map((item, index) => (
            <Card key={index} id={item._id} thumbnail={item.thumbnail} title={item.title} price={item.price} category={item.category} reviews={item.reviews} />
          ))}
        </div>

        <div className='flex justify-center'>
          <button
            className='group px-6 py-3 bg-black text-white rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-gray-800 transition-all duration-300 cursor-pointer'
            onClick={() => navigate("/allcourses")}
          >
            View All Courses <SiViaplay className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
          </button>
        </div>
      </div>
    </section>
  )
}

export default Cardspage
