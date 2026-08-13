import React from 'react'
import { SiViaplay } from "react-icons/si";
import { TbDeviceDesktopAnalytics, TbBrandOpenai } from "react-icons/tb";
import { LiaUikit } from "react-icons/lia";
import { MdAppShortcut } from "react-icons/md";
import { FaHackerrank } from "react-icons/fa";
import { SiGoogledataproc, SiOpenaigym } from "react-icons/si";
import { BsClipboardDataFill } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';

function ExploreCourses() {
  const navigate = useNavigate()

  const categories = [
    { icon: <TbDeviceDesktopAnalytics className='w-8 h-8' />, name: 'Web Development', bg: 'bg-purple-50', hover: 'group-hover:text-purple-600' },
    { icon: <LiaUikit className='w-8 h-8' />, name: 'UI UX Designing', bg: 'bg-emerald-50', hover: 'group-hover:text-emerald-600' },
    { icon: <MdAppShortcut className='w-7 h-7' />, name: 'App Development', bg: 'bg-rose-50', hover: 'group-hover:text-rose-600' },
    { icon: <FaHackerrank className='w-7 h-7' />, name: 'Ethical Hacking', bg: 'bg-purple-50', hover: 'group-hover:text-purple-600' },
    { icon: <TbBrandOpenai className='w-7 h-7' />, name: 'AI/ML', bg: 'bg-emerald-50', hover: 'group-hover:text-emerald-600' },
    { icon: <SiGoogledataproc className='w-6 h-6' />, name: 'Data Science', bg: 'bg-rose-50', hover: 'group-hover:text-rose-600' },
    { icon: <BsClipboardDataFill className='w-7 h-7' />, name: 'Data Analytics', bg: 'bg-purple-50', hover: 'group-hover:text-purple-600' },
    { icon: <SiOpenaigym className='w-7 h-7' />, name: 'AI Tools', bg: 'bg-emerald-50', hover: 'group-hover:text-emerald-600' },
  ]

  return (
    <section className='py-16 px-4'>
      <div className='max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12'>
        {/* Text Section */}
        <div className='lg:w-1/3 text-center lg:text-left'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900 leading-tight'>Explore Our Courses</h2>
          <p className='text-gray-500 mt-4 text-sm leading-relaxed'>
            Build real-world skills with courses designed by industry experts. Choose from a wide range of categories.
          </p>
          <button
            className='mt-8 px-6 py-3 bg-black text-white rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-gray-800 transition-all duration-300 cursor-pointer mx-auto lg:mx-0'
            onClick={() => navigate("/allcourses")}
          >
            Explore Courses <SiViaplay className='w-5 h-5' />
          </button>
        </div>

        {/* Category Grid */}
        <div className='lg:w-2/3 grid grid-cols-2 sm:grid-cols-4 gap-4'>
          {categories.map((cat, i) => (
            <div key={i} className='group flex flex-col items-center gap-3 cursor-pointer'>
              <div className={`w-20 h-20 ${cat.bg} rounded-2xl flex items-center justify-center text-gray-500 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg`}>
                {cat.icon}
              </div>
              <span className={`text-xs font-medium text-gray-600 text-center transition-colors duration-300 ${cat.hover}`}>{cat.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ExploreCourses
