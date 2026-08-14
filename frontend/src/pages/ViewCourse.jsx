import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { serverUrl } from '../App';
import { FaShieldAlt, FaPlayCircle, FaLock, FaExternalLinkAlt } from "react-icons/fa";
import { FaArrowLeftLong, FaCheck, FaStar, FaUserCheck, FaGraduationCap, FaYoutube } from "react-icons/fa6";
import img from "../assets/empty.jpg";
import Card from "../components/Card.jsx";
import { setSelectedCourseData } from '../redux/courseSlice';
import { toast } from 'react-toastify';

function ViewCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { courseData } = useSelector(state => state.course);
  const { userData } = useSelector(state => state.user);
  const dispatch = useDispatch();

  const [creatorData, setCreatorData] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const { selectedCourseData } = useSelector(state => state.course);
  const [selectedCreatorCourse, setSelectedCreatorCourse] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const extractYouTubeId = (url) => {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : "";
  };

  const handleReview = async () => {
    if (rating === 0) {
      return toast.error("Please select a star rating");
    }
    if (!comment.trim()) {
      return toast.error("Please write a review comment");
    }
    try {
      await axios.post(
        `${serverUrl}/api/v1/review/givereview`,
        { rating, comment, courseId },
        { withCredentials: true }
      );
      toast.success("Review submitted successfully");
      setRating(0);
      setComment("");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error submitting review");
    }
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return { avg: "0.0", count: 0 };
    const total = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
    return {
      avg: (total / reviews.length).toFixed(1),
      count: reviews.length
    };
  };

  const { avg: avgRating, count: reviewCount } = calculateAverageRating(selectedCourseData?.reviews);

  const fetchCourseData = () => {
    if (courseData && courseData.length > 0) {
      const found = courseData.find(item => item._id === courseId);
      if (found) {
        dispatch(setSelectedCourseData(found));
      }
    }
  };

  const checkEnrollment = () => {
    if (!userData || !userData.enrolledCourses) return;
    const verify = userData.enrolledCourses.some(c => {
      const enrolledId = typeof c === 'string' ? c : c._id;
      return enrolledId?.toString() === courseId?.toString();
    });
    if (verify) setIsEnrolled(true);
  };

  useEffect(() => {
    fetchCourseData();
    checkEnrollment();
  }, [courseId, courseData, userData]);

  useEffect(() => {
    if (selectedCourseData?.lectures?.length > 0) {
      const firstPreview = selectedCourseData.lectures.find(l => l.isPreviewFree) || selectedCourseData.lectures[0];
      setSelectedLecture(firstPreview);
    }
  }, [selectedCourseData]);

  useEffect(() => {
    const getCreator = async () => {
      if (selectedCourseData?.creator) {
        try {
          const result = await axios.post(
            `${serverUrl}/api/v1/course/getcreator`,
            { userId: selectedCourseData.creator },
            { withCredentials: true }
          );
          setCreatorData(result.data);
        } catch (error) {
          console.error("Error fetching creator:", error);
        }
      }
    };
    getCreator();
  }, [selectedCourseData]);

  useEffect(() => {
    if (creatorData?._id && courseData?.length > 0) {
      const creatorCourses = courseData.filter(
        (course) => course.creator === creatorData._id && course._id !== courseId
      );
      setSelectedCreatorCourse(creatorCourses);
    }
  }, [creatorData, courseData, courseId]);

  const handleEnroll = async (cId, uId) => {
    if (!userData) {
      toast.error("Please log in to enroll in this course");
      return navigate("/login");
    }
    try {
      const orderData = await axios.post(
        `${serverUrl}/api/v1/payment/create-order`,
        { courseId: cId, userId: uId },
        { withCredentials: true }
      );
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.data.amount,
        currency: "INR",
        name: "Virtual Courses",
        description: "Course Enrollment Payment",
        order_id: orderData.data.id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              `${serverUrl}/api/v1/payment/verify-payment`,
              { ...response, courseId: cId, userId: uId },
              { withCredentials: true }
            );
            setIsEnrolled(true);
            toast.success("Payment Successful! You are enrolled.");
            navigate(`/viewlecture/${cId}`);
          } catch (err) {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: userData.name,
          email: userData.email,
        },
        theme: {
          color: "#000000",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error("Error creating payment order");
    }
  };

  const isYtLecture = selectedLecture?.videoType === 'youtube' || selectedLecture?.youtubeVideoId || (selectedLecture?.youtubeUrl && selectedLecture.youtubeUrl.includes('youtu'));
  const currentYtId = selectedLecture?.youtubeVideoId || extractYouTubeId(selectedLecture?.youtubeUrl);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8 animate-[fadeIn_0.5s_ease-out]">

        {/* Back Navigation Button */}
        <button
          className='w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer shadow-sm'
          onClick={() => navigate("/allcourses")}
        >
          <FaArrowLeftLong className='w-4 h-4 text-gray-600' />
        </button>

        {/* Top Hero Showcase Card */}
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Thumbnail Showcase (5 cols) */}
            <div className="lg:col-span-5 relative bg-gray-900 min-h-[260px]">
              <img
                src={selectedCourseData?.thumbnail || img}
                alt={selectedCourseData?.title}
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white font-semibold text-[10px] rounded-full uppercase tracking-wider w-fit mb-2">
                  {selectedCourseData?.category || "Course"}
                </span>
                <span className="text-white text-xs font-semibold">
                  Level: {selectedCourseData?.level || "All Levels"}
                </span>
              </div>
            </div>

            {/* Title & Action Box (7 cols) */}
            <div className="lg:col-span-7 p-6 md:p-8 flex flex-col justify-between space-y-6">
              
              <div className="space-y-3">
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-snug">
                  {selectedCourseData?.title}
                </h1>
                <p className="text-gray-500 text-xs leading-relaxed">
                  {selectedCourseData?.subTitle || selectedCourseData?.description}
                </p>

                {/* Rating & Metrics */}
                <div className="flex flex-wrap items-center gap-4 pt-2 text-xs">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-100 text-amber-800 font-bold">
                    <FaStar className='text-amber-400 w-3.5 h-3.5' />
                    <span>{avgRating}</span>
                    <span className="text-amber-600 font-normal">({reviewCount} reviews)</span>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 text-gray-700 font-medium">
                    <FaGraduationCap className="text-gray-500 w-3.5 h-3.5" />
                    <span>{selectedCourseData?.lectures?.length || 0} Video Lectures</span>
                  </div>
                </div>
              </div>

              {/* Price & Features */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-gray-900">
                    {selectedCourseData?.price ? `₹${selectedCourseData.price}` : 'Free'}
                  </span>
                  <span className="text-xs text-gray-400">One-time payment • Lifetime Access</span>
                </div>

                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <FaCheck className="text-emerald-500 w-3.5 h-3.5" />
                    <span>Full lifetime access to course videos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaShieldAlt className="text-cyan-500 w-3.5 h-3.5" />
                    <span>Secure enrollment with 7-day money back guarantee</span>
                  </div>
                </div>

                {/* CTA Action */}
                <div className='pt-2'>
                  {!isEnrolled ? (
                    <button
                      className="w-full py-3.5 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold text-xs transition-all duration-300 cursor-pointer shadow-md flex items-center justify-center gap-2"
                      onClick={() => handleEnroll(courseId, userData?._id)}
                    >
                      Enroll in Course Now
                    </button>
                  ) : (
                    <button
                      className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs transition-all duration-300 cursor-pointer shadow-md flex items-center justify-center gap-2"
                      onClick={() => navigate(`/viewlecture/${courseId}`)}
                    >
                      <span>Continue Learning</span>
                      <FaPlayCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Curriculum & Interactive Video Player */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Curriculum Lecture List (2 cols) */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Course Curriculum</h2>
              <p className="text-xs text-gray-400">
                {selectedCourseData?.lectures?.length || 0} Lectures available for learning
              </p>
            </div>

            <div className="space-y-2">
              {selectedCourseData?.lectures?.length > 0 ? (
                selectedCourseData.lectures.map((lecture, index) => {
                  const isSelected = selectedLecture?.lectureTitle === lecture.lectureTitle;
                  const isYt = lecture.videoType === 'youtube' || lecture.youtubeVideoId || (lecture.youtubeUrl && lecture.youtubeUrl.includes('youtu'));

                  return (
                    <button
                      key={index}
                      disabled={!lecture.isPreviewFree}
                      onClick={() => lecture.isPreviewFree && setSelectedLecture(lecture)}
                      className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left text-xs transition-all duration-200 ${
                        lecture.isPreviewFree
                          ? "hover:bg-purple-50/50 hover:border-purple-200 cursor-pointer border-gray-100"
                          : "cursor-not-allowed bg-gray-50/50 border-gray-100 opacity-60"
                      } ${isSelected ? "bg-purple-50 border-purple-300 ring-2 ring-purple-500/10" : ""}`}
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <span className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500 shrink-0">
                          {index + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-800 truncate">
                            {lecture.lectureTitle}
                          </p>
                          {isYt && (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-red-500">
                              <FaYoutube className="w-2.5 h-2.5" /> {lecture.youtubeChannelName || "YouTube"}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0">
                        {lecture.isPreviewFree ? (
                          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-lg flex items-center gap-1">
                            <FaPlayCircle className="w-3 h-3 text-emerald-500" /> Free Preview
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-100 text-gray-400 text-[10px] font-medium rounded-lg flex items-center gap-1">
                            <FaLock className="w-2.5 h-2.5" /> Enrolled
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })
              ) : (
                <p className="text-xs text-gray-400 text-center py-6 border border-dashed border-gray-200 rounded-2xl">
                  No lectures published yet.
                </p>
              )}
            </div>
          </div>

          {/* Interactive Video Preview Player (3 cols) */}
          <div className="lg:col-span-3 bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-1">
                {selectedLecture?.lectureTitle || "Free Preview Lecture"}
              </h3>
              <p className="text-xs text-gray-400">
                {selectedLecture?.lectureTitle ? "Playing free lecture preview" : "Click any free preview lecture on the left to watch video"}
              </p>
            </div>

            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-gray-900 border border-gray-800 flex items-center justify-center relative shadow-inner">
              {isYtLecture && currentYtId ? (
                <div className="w-full h-full relative">
                  <iframe
                    src={`https://www.youtube.com/embed/${currentYtId}?autoplay=1&enablejsapi=1&rel=0`}
                    title={selectedLecture?.lectureTitle}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
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
                <video src={selectedLecture.videoUrl} controls autoPlay className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-6 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto text-white">
                    <FaPlayCircle className="w-6 h-6 text-purple-400" />
                  </div>
                  <p className="text-xs text-gray-300 max-w-xs mx-auto">
                    Select a Free Preview lecture from the curriculum to watch video preview.
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Instructor Info */}
        {creatorData && (
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-gray-900">About the Instructor</h2>
            <div className="flex items-center gap-5">
              {creatorData.photoUrl ? (
                <img
                  src={creatorData.photoUrl}
                  alt={creatorData.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-gray-100"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-800 to-black flex items-center justify-center text-white text-2xl font-bold">
                  {creatorData.name?.slice(0, 1).toUpperCase()}
                </div>
              )}

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-gray-900">{creatorData.name}</h3>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-md flex items-center gap-1">
                    <FaUserCheck className="w-3 h-3 text-blue-600" /> Verified
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{creatorData.email}</p>
                {creatorData.description && (
                  <p className="text-xs text-gray-600 mt-2 leading-relaxed max-w-2xl">{creatorData.description}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Course Review & Rating Section */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Student Reviews & Feedback</h2>
              <p className="text-xs text-gray-400">Read verified reviews from enrolled students</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-gray-900">{avgRating}</span>
              <span className="text-xs text-gray-400"> / 5.0 ({reviewCount})</span>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {selectedCourseData?.reviews?.length > 0 ? (
              selectedCourseData.reviews.map((rev, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-gray-800">
                        {rev.user?.name || "Verified Student"}
                      </span>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <FaStar
                            key={s}
                            className={`w-3 h-3 ${
                              s <= rev.rating ? "text-amber-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{rev.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 text-center py-6">No reviews submitted yet.</p>
            )}
          </div>

          {/* Add Review Form */}
          {isEnrolled && (
            <div className="pt-4 border-t border-gray-100 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">Write a Course Review</h3>
              
              {/* Star Picker */}
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className={`w-6 h-6 cursor-pointer transition-colors ${
                      star <= (hoverRating || rating) ? "text-amber-400" : "text-gray-300"
                    }`}
                  />
                ))}
                {rating > 0 && (
                  <span className="text-xs font-bold text-gray-700 ml-2">{rating} Star{rating > 1 ? 's' : ''}</span>
                )}
              </div>

              {/* Comment Text Area */}
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your learning experience with this course..."
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/5 transition-all resize-none min-h-[90px]"
              />

              <button
                onClick={handleReview}
                className="px-6 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                Submit Review
              </button>
            </div>
          )}
        </div>

        {/* More Courses by Same Creator */}
        {selectedCreatorCourse.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">
              More Courses by {creatorData?.name || "this Instructor"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedCreatorCourse.map((course, index) => (
                <Card
                  key={index}
                  thumbnail={course.thumbnail}
                  title={course.title}
                  subTitle={course.subTitle}
                  price={course.price}
                  category={course.category}
                  level={course.level}
                  id={course._id}
                  reviews={course.reviews}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default ViewCourse;
