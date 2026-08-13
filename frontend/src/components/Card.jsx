import React from "react";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CourseCard = ({ thumbnail, title, category, price, id, reviews }) => {
  const navigate = useNavigate()

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const avgRating = calculateAverageRating(reviews);

  return (
    <div
      className="group max-w-sm w-full bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-xl transition-all duration-400 cursor-pointer"
      onClick={() => navigate(`/viewcourse/${id}`)}
    >
      {/* Thumbnail */}
      <div className="overflow-hidden relative">
        <img
          src={thumbnail} alt={title}
          className="w-full h-48 object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-medium text-gray-700 capitalize">
          {category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <h2 className="text-base font-semibold text-gray-900 line-clamp-2 mb-3">{title}</h2>

        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <span className="font-bold text-gray-900 text-lg">₹{price}</span>
          <div className="flex items-center gap-1.5 text-sm">
            <FaStar className="text-yellow-400 w-4 h-4" />
            <span className="font-medium text-gray-700">{avgRating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
