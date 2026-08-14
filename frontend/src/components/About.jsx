import React from 'react';
import { FaYoutube, FaGraduationCap, FaUserCheck } from 'react-icons/fa6';
import { FaPlayCircle, FaCheckCircle } from 'react-icons/fa';
import { MdVideoLibrary, MdAnalytics, MdPsychology } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

function About() {
  const navigate = useNavigate();

  const workflowSteps = [
    {
      step: "01",
      title: "Orchestrate & Curate",
      desc: "Educators build structured courses in minutes by linking high-quality video modules from top YouTube channels (MIT, Stanford, DeepLearningAI) or uploading custom MP4 files.",
      icon: FaYoutube,
      color: "text-red-500 bg-red-50"
    },
    {
      step: "02",
      title: "Personalized AI Matching",
      desc: "Learners discover tailored course roadmaps using AI prompt search to match their specific career goals and skill level.",
      icon: MdPsychology,
      color: "text-indigo-500 bg-indigo-50"
    },
    {
      step: "03",
      title: "Cinema Learning & Mastery",
      desc: "Students learn inside a dark cinema workspace with embedded HD playback, interactive Q&A discussion, personal study notes, and completion badges.",
      icon: FaGraduationCap,
      color: "text-cyan-500 bg-cyan-50"
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white via-gray-50/50 to-white">
      <div className="max-w-6xl mx-auto space-y-16">

        {/* Header & Platform Core Mission */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-4 py-1.5 bg-gray-900 text-cyan-400 text-xs font-extrabold uppercase tracking-widest rounded-full shadow-sm">
            What We Do & How We Work
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">
            YouTube Course Orchestration & AI-Guided Learning Pathways
          </h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            Nexus Learn bridges world-class public video education and structured academic LMS learning. We empower educators to orchestrate top YouTube content into structured courses while giving learners an all-in-one personalized workspace.
          </p>
        </div>

        {/* Dual Ecosystem Value Cards (Learner vs Educator) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: For Learners */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
                  <FaGraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-cyan-600 tracking-wider">For Learners</span>
                  <h3 className="text-xl font-bold text-gray-900">Personalized Learning Workspace</h3>
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                Experience structured learning without distraction. Access curated courses, discover skill roadmaps using AI, take notes, ask Q&A questions, and earn verified completion badges.
              </p>

              <div className="space-y-2.5 pt-2">
                {[
                  "AI-Powered Course Recommendations (SearchWithAi)",
                  "Dark Cinema Learning Workspace with embedded HD video",
                  "Interactive Q&A discussion & personal study notebook",
                  "Verified course completion progress tracking"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-gray-700 font-semibold">
                    <FaCheckCircle className="w-4 h-4 text-cyan-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => navigate("/allcourses")}
              className="w-full py-3 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2 mt-4"
            >
              <span>Explore Courses</span>
              <FaPlayCircle className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          </div>

          {/* Card 2: For Educators */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  <FaYoutube className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-red-600 tracking-wider">For Educators & Curators</span>
                  <h3 className="text-xl font-bold text-gray-900">YouTube Video Orchestration</h3>
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                Build high-impact structured courses without expensive video hosting. Curate video modules directly from leading YouTube creators and universities alongside your custom MP4 uploads.
              </p>

              <div className="space-y-2.5 pt-2">
                {[
                  "Zero video hosting friction using YouTube Data API",
                  "Auto-fetch video titles & channel attribution (oEmbed)",
                  "Curate multi-source channels into 1 structured course",
                  "Analytics Command Center for student enrollments"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-gray-700 font-semibold">
                    <FaCheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => navigate("/dashboard")}
              className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2 mt-4"
            >
              <span>Educator Dashboard</span>
              <FaUserCheck className="w-3.5 h-3.5 text-blue-600" />
            </button>
          </div>

        </div>

        {/* 3-Step "How It Works" Workflow Grid */}
        <div className="space-y-8 pt-6">
          <div className="text-center max-w-xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900">How It Works in 3 Simple Steps</h3>
            <p className="text-xs text-gray-500 mt-1">From course curation to skill mastery</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {workflowSteps.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 relative overflow-hidden">
                  <span className="text-4xl font-black text-gray-100 absolute top-4 right-4 select-none">
                    {item.step}
                  </span>

                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${item.color}`}>
                    <IconComp className="w-6 h-6" />
                  </div>

                  <h4 className="text-base font-bold text-gray-900">{item.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}

export default About;
