import React, { useState } from 'react';
import ai from "../assets/ai.png";
import ai1 from "../assets/SearchAi.png";
import emptyImg from "../assets/empty.jpg";
import { RiMicAiFill } from "react-icons/ri";
import axios from 'axios';
import { serverUrl } from '../App';
import { useNavigate } from 'react-router-dom';
import start from "../assets/start.mp3";
import { FaArrowLeftLong, FaArrowRight } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";

const SUGGESTION_CHIPS = [
  "MERN Fullstack",
  "Web Development",
  "AI / ML",
  "Data Science",
  "Cloud Computing",
  "UI/UX Design"
];

function SearchWithAi() {
  const [input, setInput] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [listening, setListening] = useState(false);
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();
  const startSound = new Audio(start);

  function speak(message) {
    if ('speechSynthesis' in window) {
      let utterance = new SpeechSynthesisUtterance(message);
      window.speechSynthesis.speak(utterance);
    }
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  const handleSearch = async () => {
    if (!recognition) return;
    setListening(true);
    startSound.play().catch(() => {});
    recognition.start();
    recognition.onresult = async (e) => {
      const transcript = e.results[0][0].transcript.trim();
      setInput(transcript);
      await handleRecommendation(transcript);
    };
  };

  const handleRecommendation = async (query) => {
    if (!query || !query.trim()) return;
    setSearching(true);
    try {
      const result = await axios.post(`${serverUrl}/api/v1/ai/search`, { input: query }, { withCredentials: true });
      setRecommendations(result.data || []);
      if (result.data && result.data.length > 0) {
        speak("These are the top courses I found for you");
      } else {
        speak("No courses found");
      }
    } catch (error) {
      console.error("AI Search Error:", error);
    } finally {
      setListening(false);
      setSearching(false);
    }
  };

  const handleChipClick = (chipText) => {
    setInput(chipText);
    handleRecommendation(chipText);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto animate-[fadeIn_0.5s_ease-out] space-y-8">

        {/* Back Button */}
        <button
          className='w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer shadow-sm'
          onClick={() => navigate("/")}
        >
          <FaArrowLeftLong className='w-4 h-4 text-gray-600' />
        </button>

        {/* AI Search Card Header */}
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm text-center space-y-6">
          <div className="flex items-center justify-center gap-3">
            <img src={ai} className='w-9 h-9' alt="AI Logo" />
            <h1 className="text-3xl font-extrabold text-gray-900">
              Search with <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500'>AI</span>
            </h1>
          </div>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Find the perfect courses tailored to your career goals using AI-powered search.
          </p>

          {/* Search Box Input */}
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden px-4 py-1.5 gap-3 max-w-xl mx-auto focus-within:border-gray-900 focus-within:ring-2 focus-within:ring-gray-900/5 transition-all shadow-inner">
            <IoSearch className="text-gray-400 w-5 h-5 shrink-0" />
            <input
              type="text"
              className="flex-grow py-3 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none text-sm font-medium"
              placeholder="What do you want to learn? (e.g. Fullstack, Python, AI...)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && input && handleRecommendation(input)}
            />
            {input && (
              <button
                onClick={() => handleRecommendation(input)}
                className="p-2 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
                title="Execute Search"
              >
                <img src={ai} className='w-5 h-5' alt="Search" />
              </button>
            )}
            {recognition && (
              <button
                className="p-2 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
                onClick={handleSearch}
                title="Voice Search"
              >
                <RiMicAiFill className={`w-5 h-5 ${listening ? 'text-purple-600 animate-pulse' : 'text-gray-400'}`} />
              </button>
            )}
          </div>

          {/* Quick AI Search Prompt Chips */}
          <div className="pt-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Popular AI Prompts</p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {SUGGESTION_CHIPS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleChipClick(chip)}
                  className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-900 hover:text-white text-gray-600 text-xs font-medium rounded-full transition-all cursor-pointer border border-gray-200 hover:border-gray-900"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Searching Loader Indicator */}
        {searching && (
          <div className="text-center py-8">
            <p className="text-sm font-medium text-gray-500">Searching AI course recommendations...</p>
          </div>
        )}

        {/* AI Recommendations Course Grid */}
        {!searching && recommendations.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img src={ai1} className="w-8 h-8 rounded-full border border-purple-200" alt="AI Icon" />
              <h2 className="text-xl font-bold text-gray-900">
                AI Recommended Courses ({recommendations.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((course, index) => (
                <div
                  key={index}
                  onClick={() => navigate(`/viewcourse/${course._id}`)}
                  className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-300 flex flex-col justify-between cursor-pointer group"
                >
                  <div>
                    {/* Course Thumbnail Image Header */}
                    <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
                      <img
                        src={course?.thumbnail || emptyImg}
                        alt={course?.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {course?.level && (
                        <span className="absolute top-3 right-3 px-3 py-1 bg-black/70 backdrop-blur-md text-white text-[11px] font-semibold rounded-full border border-white/20">
                          {course.level}
                        </span>
                      )}
                    </div>

                    {/* Course Details Body */}
                    <div className="p-5 space-y-3">
                      {course?.category && (
                        <span className="inline-block px-3 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-full">
                          {course.category}
                        </span>
                      )}
                      <h3 className="text-base font-bold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                        {course?.title}
                      </h3>
                      {course?.subTitle && (
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                          {course.subTitle}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Course Card Footer */}
                  <div className="p-5 pt-0 flex items-center justify-between border-t border-gray-50 mt-4 pt-3">
                    <span className="text-base font-extrabold text-gray-900">
                      {course?.price ? `₹${course.price}` : 'Free'}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/viewcourse/${course._id}`);
                      }}
                      className="px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-semibold hover:bg-black transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                    >
                      <span>Explore</span>
                      <FaArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!searching && recommendations.length === 0 && (
          <div className="text-center py-12 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <p className="text-gray-400 text-sm font-medium">
              {listening ? 'Listening...' : 'Type a query or click a prompt above to view AI recommendations.'}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

export default SearchWithAi;
