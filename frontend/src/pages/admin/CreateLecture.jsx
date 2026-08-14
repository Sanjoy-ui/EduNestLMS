import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaArrowLeftLong, FaYoutube } from "react-icons/fa6";
import { FaEdit, FaVideo, FaPlus, FaUpload } from 'react-icons/fa';
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
  const [videoSource, setVideoSource] = useState("youtube"); // "youtube" | "upload"
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [youtubeChannelName, setYoutubeChannelName] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [isPreviewFree, setIsPreviewFree] = useState(false);
  const [fetchingYt, setFetchingYt] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const { lectureData } = useSelector(state => state.lecture);

  const extractYouTubeId = (url) => {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : "";
  };

  const handleFetchYoutubeInfo = async (url) => {
    setYoutubeUrl(url);
    const ytId = extractYouTubeId(url);
    if (ytId && url.includes("youtube.com") || url.includes("youtu.be")) {
      setFetchingYt(true);
      try {
        const oembedRes = await axios.get(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
        if (oembedRes.data) {
          if (!lectureTitle) setLectureTitle(oembedRes.data.title || "");
          if (oembedRes.data.author_name) setYoutubeChannelName(oembedRes.data.author_name);
        }
      } catch (err) {
        // Fallback silently if oembed fails
      } finally {
        setFetchingYt(false);
      }
    }
  };

  const createLectureHandler = async () => {
    if (!lectureTitle.trim()) {
      return toast.error("Please enter a lecture title");
    }

    setLoading(true);
    let uploadedVideoUrl = "";

    try {
      if (videoSource === "upload" && videoFile instanceof File) {
        const videoFormData = new FormData();
        videoFormData.append("file", videoFile);
        videoFormData.append("folder", "lectures");

        const uploadRes = await axios.post(`${serverUrl}/api/storage/upload/video`, videoFormData, { withCredentials: true });
        if (uploadRes.data.success) {
          uploadedVideoUrl = uploadRes.data.url;
        }
      }

      const payload = {
        lectureTitle,
        videoType: videoSource,
        videoUrl: uploadedVideoUrl,
        youtubeUrl: videoSource === "youtube" ? youtubeUrl : "",
        youtubeChannelName: videoSource === "youtube" ? youtubeChannelName : "",
        isPreviewFree
      };

      const result = await axios.post(`${serverUrl}/api/v1/course/createlecture/${courseId}`, payload, { withCredentials: true });
      dispatch(setLectureData([...(lectureData || []), result.data.lecture]));
      toast.success("Lecture Added Successfully");

      setLectureTitle("");
      setYoutubeUrl("");
      setYoutubeChannelName("");
      setVideoFile(null);
      setIsPreviewFree(false);
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

  const ytPreviewId = extractYouTubeId(youtubeUrl);

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
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Multi-Source Lecture Curator</h1>
            <p className="text-sm text-gray-400">Curate videos from YouTube channels or upload MP4 files.</p>
          </div>

          {/* New Lecture Form Card */}
          <div className="p-5 bg-gray-50 border border-gray-100 rounded-2xl space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Create New Lecture</h3>

            {/* Video Source Selector */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setVideoSource("youtube")}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 border ${
                  videoSource === "youtube"
                    ? "bg-red-50 border-red-200 text-red-600 shadow-sm"
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <FaYoutube className="w-4 h-4 text-red-500" /> YouTube Link (Free)
              </button>

              <button
                type="button"
                onClick={() => setVideoSource("upload")}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 border ${
                  videoSource === "upload"
                    ? "bg-gray-900 border-gray-900 text-white shadow-sm"
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <FaUpload className="w-3.5 h-3.5" /> MP4 File Upload
              </button>
            </div>

            {/* Source Specific Inputs */}
            {videoSource === "youtube" ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    YouTube Video URL * {fetchingYt && <span className="text-xs text-purple-600 font-normal">(Fetching info...)</span>}
                  </label>
                  <input
                    type="url"
                    placeholder="e.g. https://www.youtube.com/watch?v=aircAruvnKk"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs font-mono focus:border-black focus:ring-2 focus:ring-black/5 outline-none transition-all"
                    value={youtubeUrl}
                    onChange={(e) => handleFetchYoutubeInfo(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Creator / Channel Name (Optional Attribution)</label>
                  <input
                    type="text"
                    placeholder="e.g. MIT OpenCourseWare, DeepLearningAI..."
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs focus:border-black focus:ring-2 focus:ring-black/5 outline-none transition-all"
                    value={youtubeChannelName}
                    onChange={(e) => setYoutubeChannelName(e.target.value)}
                  />
                </div>

                {/* YouTube Preview */}
                {ytPreviewId && (
                  <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl">
                    <img
                      src={`https://img.youtube.com/vi/${ytPreviewId}/mqdefault.jpg`}
                      alt="YouTube Thumbnail Preview"
                      className="w-24 h-14 object-cover rounded-lg shrink-0 border border-gray-200"
                    />
                    <div className="min-w-0 text-xs">
                      <p className="font-bold text-gray-800 truncate">YouTube ID: {ytPreviewId}</p>
                      {youtubeChannelName && <p className="text-gray-500">Channel: {youtubeChannelName}</p>}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Select MP4 Video File</label>
                <input
                  type="file"
                  accept="video/*"
                  className="w-full bg-white border border-gray-200 rounded-xl p-2 text-xs file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-black file:text-white hover:file:bg-gray-800 file:cursor-pointer"
                  onChange={(e) => setVideoFile(e.target.files[0])}
                />
              </div>
            )}

            {/* Lecture Title */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Lecture Title *</label>
              <input
                type="text"
                placeholder="e.g. 01. Neural Network Architectures"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs focus:border-black focus:ring-2 focus:ring-black/5 outline-none transition-all"
                onChange={(e) => setLectureTitle(e.target.value)}
                value={lectureTitle}
              />
            </div>

            {/* Free Preview Toggle */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="freePreview"
                className="accent-black h-4 w-4 rounded cursor-pointer"
                checked={isPreviewFree}
                onChange={(e) => setIsPreviewFree(e.target.checked)}
              />
              <label htmlFor="freePreview" className="text-xs font-medium text-gray-700 cursor-pointer">
                Make this lecture free to preview for non-enrolled students
              </label>
            </div>

            {loading && <p className="text-xs text-gray-400">Processing lecture details... Please wait.</p>}

            <button
              className="w-full py-3 bg-black text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
              disabled={loading}
              onClick={createLectureHandler}
            >
              {loading ? <ClipLoader size={18} color='white' /> : <><FaPlus className="w-3.5 h-3.5" /> Add Lecture to Course</>}
            </button>
          </div>

          {/* Existing Lectures List */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-gray-900">
              Curated Course Curriculum ({lectureData?.length || 0})
            </h3>

            <div className="space-y-2">
              {lectureData?.length > 0 ? (
                lectureData.map((lecture, index) => (
                  <div key={index} className="flex justify-between items-center px-4 py-3.5 bg-gray-50/70 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all">
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <span className="text-xs font-semibold text-gray-400 shrink-0">{index + 1}.</span>
                      <span className="text-xs font-semibold text-gray-800 truncate">{lecture.lectureTitle}</span>
                      
                      {lecture.videoType === 'youtube' || lecture.youtubeVideoId ? (
                        <span className="shrink-0 px-2.5 py-0.5 rounded-md bg-red-50 text-red-600 text-[10px] font-bold flex items-center gap-1">
                          <FaYoutube className="w-3 h-3 text-red-500" /> YouTube
                        </span>
                      ) : lecture.videoUrl ? (
                        <span className="shrink-0 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 text-[10px] font-bold flex items-center gap-1">
                          <FaVideo className="w-2.5 h-2.5" /> MP4 Video
                        </span>
                      ) : (
                        <span className="shrink-0 px-2 py-0.5 rounded-md bg-amber-50 text-amber-600 text-[10px] font-semibold">
                          Draft
                        </span>
                      )}
                    </div>

                    <button
                      className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
                      title="Edit Lecture"
                      onClick={() => navigate(`/editlecture/${courseId}/${lecture._id}`)}
                    >
                      <FaEdit className="text-gray-600 w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-xs text-center py-6 border border-dashed border-gray-200 rounded-2xl">
                  No lectures added yet. Add YouTube links or MP4 videos above.
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
