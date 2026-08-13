import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="bg-black text-gray-400 py-16 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src={logo} alt="Logo" className="h-10 rounded-lg border border-white/10" />
            <h2 className="text-xl font-bold text-white">EduNest LMS</h2>
          </div>
          <p className="text-sm leading-relaxed opacity-70">
            AI-powered learning platform to help you grow smarter. Learn anything, anytime, anywhere.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
          <ul className="space-y-2.5 text-sm">
            {[
              { label: "Home", path: "/" },
              { label: "Courses", path: "/allcourses" },
              { label: "Login", path: "/login" },
              { label: "My Profile", path: "/profile" },
            ].map((link) => (
              <li key={link.path} className="hover:text-white cursor-pointer transition-colors duration-300" onClick={() => navigate(link.path)}>
                {link.label}
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Categories</h3>
          <ul className="space-y-2.5 text-sm">
            {["Web Development", "AI/ML", "Data Science", "UI/UX Design"].map((cat) => (
              <li key={cat} className="hover:text-white cursor-pointer transition-colors duration-300">{cat}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 mt-12 pt-6 text-sm text-center text-gray-600">
        © {new Date().getFullYear()} EduNest LMS. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
