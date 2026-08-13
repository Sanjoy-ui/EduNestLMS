import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeftLong } from "react-icons/fa6";
import Footer from '../components/Footer';

function Terms() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 py-12 px-4 max-w-4xl mx-auto w-full animate-[fadeIn_0.5s_ease-out]">
        
        {/* Navigation & Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer shadow-sm"
          >
            <FaArrowLeftLong className="w-4 h-4 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Terms of Service</h1>
            <p className="text-xs text-gray-400 mt-1">Last updated: August 13, 2026 • EduNest LMS / Nexus Learn Inc.</p>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl border border-gray-100 p-8 md:p-10 shadow-sm space-y-8 text-gray-700 leading-relaxed text-sm">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">1. Acceptance of Terms</h2>
            <p>
              By accessing or using EduNest LMS ("Platform", "Services", "We", "Us"), you agree to be bound by these Terms of Service. If you do not agree to all terms and conditions, you may not access or use our services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">2. User Account & Security</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials (including passwords and authentication tokens). You agree to notify EduNest LMS immediately of any unauthorized access or breach of security.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">3. Course Content & Intellectual Property</h2>
            <p>
              All course materials, videos, graphics, quizzes, and software provided on EduNest LMS are protected by copyright laws. Purchasing or enrolling in a course grants you a personal, non-transferable, non-exclusive license to view content for educational purposes only.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>You may not record, redistribute, sell, or publicly display course video streams.</li>
              <li>Educators retain ownership of original content authored on the platform.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">4. Payments, Enrollments & Refunds</h2>
            <p>
              Course prices are displayed in local currencies (e.g. INR) inclusive of applicable taxes. Paid course purchases provide full lifetime access to published lectures unless specified otherwise. Refund requests are subject to our 7-day money-back guarantee policy for eligible courses.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">5. Acceptable Use Policy</h2>
            <p>
              You agree not to use the Platform to upload malicious code, engage in unauthorized scraping, post offensive content, or violate any applicable laws or regulations.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">6. Limitation of Liability</h2>
            <p>
              EduNest LMS and its affiliates shall not be liable for any indirect, incidental, special, or consequential damages resulting from your use of or inability to use the Platform.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">7. Contact Information</h2>
            <p>
              If you have questions regarding these Terms, please contact our legal team at:
            </p>
            <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl font-mono text-xs text-gray-800">
              Email: legal@edunestlms.com | support@nexuslearn.io
            </div>
          </section>

        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Terms;
