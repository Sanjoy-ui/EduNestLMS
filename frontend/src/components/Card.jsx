import React from "react";
import { FaStar } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import emptyImg from "../assets/empty.jpg";

const CourseCard = ({ thumbnail, title, category, price, id, reviews, level, subTitle }) => {
  const navigate = useNavigate();

  const calculateAverageRating = (reviewsList) => {
    if (!reviewsList || reviewsList.length === 0) return { avg: "0.0", count: 0 };
    const total = reviewsList.reduce((sum, review) => sum + (review.rating || 0), 0);
    return {
      avg: (total / reviewsList.length).toFixed(1),
      count: reviewsList.length
    };
  };

  const { avg: avgRating, count: reviewCount } = calculateAverageRating(reviews);

  return (
    <div
      className="group max-w-sm w-full bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
      onClick={() => navigate(`/viewcourse/${id}`)}
    >
      <div>
        {/* Course Thumbnail Image Header */}
        <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
          <img
            src={thumbnail || emptyImg}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          {category && (
            <span className="absolute bottom-3 left-3 px-3 py-1 bg-black/70 backdrop-blur-md text-white text-[11px] font-semibold rounded-full border border-white/20 capitalize">
              {category}
            </span>
          )}
          {level && (
            <span className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-md text-gray-800 text-[11px] font-bold rounded-full border border-gray-200">
              {level}
            </span>
          )}
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-2">
          <h2 className="text-base font-bold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2 leading-snug">
            {title}
          </h2>
          {subTitle && (
            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
              {subTitle}
            </p>
          )}
        </div>
      </div>

      {/* Footer Bar */}
      <div className="p-5 pt-0 space-y-3">
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-xs">
            <FaStar className="text-amber-400 w-3.5 h-3.5" />
            <span className="font-bold text-gray-900">{avgRating}</span>
            <span className="text-gray-400">({reviewCount})</span>
          </div>
          <span className="font-extrabold text-gray-900 text-lg">
            {price ? `₹${price}` : 'Free'}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/viewcourse/${id}`);
          }}
          className="w-full py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
        >
          <span>Explore Course</span>
          <FaArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
