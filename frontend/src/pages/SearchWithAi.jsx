import React, { useState } from 'react'
import ai from "../assets/ai.png"
import ai1 from "../assets/SearchAi.png"
import { RiMicAiFill } from "react-icons/ri";
import axios from 'axios';
import { serverUrl } from '../App';
import { useNavigate } from 'react-router-dom';
import start from "../assets/start.mp3"
import { FaArrowLeftLong } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";

function SearchWithAi() {
  const [input, setInput] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [listening, setListening] = useState(false)
  const navigate = useNavigate();
  const startSound = new Audio(start)

  function speak(message) {
    let utterance = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(utterance);
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  if (!recognition) {
    console.log("Speech recognition not supported");
  }

  const handleSearch = async () => {
    if (!recognition) return;
    setListening(true)
    startSound.play()
    recognition.start();
    recognition.onresult = async (e) => {
      const transcript = e.results[0][0].transcript.trim();
      setInput(transcript);
      await handleRecommendation(transcript);
    };
  };

  const handleRecommendation = async (query) => {
    try {
      const result = await axios.post(`${serverUrl}/api/ai/search`, { input: query }, { withCredentials: true });
      setRecommendations(result.data);
      if (result.data.length > 0) {
        speak("These are the top courses I found for you")
      } else {
        speak("No courses found")
      }
      setListening(false)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto animate-[fadeIn_0.5s_ease-out]">

        {/* Back */}
        <button className='w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer shadow-sm mb-8' onClick={() => navigate("/")}>
          <FaArrowLeftLong className='w-4 h-4 text-gray-600' />
        </button>

        {/* Search Card */}
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <img src={ai} className='w-8 h-8' alt="AI" />
            <h1 className="text-2xl font-bold text-gray-900">Search with <span className='text-purple-400'>AI</span></h1>
          </div>
          <p className="text-sm text-gray-400 mb-6">Find the perfect course using AI-powered search</p>

          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden px-4 py-1 gap-2 max-w-xl mx-auto focus-within:border-black focus-within:ring-2 focus-within:ring-black/5 transition-all">
            <IoSearch className="text-gray-400 w-5 h-5 shrink-0" />
            <input
              type="text"
              className="flex-grow py-3 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none text-sm"
              placeholder="What do you want to learn? (e.g. AI, MERN, Cloud...)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && input && handleRecommendation(input)}
            />
            {input && (
              <button onClick={() => handleRecommendation(input)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer">
                <img src={ai} className='w-6 h-6' alt="Search" />
              </button>
            )}
            <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer" onClick={handleSearch}>
              <RiMicAiFill className={`w-5 h-5 ${listening ? 'text-purple-500 animate-pulse' : 'text-gray-400'}`} />
            </button>
          </div>
        </div>

        {/* Results */}
        {recommendations.length > 0 ? (
          <div className="mt-10">
            <div className="flex items-center gap-3 mb-6">
              <img src={ai1} className="w-8 h-8 rounded-full" alt="AI Results" />
              <h2 className="text-lg font-bold text-gray-900">AI Recommendations</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.map((course, index) => (
                <button key={index}
                  className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-300 text-left cursor-pointer"
                  onClick={() => navigate(`/viewcourse/${course._id}`)}>
                  <h3 className="text-base font-semibold text-gray-900">{course.title}</h3>
                  <p className="text-xs text-gray-400 mt-1">{course.category}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center mt-16">
            <p className="text-gray-300 text-sm">{listening ? 'Listening...' : 'Search for courses to see results'}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchWithAi;
