import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { serverUrl } from '../App';
import { FaArrowLeftLong } from "react-icons/fa6";
import img from "../assets/empty.jpg"
import Card from "../components/Card.jsx"
import { setSelectedCourseData } from '../redux/courseSlice';
import { FaLock, FaPlayCircle } from "react-icons/fa";
import { toast } from 'react-toastify';
import { FaStar } from "react-icons/fa6";

function ViewCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate()
  const { courseData } = useSelector(state => state.course)
  const { userData } = useSelector(state => state.user)
  const [creatorData, setCreatorData] = useState(null)
  const dispatch = useDispatch()
  const [selectedLecture, setSelectedLecture] = useState(null);
  const { lectureData } = useSelector(state => state.lecture)
  const { selectedCourseData } = useSelector(state => state.course)
  const [selectedCreatorCourse, setSelectedCreatorCourse] = useState([])
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleReview = async () => {
    try {
      await axios.post(serverUrl + "/api/review/givereview", { rating, comment, courseId }, { withCredentials: true })
      toast.success("Review Added")
      setRating(0)
      setComment("")
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || "Error submitting review")
    }
  }

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const avgRating = calculateAverageRating(selectedCourseData?.reviews);

  const fetchCourseData = async () => {
    courseData.map((item) => {
      if (item._id === courseId) {
        dispatch(setSelectedCourseData(item))
        return null;
      }
    })
  }

  const checkEnrollment = () => {
    const verify = userData?.enrolledCourses?.some(c => {
      const enrolledId = typeof c === 'string' ? c : c._id;
      return enrolledId?.toString() === courseId?.toString();
    });
    if (verify) setIsEnrolled(true);
  };

  useEffect(() => {
    fetchCourseData()
    checkEnrollment()
  }, [courseId, courseData, lectureData])

  useEffect(() => {
    const getCreator = async () => {
      if (selectedCourseData?.creator) {
        try {
          const result = await axios.post(`${serverUrl}/api/course/getcreator`, { userId: selectedCourseData.creator }, { withCredentials: true });
          setCreatorData(result.data);
        } catch (error) {
          console.error("Error fetching creator:", error);
        }
      }
    };
    getCreator();
  }, [selectedCourseData]);

  useEffect(() => {
    if (creatorData?._id && courseData.length > 0) {
      const creatorCourses = courseData.filter(
        (course) => course.creator === creatorData._id && course._id !== courseId
      );
      setSelectedCreatorCourse(creatorCourses);
    }
  }, [creatorData, courseData]);

  const handleEnroll = async (courseId, userId) => {
    try {
      const orderData = await axios.post(serverUrl + "/api/payment/create-order", { courseId, userId }, { withCredentials: true });
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.data.amount,
        currency: "INR",
        name: "Virtual Courses",
        description: "Course Enrollment Payment",
        order_id: orderData.data.id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(serverUrl + "/api/payment/verify-payment", { ...response, courseId, userId }, { withCredentials: true });
            setIsEnrolled(true)
            toast.success(verifyRes.data.message);
          } catch (verifyError) {
            toast.error("Payment verification failed.");
          }
        },
      };
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      toast.error("Something went wrong while enrolling.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8 animate-[fadeIn_0.5s_ease-out]">

        {/* Back */}
        <button className='w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer shadow-sm' onClick={() => navigate("/")}>
          <FaArrowLeftLong className='w-4 h-4 text-gray-600' />
        </button>

        {/* Top Section */}
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2">
              <img src={selectedCourseData?.thumbnail || img} alt="Course Thumbnail" className="w-full h-64 md:h-full object-cover" />
            </div>
            <div className="md:w-1/2 p-8 flex flex-col justify-center">
              <span className='inline-block w-fit px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full mb-3'>{selectedCourseData?.category}</span>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{selectedCourseData?.title}</h1>
              <p className="text-gray-500 mt-2 text-sm">{selectedCourseData?.subTitle}</p>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-1.5">
                  <FaStar className='text-yellow-400 w-4 h-4' />
                  <span className="font-semibold text-gray-800">{avgRating}</span>
                  <span className="text-gray-400 text-sm">({selectedCourseData?.reviews?.length || 0} reviews)</span>
                </div>
              </div>
              <div className='mt-4'>
                <span className="text-3xl font-bold text-gray-900">&#8377;{selectedCourseData?.price}</span>
              </div>
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <p>&#10004; Lifetime access to course materials</p>
                <p>&#10004; Learn {selectedCourseData?.category} from scratch</p>
              </div>
              <div className='mt-6'>
                {!isEnrolled ? (
                  <button className="w-full md:w-auto px-8 py-3 bg-black text-white rounded-xl font-medium text-sm hover:bg-gray-800 transition-all duration-300 cursor-pointer" onClick={() => handleEnroll(courseId, userData?._id)}>Enroll Now</button>
                ) : (
                  <button className="w-full md:w-auto px-8 py-3 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-xl font-medium text-sm hover:bg-emerald-100 transition-all duration-300 cursor-pointer" onClick={() => navigate(`/viewlecture/${courseId}`)}>Watch Now</button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Curriculum + Preview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="md:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Course Curriculum</h2>
            <p className="text-sm text-gray-400 mb-5">{selectedCourseData?.lectures?.length || 0} Lectures</p>
            <div className="space-y-2">
              {selectedCourseData?.lectures?.map((lecture, index) => (
                <button key={index} disabled={!lecture.isPreviewFree} onClick={() => lecture.isPreviewFree && setSelectedLecture(lecture)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left text-sm transition-all duration-200 ${lecture.isPreviewFree ? "hover:bg-gray-50 cursor-pointer border-gray-100" : "cursor-not-allowed opacity-50 border-gray-50"} ${selectedLecture?.lectureTitle === lecture.lectureTitle ? "bg-gray-50 border-gray-200" : ""}`}>
                  <span className="text-gray-500">{lecture.isPreviewFree ? <FaPlayCircle /> : <FaLock className='text-gray-300' />}</span>
                  <span className="font-medium text-gray-700">{lecture.lectureTitle}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="md:col-span-3 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black flex items-center justify-center">
              {selectedLecture?.videoUrl ? (
                <video src={selectedLecture.videoUrl} controls className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-500 text-sm">Select a preview lecture to watch</span>
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mt-4">{selectedLecture?.lectureTitle || "Lecture Preview"}</h3>
            <p className="text-gray-400 text-sm mt-1">{selectedCourseData?.title}</p>
          </div>
        </div>

        {/* Review */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Write a Review</h2>
          <div className="flex gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar key={star} onClick={() => setRating(star)} className={`w-5 h-5 cursor-pointer transition-colors ${star <= rating ? "text-yellow-400" : "text-gray-200"}`} />
            ))}
          </div>
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your experience..." className="w-full border border-gray-200 rounded-xl p-4 text-sm resize-none focus:border-black focus:ring-2 focus:ring-black/5 outline-none transition-all" rows="3" />
          <button className="mt-3 px-6 py-2.5 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-all cursor-pointer" onClick={handleReview}>Submit Review</button>
        </div>

        {/* Instructor */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Instructor</h2>
          <div className="flex items-center gap-4">
            <img src={creatorData?.photoUrl || img} alt="Instructor" className="w-16 h-16 rounded-2xl object-cover" />
            <div>
              <h3 className="font-semibold text-gray-900">{creatorData?.name}</h3>
              <p className="text-sm text-gray-500 mt-0.5">{creatorData?.description}</p>
              <p className="text-xs text-gray-400 mt-0.5">{creatorData?.email}</p>
            </div>
          </div>
        </div>

        {/* Other Courses */}
        {selectedCreatorCourse?.length > 0 && (
          <div>
            <h2 className='text-lg font-bold text-gray-900 mb-5'>More from this Educator</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {selectedCreatorCourse?.map((item, index) => (
                <Card key={index} thumbnail={item.thumbnail} title={item.title} id={item._id} price={item.price} category={item.category} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ViewCourse
