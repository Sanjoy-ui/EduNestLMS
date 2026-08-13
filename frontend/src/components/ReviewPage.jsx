import React, { useEffect, useState } from 'react'
import ReviewCard from './ReviewCard'
import { useSelector } from 'react-redux';

function ReviewPage() {
  const [latestReview, setLatestReview] = useState([]);
  const { allReview } = useSelector(state => state.review)

  useEffect(() => {
    setLatestReview(allReview.slice(0, 6));
  }, [allReview])

  return (
    <section className='py-16 px-4 bg-gray-50'>
      <div className='max-w-7xl mx-auto'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900'>Real Reviews from Real Learners</h2>
          <p className='text-gray-500 mt-4 max-w-2xl mx-auto text-sm md:text-base leading-relaxed'>
            Discover how our Virtual Courses is transforming learning experiences through real feedback from students and professionals worldwide.
          </p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {latestReview.map((item, index) => (
            <ReviewCard key={index} rating={item.rating} image={item.user?.photoUrl} text={item.comment} name={item.user?.name} role={item.user?.role} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ReviewPage
