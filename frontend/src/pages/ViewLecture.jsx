import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { FaPlayCircle } from 'react-icons/fa';
import { FaArrowLeftLong } from "react-icons/fa6";
import { MdOutlineSettings, MdCheck } from 'react-icons/md';
import { FiMaximize, FiMinimize } from 'react-icons/fi';
import axios from 'axios';
import { serverUrl } from '../App';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

const QUALITY_OPTIONS = [
  { label: 'Auto', badge: 'HD', width: null, height: null },
  { label: '1080p', badge: 'FHD', width: 1920, height: 1080 },
  { label: '720p', badge: 'HD', width: 1280, height: 720 },
  { label: '480p', badge: 'SD', width: 854, height: 480 },
  { label: '360p', badge: 'SD', width: 640, height: 360 },
  { label: '240p', badge: 'LOW', width: 426, height: 240 },
  { label: '144p', badge: 'DATA SAVER', width: 256, height: 144 },
];

function ViewLecture() {
  const { courseId } = useParams();
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [courseDetails, setCourseDetails] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [selectedLecture, setSelectedLecture] = useState(null);

  const [selectedQuality, setSelectedQuality] = useState('Auto');
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const pendingTimeRef = useRef(null);
  const wasPlayingRef = useRef(false);

  useEffect(() => {
    const fetchLectures = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${serverUrl}/api/v1/course/getcourselecture/${courseId}`, { withCredentials: true });
        setCourseDetails(res.data);
        setLectures(res.data.lectures || []);
        if (res.data.lectures?.length > 0) {
          setSelectedLecture(res.data.lectures[0]);
        }
      } catch (error) {
        console.error("Backend Authorization Error:", error);
        toast.error(error.response?.data?.message || "Access denied. Please enroll to watch paid lectures.");
        navigate(`/viewcourse/${courseId}`);
      } finally {
        setLoading(false);
      }
    };

    fetchLectures();
  }, [courseId, navigate]);

  useEffect(() => {
    setSelectedQuality('Auto');
    pendingTimeRef.current = null;
  }, [selectedLecture?._id]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const getQualityUrl = (originalUrl, qualityLabel) => {
    if (!originalUrl) return '';
    const option = QUALITY_OPTIONS.find(opt => opt.label === qualityLabel);
    if (!option || !option.width || !option.height) return originalUrl;
    if (!originalUrl.includes('/video/upload/')) return originalUrl;

    const transform = `c_fit,h_${option.height},q_auto,w_${option.width}/`;
    return originalUrl.replace('/video/upload/', `/video/upload/${transform}`);
  };

  const handleQualitySelect = (option) => {
    if (videoRef.current) {
      pendingTimeRef.current = videoRef.current.currentTime;
      wasPlayingRef.current = !videoRef.current.paused;
    }
    setSelectedQuality(option.label);
    setShowQualityMenu(false);
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current && pendingTimeRef.current !== null) {
      videoRef.current.currentTime = pendingTimeRef.current;
      if (wasPlayingRef.current) {
        videoRef.current.play().catch(() => {});
      }
      pendingTimeRef.current = null;
    }
  };

  const toggleContainerFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  };

  const activeVideoUrl = getQualityUrl(selectedLecture?.videoUrl, selectedQuality);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-3">
        <ClipLoader size={35} color="black" />
        <p className="text-sm text-gray-500 font-medium">Verifying course enrollment...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6 animate-[fadeIn_0.5s_ease-out]">

        {/* Header */}
        <div className="flex items-center gap-4">
          <button className='w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer shadow-sm' onClick={() => navigate("/")}>
            <FaArrowLeftLong className='w-4 h-4 text-gray-600' />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{courseDetails?.title}</h1>
            <div className="flex gap-3 mt-1 text-xs text-gray-400">
              <span>{courseDetails?.category}</span>
              <span>•</span>
              <span>{courseDetails?.level}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Video Player */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
            
            <h2 className="text-lg font-bold text-gray-900">{selectedLecture?.lectureTitle || "Select a lecture"}</h2>

            {/* Video Container (Includes Video + Quality Overlay inside for Fullscreen Support) */}
            <div ref={containerRef} className="aspect-video bg-black rounded-xl overflow-hidden relative group shadow-inner">
              {selectedLecture?.videoUrl ? (
                <>
                  <video
                    ref={videoRef}
                    src={activeVideoUrl}
                    controls
                    onLoadedMetadata={handleLoadedMetadata}
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />

                  {/* Top Overlay Controls (Quality Settings & Container Fullscreen) */}
                  <div className="absolute top-3 right-3 z-30 flex items-center gap-2 transition-opacity duration-300 opacity-90 hover:opacity-100">
                    
                    {/* Quality Settings Pill & Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setShowQualityMenu(prev => !prev)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-950/85 backdrop-blur-md text-white rounded-xl text-xs font-semibold hover:bg-black transition-all cursor-pointer shadow-xl border border-white/20"
                      >
                        <MdOutlineSettings className="w-4 h-4 text-cyan-400 animate-[spin_8s_linear_infinite]" />
                        <span>{selectedQuality}</span>
                      </button>

                      {/* Dropdown Menu */}
                      {showQualityMenu && (
                        <div className="absolute right-0 mt-2 w-44 bg-gray-950/95 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl z-40 p-2 space-y-1 animate-[fadeIn_0.15s_ease-out]">
                          <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-white/10 flex items-center justify-between">
                            <span>Quality</span>
                            <span className="text-cyan-400 font-mono text-[9px]">1080p - 144p</span>
                          </div>
                          {QUALITY_OPTIONS.map((option) => (
                            <button
                              key={option.label}
                              onClick={() => handleQualitySelect(option)}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                                selectedQuality === option.label
                                  ? 'bg-white/20 text-white font-bold'
                                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                {selectedQuality === option.label && <MdCheck className="w-3.5 h-3.5 text-cyan-400" />}
                                <span>{option.label}</span>
                              </div>
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-gray-300 font-mono">
                                {option.badge}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Container Fullscreen Toggle Button */}
                    <button
                      onClick={toggleContainerFullscreen}
                      className="p-2 bg-gray-950/85 backdrop-blur-md text-white rounded-xl hover:bg-black transition-all cursor-pointer shadow-xl border border-white/20"
                      title={isFullscreen ? "Exit Fullscreen" : "Fullscreen with Quality Controls"}
                    >
                      {isFullscreen ? <FiMinimize className="w-4 h-4 text-white" /> : <FiMaximize className="w-4 h-4 text-white" />}
                    </button>

                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm gap-2">
                  <span>Select a lecture to start watching</span>
                  {!selectedLecture?.videoUrl && selectedLecture && (
                    <span className="text-xs text-red-400">Video playback requires active course enrollment</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Lecture List */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h2 className="text-base font-bold text-gray-900 mb-4">All Lectures</h2>
              <div className="space-y-2">
                {lectures?.length > 0 ? (
                  lectures.map((lecture, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedLecture(lecture)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left text-sm transition-all duration-200 cursor-pointer ${
                        selectedLecture?._id === lecture._id ? 'bg-gray-50 border-gray-200 font-semibold' : 'hover:bg-gray-50 border-gray-100'
                      }`}
                    >
                      <span className="font-medium text-gray-700">{lecture.lectureTitle}</span>
                      <FaPlayCircle className="text-gray-400 w-4 h-4" />
                    </button>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No lectures available.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewLecture;
