import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeftLong } from "react-icons/fa6";
import Footer from '../components/Footer';

function Privacy() {
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
            <h1 className="text-3xl font-extrabold text-gray-900">Privacy Policy</h1>
            <p className="text-xs text-gray-400 mt-1">Last updated: August 13, 2026 • EduNest LMS / Nexus Learn Inc.</p>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl border border-gray-100 p-8 md:p-10 shadow-sm space-y-8 text-gray-700 leading-relaxed text-sm">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">1. Information We Collect</h2>
            <p>
              We collect information to provide better services to our learners and educators:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li><strong>Account Information:</strong> Name, email address, password hash, and profile picture (via email signup or Google Auth).</li>
              <li><strong>Usage Data:</strong> Enrolled courses, lecture progress, quiz scores, and reviews.</li>
              <li><strong>Technical Logs:</strong> IP address, browser type, device details, and session cookies.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">2. How We Use Your Information</h2>
            <p>
              Your data is utilized strictly for authenticating accounts, delivering course video streams, processing payments safely via Razorpay, generating personalized AI course recommendations, and improving system performance.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">3. Cookies & Security</h2>
            <p>
              EduNest LMS uses HTTP-only, secure cookies for session authentication (`token`). We do not store sensitive payment card details on our servers — all financial transactions are processed securely through PCI-DSS compliant gateways.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">4. Third-Party Services</h2>
            <p>
              We integrate trusted third-party providers including Google Firebase Authentication, Cloudinary CDN for video delivery, and Razorpay for payment processing. Each provider operates under strict privacy and security standards.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">5. Your Data Protection Rights (GDPR & CCPA)</h2>
            <p>
              You have the right to access, update, export, or request the deletion of your personal data at any time from your account profile settings or by contacting our data protection officer.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">6. Privacy Contacts</h2>
            <p>
              For data privacy inquiries or deletion requests, please contact:
            </p>
            <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl font-mono text-xs text-gray-800">
              Privacy Team: privacy@edunestlms.com | Data Protection Officer: dpo@nexuslearn.io
            </div>
          </section>

        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Privacy;
