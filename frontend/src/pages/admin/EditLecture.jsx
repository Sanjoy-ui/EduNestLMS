import axios from 'axios';
import React, { useState } from 'react';
import { FaArrowLeftLong, FaYoutube } from "react-icons/fa6";
import { FaUpload } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { serverUrl } from '../../App';
import { setLectureData } from '../../redux/lectureSlice';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

function EditLecture() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const { courseId, lectureId } = useParams();
  const { lectureData } = useSelector(state => state.lecture);
  const dispatch = useDispatch();
  const selectedLecture = lectureData.find(lecture => lecture._id === lectureId);

  const [videoSource, setVideoSource] = useState(selectedLecture?.videoType || (selectedLecture?.youtubeUrl ? "youtube" : "upload"));
  const [youtubeUrl, setYoutubeUrl] = useState(selectedLecture?.youtubeUrl || "");
  const [youtubeChannelName, setYoutubeChannelName] = useState(selectedLecture?.youtubeChannelName || "");
  const [videoFile, setVideoFile] = useState(null);
  const [lectureTitle, setLectureTitle] = useState(selectedLecture?.lectureTitle || "");
  const [isPreviewFree, setIsPreviewFree] = useState(selectedLecture?.isPreviewFree || false);
  const [fetchingYt, setFetchingYt] = useState(false);

  const extractYouTubeId = (url) => {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : "";
  };

  const handleFetchYoutubeInfo = async (url) => {
    setYoutubeUrl(url);
    const ytId = extractYouTubeId(url);
    if (ytId && (url.includes("youtube.com") || url.includes("youtu.be"))) {
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

  const editLecture = async () => {
    setLoading(true);
    let uploadedVideoUrl = selectedLecture?.videoUrl;

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
        isPreviewFree,
        videoUrl: uploadedVideoUrl,
        youtubeUrl: videoSource === "youtube" ? youtubeUrl : "",
        youtubeChannelName: videoSource === "youtube" ? youtubeChannelName : ""
      };

      const result = await axios.post(`${serverUrl}/api/v1/course/editlecture/${lectureId}`, payload, { withCredentials: true });
      const updatedList = (lectureData || []).map(l => l._id === lectureId ? result.data : l);
      dispatch(setLectureData(updatedList));
      toast.success("Lecture Updated Successfully");
      navigate(`/createlecture/${courseId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating lecture");
    } finally {
      setLoading(false);
    }
  };

  const removeLecture = async () => {
    setLoading1(true);
    try {
      await axios.delete(`${serverUrl}/api/v1/course/removelecture/${lectureId}`, { withCredentials: true });
      const updatedList = (lectureData || []).filter(l => l._id !== lectureId);
      dispatch(setLectureData(updatedList));
      toast.success("Lecture Removed");
      navigate(`/createlecture/${courseId}`);
    } catch (error) {
      toast.error("Error removing lecture");
    } finally {
      setLoading1(false);
    }
  };

  const ytPreviewId = extractYouTubeId(youtubeUrl);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-xl mx-auto animate-[fadeIn_0.5s_ease-out]">

        <button
          className='w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer shadow-sm mb-6'
          onClick={() => navigate(`/createlecture/${courseId}`)}
        >
          <FaArrowLeftLong className='w-4 h-4 text-gray-600' />
        </button>

        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Edit Lecture</h2>
              <p className="text-xs text-gray-400 mt-0.5">Update lecture source, title, and preview options</p>
            </div>
            <button
              className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-semibold hover:bg-red-100 transition-all cursor-pointer"
              disabled={loading1}
              onClick={removeLecture}
            >
              {loading1 ? <ClipLoader size={14} color='#dc2626' /> : "Remove"}
            </button>
          </div>

          <div className="space-y-5">
            {/* Source Toggle */}
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
                <FaYoutube className="w-4 h-4 text-red-500" /> YouTube Link
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

            {/* Lecture Title */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Lecture Title *</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-xs focus:border-black focus:ring-2 focus:ring-black/5 outline-none transition-all"
                placeholder="Lecture Title"
                onChange={(e) => setLectureTitle(e.target.value)}
                value={lectureTitle}
              />
            </div>

            {/* Source Inputs */}
            {videoSource === "youtube" ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    YouTube Video URL * {fetchingYt && <span className="text-xs text-purple-600 font-normal">(Fetching info...)</span>}
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-xs font-mono focus:border-black focus:ring-2 focus:ring-black/5 outline-none transition-all"
                    value={youtubeUrl}
                    onChange={(e) => handleFetchYoutubeInfo(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Creator / Channel Name</label>
                  <input
                    type="text"
                    placeholder="e.g. MIT OpenCourseWare, DeepLearningAI"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-xs focus:border-black focus:ring-2 focus:ring-black/5 outline-none transition-all"
                    value={youtubeChannelName}
                    onChange={(e) => setYoutubeChannelName(e.target.value)}
                  />
                </div>

                {ytPreviewId && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                    <img
                      src={`https://img.youtube.com/vi/${ytPreviewId}/mqdefault.jpg`}
                      alt="YouTube Preview"
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
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Replace MP4 Video File</label>
                <input
                  type="file"
                  accept='video/*'
                  className="w-full border border-gray-200 rounded-xl p-2.5 text-xs file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-black file:text-white hover:file:bg-gray-800 file:cursor-pointer"
                  onChange={(e) => setVideoFile(e.target.files[0])}
                />
              </div>
            )}

            {/* Preview Free Checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="freePreview"
                className="accent-black h-4 w-4 rounded cursor-pointer"
                onChange={(e) => setIsPreviewFree(e.target.checked)}
                checked={isPreviewFree}
              />
              <label htmlFor="freePreview" className="text-xs font-medium text-gray-700 cursor-pointer">
                Make this lecture free to preview for non-enrolled students
              </label>
            </div>
          </div>

          {loading && <p className="text-xs text-gray-400">Updating lecture... Please wait.</p>}

          <button
            className="w-full bg-black text-white py-3 rounded-xl text-xs font-bold hover:bg-gray-800 transition-all cursor-pointer shadow-sm"
            disabled={loading}
            onClick={editLecture}
          >
            {loading ? <ClipLoader size={18} color='white' /> : "Save & Update Lecture"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditLecture;
