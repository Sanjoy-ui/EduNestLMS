import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaEdit, FaVideo, FaPlus } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { serverUrl } from '../../App';
import { ClipLoader } from 'react-spinners';
import { useDispatch, useSelector } from 'react-redux';
import { setLectureData } from '../../redux/lectureSlice';

function CreateLecture() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [lectureTitle, setLectureTitle] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { lectureData } = useSelector(state => state.lecture);

  const createLectureHandler = async () => {
    if (!lectureTitle.trim()) {
      return toast.error("Please enter a lecture title");
    }

    setLoading(true);
    let uploadedVideoUrl = "";

    try {
      // Step 1: Upload video file if provided during creation
      if (videoFile instanceof File) {
        const videoFormData = new FormData();
        videoFormData.append("file", videoFile);
        videoFormData.append("folder", "lectures");

        const uploadRes = await axios.post(`${serverUrl}/api/storage/upload/video`, videoFormData, { withCredentials: true });
        if (uploadRes.data.success) {
          uploadedVideoUrl = uploadRes.data.url;
        }
      }

      // Step 2: Create lecture document
      const payload = {
        lectureTitle,
        videoUrl: uploadedVideoUrl
      };

      const result = await axios.post(`${serverUrl}/api/v1/course/createlecture/${courseId}`, payload, { withCredentials: true });
      dispatch(setLectureData([...lectureData, result.data.lecture]));
      toast.success("Lecture Added Successfully");
      setLectureTitle("");
      setVideoFile(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating lecture");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getLecture = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/v1/course/getcourselecture/${courseId}`, { withCredentials: true });
        dispatch(setLectureData(result.data.lectures || []));
      } catch (error) {
        console.log(error);
      }
    };
    getLecture();
  }, [courseId, dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto animate-[fadeIn_0.5s_ease-out]">

        {/* Back Button */}
        <button
          className='w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer shadow-sm mb-6'
          onClick={() => navigate(`/addcourses/${courseId}`)}
        >
          <FaArrowLeftLong className='w-4 h-4 text-gray-600' />
        </button>

        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Manage & Add Lectures</h1>
            <p className="text-sm text-gray-400">Add new video lectures to this course anytime.</p>
          </div>

          {/* New Lecture Form Card */}
          <div className="p-5 bg-gray-50 border border-gray-100 rounded-2xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Create New Lecture</h3>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Lecture Title *</label>
              <input
                type="text"
                placeholder="e.g. 01. Introduction & Environment Setup"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:border-black focus:ring-2 focus:ring-black/5 outline-none transition-all"
                onChange={(e) => setLectureTitle(e.target.value)}
                value={lectureTitle}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Lecture Video (Optional during draft)</label>
              <input
                type="file"
                accept="video/*"
                className="w-full bg-white border border-gray-200 rounded-xl p-2 text-xs file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-black file:text-white hover:file:bg-gray-800 file:cursor-pointer"
                onChange={(e) => setVideoFile(e.target.files[0])}
              />
            </div>

            {loading && <p className="text-xs text-gray-400">Uploading lecture video... Please wait.</p>}

            <button
              className="w-full py-3 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-all cursor-pointer flex items-center justify-center gap-2"
              disabled={loading}
              onClick={createLectureHandler}
            >
              {loading ? <ClipLoader size={18} color='white' /> : <><FaPlus className="w-3.5 h-3.5" /> Save & Add New Lecture</>}
            </button>
          </div>

          {/* Existing Lectures List */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900">
                Course Lectures ({lectureData?.length || 0})
              </h3>
            </div>

            <div className="space-y-2">
              {lectureData?.length > 0 ? (
                lectureData.map((lecture, index) => (
                  <div key={index} className="flex justify-between items-center px-4 py-3.5 bg-gray-50/70 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all">
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <span className="text-xs font-semibold text-gray-400 shrink-0">{index + 1}.</span>
                      <span className="text-sm font-medium text-gray-800 truncate">{lecture.lectureTitle}</span>
                      {lecture.videoUrl ? (
                        <span className="shrink-0 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 text-[10px] font-semibold flex items-center gap-1">
                          <FaVideo className="w-2.5 h-2.5" /> Video Ready
                        </span>
                      ) : (
                        <span className="shrink-0 px-2 py-0.5 rounded-md bg-amber-50 text-amber-600 text-[10px] font-semibold">
                          Needs Video
                        </span>
                      )}
                    </div>

                    <button
                      className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
                      title="Edit Lecture & Video"
                      onClick={() => navigate(`/editlecture/${courseId}/${lecture._id}`)}
                    >
                      <FaEdit className="text-gray-600 w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm text-center py-6 border border-dashed border-gray-200 rounded-2xl">
                  No lectures created yet. Add your first lecture above!
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default CreateLecture;
