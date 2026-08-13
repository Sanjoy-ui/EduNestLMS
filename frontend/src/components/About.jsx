import React from 'react'
import about from "../assets/about.jpg"
import VideoPlayer from './VideoPlayer'
import { BiSolidBadgeCheck } from "react-icons/bi";

function About() {
  return (
    <section className='py-16 px-4'>
      <div className='max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12'>
        {/* Image Side */}
        <div className='lg:w-1/2 relative'>
          <img src={about} className='w-full max-w-md mx-auto rounded-3xl shadow-xl' alt="About" />
          <VideoPlayer />
        </div>

        {/* Text Side */}
        <div className='lg:w-1/2'>
          <span className='text-sm font-medium text-gray-400 uppercase tracking-wider'>About Us</span>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mt-3 leading-tight'>Maximize Your Learning Growth</h2>
          <p className='text-gray-500 mt-4 text-sm leading-relaxed'>
            We provide a modern Learning Management System to simplify online education, track progress, and enhance student-instructor collaboration efficiently.
          </p>

          <div className='grid grid-cols-2 gap-4 mt-8'>
            {['Simplified Learning', 'Expert Trainers', 'Big Experience', 'Lifetime Access'].map((item) => (
              <div key={item} className='flex items-center gap-2.5'>
                <BiSolidBadgeCheck className='w-5 h-5 text-emerald-500 flex-shrink-0' />
                <span className='text-sm text-gray-700 font-medium'>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
