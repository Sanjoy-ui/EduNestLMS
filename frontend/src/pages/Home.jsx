import React from 'react'
import home from "../assets/bg_hero.jpg"
// import home from "../assets/home1.jpg"
import Nav from '../components/Nav'
import { SiViaplay } from "react-icons/si";
import Logos from '../components/Logos';
import Cardspage from '../components/Cardspage';
import ExploreCourses from '../components/ExploreCourses';
import About from '../components/About';
import ai from '../assets/ai.png'
import ai1 from '../assets/SearchAi.png'
import ReviewPage from '../components/ReviewPage';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate()

  return (
    <div className='w-full overflow-hidden'>
      {/* Hero Section */}
      <div className='w-full lg:h-screen h-[75vh] relative'>
        <Nav />
        <div className='absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70 z-[1]' />
        <img src={home} className='object-cover w-full h-full' alt="" />

        <div className='absolute inset-0 flex flex-col items-center justify-center z-[2] px-4'>
          <h1 className='lg:text-7xl md:text-5xl text-3xl text-white font-bold text-center leading-tight drop-shadow-2xl animate-[fadeIn_0.8s_ease-out]'>
            Grow Your Skills to<br />Advance Your Career
          </h1>
          <p className='text-white/70 text-center max-w-xl mt-4 text-base md:text-lg animate-[fadeIn_1s_ease-out]'>
            Join thousands of learners building real-world skills with expert-led courses
          </p>

          <div className='flex items-center gap-4 mt-8 flex-wrap justify-center animate-[fadeIn_1.2s_ease-out]'>
            <button
              className='group px-7 py-3.5 border-2 border-white/30 text-white rounded-2xl text-base font-semibold flex gap-3 items-center backdrop-blur-sm bg-white/5 hover:bg-white hover:text-black hover:border-white transition-all duration-300 cursor-pointer'
              onClick={() => navigate("/allcourses")}
            >
              View All Courses <SiViaplay className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
            </button>
            <button
              className='group px-7 py-3.5 bg-white text-black rounded-2xl text-base font-semibold flex gap-3 items-center shadow-2xl shadow-white/20 hover:shadow-white/40 hover:scale-[1.02] transition-all duration-300 cursor-pointer'
              onClick={() => navigate("/searchwithai")}
            >
              Search with AI
              <img src={ai} className='w-7 h-7 rounded-full hidden lg:block' alt="" />
              <img src={ai1} className='w-8 h-8 rounded-full lg:hidden' alt="" />
            </button>
          </div>
        </div>
      </div>

      <Logos />
      <ExploreCourses />
      <Cardspage />
      <About />
      <ReviewPage />
      <Footer />
    </div>
  )
}

export default Home
