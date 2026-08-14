import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { serverUrl } from '../App';
import { setUserData } from '../redux/userSlice';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeftLong, FaUser } from "react-icons/fa6";
import { FiCamera } from "react-icons/fi";
import { MdEmail, MdDescription } from "react-icons/md";

function EditProfile() {
  const { userData } = useSelector(state => state.user);
  const [name, setName] = useState(userData?.name || "");
  const [description, setDescription] = useState(userData?.description || "");
  const [photoFile, setPhotoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(userData?.photoUrl || null);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    let uploadedPhotoUrl = userData?.photoUrl;

    try {
      if (photoFile instanceof File) {
        const imageFormData = new FormData();
        imageFormData.append("file", photoFile);
        imageFormData.append("folder", "profiles");

        const uploadRes = await axios.post(`${serverUrl}/api/storage/upload/image`, imageFormData, { withCredentials: true });
        if (uploadRes.data.success) {
          uploadedPhotoUrl = uploadRes.data.url;
        }
      }

      const payload = { name, description, photoUrl: uploadedPhotoUrl };
      const result = await axios.post(`${serverUrl}/api/v1/user/updateprofile`, payload, { withCredentials: true });

      dispatch(setUserData(result.data));
      toast.success("Profile updated successfully!");
      navigate("/profile");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex items-center justify-center">
      <div className="bg-white rounded-3xl border border-gray-100 p-8 md:p-10 max-w-xl w-full relative animate-[fadeIn_0.5s_ease-out] shadow-sm space-y-6">

        {/* Back Button */}
        <button
          className='w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer shadow-sm'
          onClick={() => navigate("/profile")}
        >
          <FaArrowLeftLong className='w-4 h-4 text-gray-600' />
        </button>

        {/* Header Title */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-extrabold text-gray-900">Edit Profile</h1>
          <p className="text-xs text-gray-400">Update your account identity and personal details</p>
        </div>

        <form className="space-y-6" onSubmit={updateProfile}>
          
          {/* Avatar Upload Container */}
          <div className="flex flex-col items-center">
            <label className='relative cursor-pointer group'>
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Avatar Preview"
                  className="w-28 h-28 rounded-3xl object-cover ring-4 ring-gray-100 group-hover:opacity-85 transition-opacity shadow-md"
                />
              ) : (
                <div className='w-28 h-28 rounded-3xl bg-gradient-to-br from-gray-800 to-black flex items-center justify-center text-white text-4xl font-extrabold ring-4 ring-gray-100 group-hover:opacity-85 transition-opacity shadow-md'>
                  {userData?.name?.slice(0, 1).toUpperCase()}
                </div>
              )}

              <div className='absolute bottom-1 right-1 w-8 h-8 rounded-xl bg-gray-900 text-white flex items-center justify-center shadow-lg border border-white group-hover:bg-black transition-colors'>
                <FiCamera className='w-4 h-4' />
              </div>

              <input
                type="file"
                name="photoUrl"
                className="hidden"
                onChange={handleImageChange}
                accept='image/*'
              />
            </label>
            <p className='text-xs text-gray-400 mt-2 font-medium'>Click photo to upload new avatar</p>
          </div>

          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Full Name</label>
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-1.5 gap-3 focus-within:border-gray-900 focus-within:ring-2 focus-within:ring-gray-900/5 transition-all">
              <FaUser className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Enter full name"
                className="w-full py-2.5 bg-transparent text-gray-900 text-xs font-semibold focus:outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          {/* Email Address (Read-only) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Email Address</label>
            <div className="flex items-center bg-gray-100 border border-gray-200 rounded-2xl px-4 py-2.5 gap-3 cursor-not-allowed">
              <MdEmail className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="text-xs font-semibold text-gray-500 truncate">{userData?.email}</span>
            </div>
            <p className="text-[10px] text-gray-400">Email address is associated with your account identity</p>
          </div>

          {/* Bio / Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">About Me / Bio</label>
            <div className="flex items-start bg-gray-50 border border-gray-200 rounded-2xl p-4 gap-3 focus-within:border-gray-900 focus-within:ring-2 focus-within:ring-gray-900/5 transition-all">
              <MdDescription className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
              <textarea
                className="w-full bg-transparent text-gray-900 text-xs font-medium focus:outline-none resize-none"
                rows={3}
                placeholder="Share a brief bio about your learning goals or background..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          {/* Buttons Group */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="w-1/3 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-2/3 py-3 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
            >
              {loading ? <ClipLoader size={18} color='white' /> : "Save Profile Changes"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default EditProfile;
