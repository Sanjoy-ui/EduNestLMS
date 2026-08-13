import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGithub, FaLinkedin, FaTwitter, FaDiscord, FaYoutube, FaShieldAlt } from "react-icons/fa";
import { MdEmail, MdLock, MdSend } from "react-icons/md";
import { toast } from "react-toastify";

const Footer = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      return toast.error("Please enter a valid email address");
    }
    toast.success("Thank you for subscribing to EduNest LMS newsletter!");
    setEmail("");
  };

  return (
    <footer className="bg-[#050811] text-gray-400 border-t border-white/10 pt-16 pb-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Column (Col Span 2 on large screens) */}
          <div className="lg:col-span-2 space-y-5">
            <div 
              className="inline-flex items-center gap-3 bg-[#0a0f24] border border-white/15 rounded-2xl px-4 py-2.5 cursor-pointer hover:border-cyan-500/40 transition-all duration-300 shadow-md group" 
              onClick={() => navigate("/")}
            >
              <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-cyan-500/20 via-indigo-500/20 to-purple-500/20 border border-cyan-500/30 rounded-xl group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 20V4L14 16V4M14 16L20 4V20" stroke="url(#footNexusGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <defs>
                    <linearGradient id="footNexusGrad" x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#38bdf8" />
                      <stop offset="0.5" stopColor="#818cf8" />
                      <stop offset="1" stopColor="#c084fc" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className='flex flex-col leading-tight justify-center text-left'>
                <span className='text-base font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400'>
                  NEXUS LEARN
                </span>
                <span className='text-[8px] font-bold tracking-widest text-gray-400 uppercase'>
                  Growth Through Intelligent Learning
                </span>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-gray-400 max-w-sm">
              EduNest LMS (Nexus Learn) is an enterprise-grade AI-powered learning management platform empowering global learners and educators through interactive courses, real-time CDN streaming, and intelligent search.
            </p>

            <div className="flex items-center gap-4 text-xs text-gray-400 pt-1">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                <MdLock className="w-3.5 h-3.5 text-emerald-400" /> SSL 256-Bit Encrypted
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                <FaShieldAlt className="w-3.5 h-3.5 text-cyan-400" /> PCI-DSS Compliant
              </span>
            </div>
          </div>

          {/* Column 1: Explore & Platform */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-xs uppercase tracking-wider text-cyan-400">Platform</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "Home", path: "/" },
                { label: "All Courses", path: "/allcourses" },
                { label: "AI Search Assistant", path: "/searchwithai" },
                { label: "Educator Dashboard", path: "/dashboard" },
                { label: "Enrolled Courses", path: "/enrolledcourses" },
                { label: "User Profile", path: "/profile" },
              ].map((link) => (
                <li 
                  key={link.path} 
                  className="hover:text-white hover:translate-x-1 transition-all duration-200 cursor-pointer text-gray-400" 
                  onClick={() => navigate(link.path)}
                >
                  {link.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Popular Categories */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-xs uppercase tracking-wider text-purple-400">Categories</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                "Web Development",
                "AI & Machine Learning",
                "Data Science",
                "Cloud Computing",
                "Cyber Security",
                "UI/UX Design"
              ].map((cat) => (
                <li 
                  key={cat} 
                  className="hover:text-white hover:translate-x-1 transition-all duration-200 cursor-pointer text-gray-400"
                  onClick={() => navigate("/allcourses")}
                >
                  {cat}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Legal & Trust */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-xs uppercase tracking-wider text-indigo-400">Legal & Trust</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "Terms of Service", path: "/terms" },
                { label: "Privacy Policy", path: "/privacy" },
                { label: "Cookie Policy", path: "/privacy" },
                { label: "Refund Policy", path: "/terms" },
                { label: "Security & Ethics", path: "/privacy" },
              ].map((link, idx) => (
                <li 
                  key={idx} 
                  className="hover:text-white hover:translate-x-1 transition-all duration-200 cursor-pointer text-gray-400"
                  onClick={() => navigate(link.path)}
                >
                  {link.label}
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Newsletter & Community Bar */}
        <div className="border-t border-white/10 pt-8 pb-4 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          
          {/* Newsletter Form */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-1">Stay updated with latest tech courses</h4>
            <p className="text-xs text-gray-400 mb-3">Subscribe to receive weekly course releases and tech updates.</p>
            <form onSubmit={handleSubscribe} className="flex max-w-md gap-2">
              <div className="relative flex-1">
                <MdEmail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-all"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-xs font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all cursor-pointer shadow-md shrink-0 flex items-center gap-1.5"
              >
                <span>Subscribe</span>
                <MdSend className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Social Channels */}
          <div className="flex md:justify-end items-center gap-4">
            <span className="text-xs font-medium text-gray-400 mr-2 hidden sm:inline">Connect with us:</span>
            {[
              { icon: FaGithub, href: "https://github.com", label: "GitHub" },
              { icon: FaLinkedin, href: "https://linkedin.com", label: "LinkedIn" },
              { icon: FaTwitter, href: "https://twitter.com", label: "Twitter" },
              { icon: FaDiscord, href: "https://discord.com", label: "Discord" },
              { icon: FaYoutube, href: "https://youtube.com", label: "YouTube" },
            ].map((social, idx) => {
              const Icon = social.icon;
              return (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>

        </div>

        {/* Bottom Copyright & Quick Legal Pill */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4 text-center sm:text-left">
          <p>© {new Date().getFullYear()} EduNest LMS • Nexus Learn Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-gray-300 cursor-pointer transition-colors" onClick={() => navigate("/terms")}>Terms</span>
            <span>•</span>
            <span className="hover:text-gray-300 cursor-pointer transition-colors" onClick={() => navigate("/privacy")}>Privacy</span>
            <span>•</span>
            <span className="hover:text-gray-300 cursor-pointer transition-colors" onClick={() => navigate("/privacy")}>Cookies</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
