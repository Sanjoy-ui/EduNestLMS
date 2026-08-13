import React from "react";
import { FaStar } from "react-icons/fa6";
import { FaRegStar } from "react-icons/fa";

const ReviewCard = ({ text, name, image, rating, role }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 max-w-sm w-full">
      {/* Rating Stars */}
      <div className="flex items-center gap-0.5 mb-4">
        {Array(5).fill(0).map((_, i) => (
          <span key={i}>
            {i < rating ? <FaStar className="w-4 h-4 text-yellow-400" /> : <FaRegStar className="w-4 h-4 text-gray-200" />}
          </span>
        ))}
      </div>

      {/* Review Text */}
      <p className="text-gray-600 text-sm leading-relaxed mb-5 line-clamp-3">"{text}"</p>

      {/* Reviewer Info */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
        {image ? (
          <img src={image} alt={name} className="w-10 h-10 rounded-xl object-cover" />
        ) : (
          <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-gray-700 to-black flex items-center justify-center text-white text-sm font-semibold'>
            {name?.slice(0, 1).toUpperCase()}
          </div>
        )}
        <div>
          <h4 className="font-semibold text-gray-800 text-sm">{name}</h4>
          <p className="text-xs text-gray-400 capitalize">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
