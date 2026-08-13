import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { FaPlayCircle } from 'react-icons/fa';
import { FaArrowLeftLong } from "react-icons/fa6";

function ViewLecture() {
  const { courseId } = useParams();
  const { courseData } = useSelector((state) => state.course);
  const { userData } = useSelector((state) => state.user);
  const selectedCourse = courseData?.find((course) => course._id === courseId);
  const [selectedLecture, setSelectedLecture] = useState(selectedCourse?.lectures?.[0] || null);
  const navigate = useNavigate();
  const courseCreator = userData?._id === selectedCourse?.creator ? userData : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6 animate-[fadeIn_0.5s_ease-out]">

        {/* Header */}
        <div className="flex items-center gap-4">
          <button className='w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer shadow-sm' onClick={() => navigate("/")}>
            <FaArrowLeftLong className='w-4 h-4 text-gray-600' />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{selectedCourse?.title}</h1>
            <div className="flex gap-3 mt-1 text-xs text-gray-400">
              <span>{selectedCourse?.category}</span>
              <span>•</span>
              <span>{selectedCourse?.level}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Video Player */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="aspect-video bg-black rounded-xl overflow-hidden">
              {selectedLecture?.videoUrl ? (
                <video src={selectedLecture.videoUrl} controls className="w-full h-full object-cover" crossOrigin="anonymous" />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 text-sm">Select a lecture to start watching</div>
              )}
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mt-4">{selectedLecture?.lectureTitle}</h2>
          </div>

          {/* Lecture List + Instructor */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h2 className="text-base font-bold text-gray-900 mb-4">All Lectures</h2>
              <div className="space-y-2">
                {selectedCourse?.lectures?.length > 0 ? (
                  selectedCourse.lectures.map((lecture, index) => (
                    <button key={index} onClick={() => setSelectedLecture(lecture)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left text-sm transition-all duration-200 cursor-pointer ${selectedLecture?._id === lecture._id ? 'bg-gray-50 border-gray-200' : 'hover:bg-gray-50 border-gray-100'}`}>
                      <span className="font-medium text-gray-700">{lecture.lectureTitle}</span>
                      <FaPlayCircle className="text-gray-400 w-4 h-4" />
                    </button>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No lectures available.</p>
                )}
              </div>
            </div>

            {courseCreator && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Instructor</h3>
                <div className="flex items-center gap-3">
                  <img src={courseCreator.photoUrl || '/default-avatar.png'} alt="Instructor" className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">{courseCreator.name}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{courseCreator.description || 'No bio available.'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewLecture;
