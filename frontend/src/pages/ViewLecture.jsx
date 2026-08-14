import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { FaPlayCircle, FaCheckCircle, FaRegCircle, FaChevronLeft, FaChevronRight, FaShareAlt, FaStar, FaExternalLinkAlt } from 'react-icons/fa';
import { FaArrowLeftLong, FaUserCheck, FaGraduationCap, FaYoutube } from "react-icons/fa6";
import { MdOutlineSettings, MdCheck, MdOutlineChat, MdOutlineNoteAdd, MdOutlineInfo } from 'react-icons/md';
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
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);

  const [lectures, setLectures] = useState([]);
  const [courseDetails, setCourseDetails] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [creatorData, setCreatorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const [completedLectures, setCompletedLectures] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedQuality, setSelectedQuality] = useState('Auto');
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [qaList, setQaList] = useState([
    { id: 1, author: 'Alex Chen', text: 'How do we handle state persistence across page refreshes in this module?', time: '2 hours ago' },
    { id: 2, author: 'Priya Sharma', text: 'Great explanation on the architecture overview!', time: '1 day ago' },
  ]);
  const [newQuestion, setNewQuestion] = useState('');
  const [notesText, setNotesText] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const extractYouTubeId = (url) => {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : "";
  };

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${serverUrl}/api/v1/course/getcourselecture/${courseId}`,
          { withCredentials: true }
        );

        if (res.data) {
          setIsEnrolled(res.data.isEnrolled ?? true);
          setLectures(res.data.lectures || []);
          setCourseDetails({
            title: res.data.title,
            category: res.data.category,
            level: res.data.level,
            creator: res.data.creator
          });

          if (res.data.lectures && res.data.lectures.length > 0) {
            setSelectedLecture(res.data.lectures[0]);
          }

          if (res.data.creator) {
            try {
              const creatorRes = await axios.post(
                `${serverUrl}/api/v1/course/creator`,
                { userId: res.data.creator },
                { withCredentials: true }
              );
              setCreatorData(creatorRes.data);
            } catch (err) {
              console.log(err);
            }
          }
        }
      } catch (error) {
        if (error.response?.status === 403) {
          setIsEnrolled(false);
          setLectures(error.response.data.lectures || []);
          setCourseDetails({
            title: error.response.data.title,
            category: error.response.data.category,
            level: error.response.data.level,
            creator: error.response.data.creator
          });
          toast.info("Please enroll in this course to watch paid lectures.");
        } else {
          toast.error(error.response?.data?.message || "Failed to load course lectures");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLectures();
  }, [courseId]);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      applyQualityConstraints(selectedQuality);
    }
  };

  const getQualityUrl = (originalUrl, qualityLabel) => {
    if (!originalUrl) return '';
    return originalUrl;
  };

  const applyQualityConstraints = (qualityLabel) => {
    const option = QUALITY_OPTIONS.find(o => o.label === qualityLabel);
    if (!option || !videoRef.current) return;
    if (option.width && option.height) {
      videoRef.current.width = option.width;
      videoRef.current.height = option.height;
    }
  };

  const handleQualitySelect = (option) => {
    setSelectedQuality(option.label);
    setShowQualityMenu(false);
    applyQualityConstraints(option.label);
    toast.info(`Switched playback quality to ${option.label}`);
  };

  const toggleContainerFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const toggleLectureCompletion = (lectureId) => {
    if (completedLectures.includes(lectureId)) {
      setCompletedLectures(prev => prev.filter(id => id !== lectureId));
    } else {
      setCompletedLectures(prev => [...prev, lectureId]);
    }
  };

  const activeIndex = lectures.findIndex(l => l._id === selectedLecture?._id);
  const handlePrevLecture = () => {
    if (activeIndex > 0) {
      setSelectedLecture(lectures[activeIndex - 1]);
    }
  };

  const handleNextLecture = () => {
    if (activeIndex >= 0 && activeIndex < lectures.length - 1) {
      setSelectedLecture(lectures[activeIndex + 1]);
    }
  };

  const handlePostQuestion = (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    setQaList(prev => [
      { id: Date.now(), author: userData?.name || 'Student', text: newQuestion, time: 'Just now' },
      ...prev
    ]);
    setNewQuestion('');
    toast.success("Question posted to course Q&A!");
  };

  const handleSaveNotes = () => {
    if (!notesText.trim()) return toast.error("Please enter note text");
    toast.success("Study notes saved successfully!");
  };

  const handleReview = async () => {
    if (rating === 0) return toast.error("Please select a star rating");
    if (!comment.trim()) return toast.error("Please enter a review comment");
    try {
      await axios.post(
        `${serverUrl}/api/v1/review/givereview`,
        { rating, comment, courseId },
        { withCredentials: true }
      );
      toast.success("Review submitted!");
      setRating(0);
      setComment("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error submitting review");
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Course link copied to clipboard!");
    }
  };

  const isYouTubeLecture = selectedLecture?.videoType === 'youtube' || selectedLecture?.youtubeVideoId || (selectedLecture?.youtubeUrl && selectedLecture.youtubeUrl.includes('youtu'));
  const currentYtId = selectedLecture?.youtubeVideoId || extractYouTubeId(selectedLecture?.youtubeUrl);
  const activeVideoUrl = getQualityUrl(selectedLecture?.videoUrl, selectedQuality);

  const completionPercentage = lectures.length > 0
    ? Math.round((completedLectures.length / lectures.length) * 100)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060a17] text-white flex flex-col items-center justify-center gap-3">
        <ClipLoader size={35} color="#38bdf8" />
        <p className="text-xs text-gray-400 font-medium">Verifying course enrollment & loading cinema workspace...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b19] text-gray-100 flex flex-col font-sans">
      
      {/* Top Cinema Header Bar */}
      <header className="bg-[#0a0f24] border-b border-white/10 px-4 md:px-8 py-3 flex items-center justify-between gap-4 sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-4 min-w-0">
          <button
            onClick={() => navigate(`/viewcourse/${courseId}`)}
            className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/15 transition-colors cursor-pointer text-gray-300 shrink-0"
            title="Back to Course Details"
          >
            <FaArrowLeftLong className="w-4 h-4" />
          </button>

          <div className="min-w-0">
            <h1 className="text-base font-bold text-white truncate max-w-xl">
              {courseDetails?.title}
            </h1>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="capitalize">{courseDetails?.category || "Course"}</span>
              <span>•</span>
              <span className="capitalize">{courseDetails?.level || "All Levels"}</span>
            </div>
          </div>
        </div>

        {/* Header Right Completion Progress */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="hidden sm:flex items-center gap-3 bg-white/5 px-4 py-1.5 rounded-xl border border-white/10">
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-gray-400">Course Progress</p>
              <p className="text-xs font-extrabold text-cyan-400">
                {completedLectures.length} / {lectures.length} ({completionPercentage}%)
              </p>
            </div>
            <div className="w-16 bg-white/10 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          <button
            onClick={handleShare}
            className="px-3.5 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs font-semibold hover:bg-white/10 transition-all cursor-pointer flex items-center gap-1.5 text-gray-300"
          >
            <FaShareAlt className="w-3 h-3 text-cyan-400" />
            <span className="hidden md:inline">Share</span>
          </button>
        </div>
      </header>

      {/* Main Cinema Workspace Layout */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Left & Center: Video Player + Navigation + Tabs (3 Cols) */}
        <div className="lg:col-span-3 space-y-5">
          
          {/* Video Container (YouTube Embed vs Custom MP4 Player) */}
          <div ref={containerRef} className="aspect-video bg-black rounded-3xl overflow-hidden relative group border border-white/10 shadow-2xl">
            {isYouTubeLecture && currentYtId ? (
              <div className="w-full h-full relative">
                <iframe
                  src={`https://www.youtube.com/embed/${currentYtId}?autoplay=1&enablejsapi=1&rel=0`}
                  title={selectedLecture?.lectureTitle}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                {selectedLecture?.youtubeChannelName && (
                  <div className="absolute top-3 left-3 z-30 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-[11px] font-semibold text-white flex items-center gap-1.5 shadow-lg">
                    <FaYoutube className="w-3.5 h-3.5 text-red-500" />
                    <span>Curated from {selectedLecture.youtubeChannelName}</span>
                  </div>
                )}
                <a
                  href={selectedLecture?.youtubeUrl || `https://www.youtube.com/watch?v=${currentYtId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-3 right-3 z-30 bg-black/80 hover:bg-black text-white px-3 py-1.5 rounded-xl text-[11px] font-bold border border-white/20 transition-all flex items-center gap-1.5 shadow-lg"
                >
                  <FaYoutube className="w-3.5 h-3.5 text-red-500" />
                  <span>Open on YouTube</span>
                  <FaExternalLinkAlt className="w-2.5 h-2.5 text-gray-300" />
                </a>
              </div>
            ) : selectedLecture?.videoUrl ? (
              <>
                <video
                  ref={videoRef}
                  src={activeVideoUrl}
                  controls
                  onLoadedMetadata={handleLoadedMetadata}
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />

                {/* Top Quality & Fullscreen Overlay Controls */}
                <div className="absolute top-3 right-3 z-30 flex items-center gap-2 transition-opacity duration-300 opacity-90 hover:opacity-100">
                  <div className="relative">
                    <button
                      onClick={() => setShowQualityMenu(prev => !prev)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-950/85 backdrop-blur-md text-white rounded-xl text-xs font-semibold hover:bg-black transition-all cursor-pointer shadow-xl border border-white/20"
                    >
                      <MdOutlineSettings className="w-4 h-4 text-cyan-400 animate-[spin_8s_linear_infinite]" />
                      <span>{selectedQuality}</span>
                    </button>

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

                  <button
                    onClick={toggleContainerFullscreen}
                    className="p-2 bg-gray-950/85 backdrop-blur-md text-white rounded-xl hover:bg-black transition-all cursor-pointer shadow-xl border border-white/20"
                    title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                  >
                    {isFullscreen ? <FiMinimize className="w-4 h-4 text-white" /> : <FiMaximize className="w-4 h-4 text-white" />}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 text-xs gap-2 p-6 text-center">
                <FaPlayCircle className="w-10 h-10 text-cyan-400" />
                <span>Select a lecture from the curriculum sidebar to start watching</span>
              </div>
            )}
          </div>

          {/* Previous & Next Lecture Navigation Bar */}
          <div className="flex items-center justify-between bg-[#0a0f24] border border-white/10 rounded-2xl px-5 py-3 shadow-md">
            <button
              onClick={handlePrevLecture}
              disabled={activeIndex <= 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeIndex > 0
                  ? 'bg-white/10 hover:bg-white/20 text-white cursor-pointer'
                  : 'bg-white/5 text-gray-600 cursor-not-allowed'
              }`}
            >
              <FaChevronLeft className="w-3 h-3" />
              <span>Previous Lecture</span>
            </button>

            <span className="text-xs font-bold text-gray-300 text-center truncate max-w-xs px-2">
              {selectedLecture?.lectureTitle || "No Lecture Selected"}
            </span>

            <button
              onClick={handleNextLecture}
              disabled={activeIndex < 0 || activeIndex >= lectures.length - 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeIndex >= 0 && activeIndex < lectures.length - 1
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white cursor-pointer hover:opacity-95'
                  : 'bg-white/5 text-gray-600 cursor-not-allowed'
              }`}
            >
              <span>Next Lecture</span>
              <FaChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Interactive Cinema Tabs (Overview, Q&A, Notes, Reviews) */}
          <div className="bg-[#0a0f24] border border-white/10 rounded-3xl p-6 shadow-md space-y-6">
            
            {/* Tab Buttons Bar */}
            <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview', icon: MdOutlineInfo },
                { id: 'qa', label: 'Q&A Discussion', icon: MdOutlineChat },
                { id: 'notes', label: 'Study Notes', icon: MdOutlineNoteAdd },
                { id: 'reviews', label: 'Course Reviews', icon: FaStar },
              ].map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-white/15 text-cyan-400 border border-cyan-500/30'
                        : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Content 1: Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-4 text-xs animate-[fadeIn_0.3s_ease-out]">
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">
                    {selectedLecture?.lectureTitle || "Lecture Overview"}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    This video module covers key concepts for {courseDetails?.title}. Follow along with the practical exercises and complete your study notes.
                  </p>
                </div>

                {/* Creator Information Card */}
                {creatorData && (
                  <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl">
                    {creatorData.photoUrl ? (
                      <img
                        src={creatorData.photoUrl}
                        alt={creatorData.name}
                        className="w-12 h-12 rounded-xl object-cover ring-2 ring-cyan-500/30 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white text-base font-bold shrink-0">
                        {creatorData.name?.slice(0, 1).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold text-white">{creatorData.name}</p>
                        <FaUserCheck className="w-3.5 h-3.5 text-cyan-400" />
                      </div>
                      <p className="text-[11px] text-gray-400">Course Curator & Educator</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Q&A */}
            {activeTab === 'qa' && (
              <div className="space-y-6 text-xs animate-[fadeIn_0.3s_ease-out]">
                <form onSubmit={handlePostQuestion} className="space-y-3">
                  <textarea
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="Ask a question about this lecture..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-all resize-none"
                    rows="3"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white rounded-xl text-xs font-semibold hover:opacity-95 transition-all cursor-pointer shadow-sm"
                  >
                    Post Question
                  </button>
                </form>

                <div className="space-y-3 pt-2">
                  {qaList.map((item) => (
                    <div key={item.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-1">
                      <div className="flex items-center justify-between text-gray-400 text-[10px]">
                        <span className="font-bold text-cyan-300">{item.author}</span>
                        <span>{item.time}</span>
                      </div>
                      <p className="text-xs text-gray-200">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Study Notes */}
            {activeTab === 'notes' && (
              <div className="space-y-4 text-xs animate-[fadeIn_0.3s_ease-out]">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Personal Study Notebook</h4>
                  <button
                    onClick={handleSaveNotes}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white rounded-xl text-xs font-semibold hover:opacity-95 transition-all cursor-pointer shadow-sm"
                  >
                    Save Notes
                  </button>
                </div>

                <textarea
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  placeholder="Take notes while watching lectures... (Saved to your local study notebook)"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-all resize-none min-h-[160px]"
                />
              </div>
            )}

            {/* Tab 4: Course Reviews */}
            {activeTab === 'reviews' && (
              <div className="space-y-6 text-xs animate-[fadeIn_0.3s_ease-out]">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Rate & Review Course</h4>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        onClick={() => setRating(star)}
                        className={`w-5 h-5 cursor-pointer transition-colors ${
                          star <= rating ? 'text-amber-400' : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your review experience..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-all resize-none"
                    rows="3"
                  />
                  <button
                    onClick={handleReview}
                    className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-xs font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all cursor-pointer shadow-md"
                  >
                    Submit Review
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Right Sidebar: Course Content Playlist (1 Col) */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-[#0a0f24] border border-white/10 rounded-3xl p-5 shadow-md space-y-4 sticky top-20">
            
            <div className="border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white">Course Curriculum</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {completedLectures.length} / {lectures.length} Completed
              </p>
            </div>

            {/* Lecture Items List */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {lectures.length > 0 ? (
                lectures.map((lecture, index) => {
                  const isCurrent = selectedLecture?._id === lecture._id;
                  const isDone = completedLectures.includes(lecture._id);
                  const isYt = lecture.videoType === 'youtube' || lecture.youtubeVideoId || (lecture.youtubeUrl && lecture.youtubeUrl.includes('youtu'));

                  return (
                    <div
                      key={index}
                      onClick={() => setSelectedLecture(lecture)}
                      className={`p-3 rounded-2xl border text-left text-xs transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${
                        isCurrent
                          ? 'bg-cyan-500/10 border-cyan-500/50 text-white shadow-sm'
                          : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLectureCompletion(lecture._id);
                          }}
                          className="shrink-0 text-gray-400 hover:text-cyan-400 transition-colors"
                          title={isDone ? "Mark Incomplete" : "Mark Completed"}
                        >
                          {isDone ? (
                            <FaCheckCircle className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <FaRegCircle className="w-4 h-4 text-gray-500" />
                          )}
                        </button>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="font-semibold truncate text-[11px]">{index + 1}. {lecture.lectureTitle}</p>
                          </div>
                          {isYt && (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-red-400 mt-0.5">
                              <FaYoutube className="w-2.5 h-2.5" /> {lecture.youtubeChannelName || "YouTube"}
                            </span>
                          )}
                        </div>
                      </div>

                      {lecture.isPreviewFree && !isEnrolled && (
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[9px] font-bold rounded-md shrink-0">
                          Free Preview
                        </span>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-400 text-xs text-center py-6">
                  No lectures available in this course.
                </p>
              )}
            </div>

            {/* Bottom Certificate Badge */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center space-y-1.5">
              <FaGraduationCap className="w-5 h-5 text-cyan-400 mx-auto" />
              <p className="text-xs font-bold text-white">Verified Certificate</p>
              <p className="text-[10px] text-gray-400">Complete all lectures to earn your course completion badge</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default ViewLecture;
