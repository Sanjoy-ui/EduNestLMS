import axios from 'axios'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { serverUrl } from '../App'
import { setUserData } from '../redux/userSlice'
import { toast } from 'react-toastify'
import { ClipLoader } from 'react-spinners'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeftLong } from "react-icons/fa6";
import { FiCamera } from "react-icons/fi";

function EditProfile() {
  const { userData } = useSelector(state => state.user)
  const [name, setName] = useState(userData?.name || "")
  const [description, setDescription] = useState(userData?.description || "")
  const [photoUrl, setPhotoUrl] = useState(null)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const updateProfile = async () => {
    setLoading(true)
    const formData = new FormData()
    formData.append("name", name)
    formData.append("description", description)
    formData.append("photoUrl", photoUrl)

    try {
      const result = await axios.post(serverUrl + "/api/user/updateprofile", formData, { withCredentials: true })
      dispatch(setUserData(result.data))
      navigate("/")
      setLoading(false)
      toast.success("Profile Updated Successfully")
    } catch (error) {
      console.log(error)
      toast.error("Profile Update Error")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 px-4 py-12">
      <div className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-8 md:p-10 max-w-lg w-full relative animate-[fadeIn_0.5s_ease-out]">

        {/* Back Button */}
        <button className='absolute top-6 left-6 w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer' onClick={() => navigate("/profile")}>
          <FaArrowLeftLong className='w-4 h-4 text-gray-600' />
        </button>

        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8 mt-2">Edit Profile</h2>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          {/* Avatar with Camera Icon */}
          <div className="flex flex-col items-center">
            <label className='relative cursor-pointer group'>
              {userData?.photoUrl ? (
                <img src={userData.photoUrl} alt="" className="w-24 h-24 rounded-2xl object-cover ring-4 ring-gray-100 group-hover:opacity-80 transition-opacity" />
              ) : (
                <div className='w-24 h-24 rounded-2xl bg-gradient-to-br from-gray-800 to-black flex items-center justify-center text-white text-3xl font-bold ring-4 ring-gray-100 group-hover:opacity-80 transition-opacity'>
                  {userData?.name?.slice(0, 1).toUpperCase()}
                </div>
              )}
              <div className='absolute inset-0 rounded-2xl flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity'>
                <FiCamera className='w-6 h-6 text-white' />
              </div>
              <input type="file" name="photoUrl" className="hidden" onChange={(e) => setPhotoUrl(e.target.files[0])} accept='image/*' />
            </label>
            <p className='text-xs text-gray-400 mt-2'>Click to change photo</p>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
            <input
              type="text" placeholder={userData?.name}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-black focus:ring-2 focus:ring-black/5 outline-none transition-all duration-300"
              onChange={(e) => setName(e.target.value)} value={name}
            />
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input
              type="email" readOnly
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-500 cursor-not-allowed"
              placeholder={userData?.email}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
            <textarea
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm resize-none focus:border-black focus:ring-2 focus:ring-black/5 outline-none transition-all duration-300"
              rows={3} placeholder="Tell us about yourself"
              onChange={(e) => setDescription(e.target.value)} value={description}
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full py-3 bg-black text-white rounded-xl font-medium text-sm hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer"
            disabled={loading} onClick={updateProfile}
          >
            {loading ? <ClipLoader size={20} color='white' /> : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditProfile
