import React from 'react'
import { MdCastForEducation } from "react-icons/md";
import { SiOpenaccess } from "react-icons/si";
import { FaSackDollar } from "react-icons/fa6";
import { BiSupport } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";

function Logos() {
  const items = [
    { icon: <MdCastForEducation className='w-6 h-6' />, text: '20k+ Online Courses' },
    { icon: <SiOpenaccess className='w-5 h-5' />, text: 'Lifetime Access' },
    { icon: <FaSackDollar className='w-5 h-5' />, text: 'Value For Money' },
    { icon: <BiSupport className='w-6 h-6' />, text: 'Lifetime Support' },
    { icon: <FaUsers className='w-6 h-6' />, text: 'Community Support' },
  ]

  return (
    <div className='w-full py-8 flex items-center justify-center flex-wrap gap-3 px-4'>
      {items.map((item, i) => (
        <div key={i} className='flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-gray-50 border border-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-100 hover:border-gray-200 transition-all duration-300 cursor-default'>
          <span className='text-gray-500'>{item.icon}</span>
          <span>{item.text}</span>
        </div>
      ))}
    </div>
  )
}

export default Logos
