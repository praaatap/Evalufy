import React from 'react';
import Link from 'next/link';

// --- Reusable Icon Components ---
const ShieldCheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#f76b1c]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const LightBulbIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

// --- Reusable Feature Card Component ---
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay }) => (
  <div
    className="feature-card p-6 rounded-2xl transition-all transform hover:-translate-y-1 hover:shadow-2xl animate-fade-in-up"
    style={{ animationDelay: delay }}
  >
    {icon}
    <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

// --- Main App Component ---
const App: React.FC = () => {
  return (
    <>
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; opacity: 0; }
        body {
          font-family: 'Inter', sans-serif;
          background-color: #0a0a0a;
          background-image: radial-gradient(circle at 1px 1px, #2a2a2a 1px, transparent 0);
          background-size: 2rem 2rem;
          color: #e5e7eb;
        }
        .feature-card {
          background-color: rgba(20, 20, 20, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
        }
        .gradient-text {
          background: linear-gradient(90deg, #f9973e, #f76b1c);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .start-btn {
          background: linear-gradient(90deg, #f9973e, #f76b1c);
          box-shadow: 0 4px 20px 0 rgba(252, 127, 43, 0.3);
          transition: all 0.3s ease-in-out;
        }
        .start-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 30px 0 rgba(252, 127, 43, 0.4);
        }
        .login-btn {
          background: linear-gradient(90deg, #3a8dff, #0056ff);
          box-shadow: 0 4px 20px 0 rgba(0, 86, 255, 0.3);
          transition: all 0.3s ease-in-out;
        }
        .login-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 30px 0 rgba(0, 86, 255, 0.4);
        }
      `}</style>

      <div className="min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden">
        <main className="w-full max-w-4xl mx-auto text-center">

          {/* HEADER */}
          <header className="mb-10 animate-fade-in-up">
            <div className="inline-block bg-neutral-800 border border-neutral-700 p-3 rounded-full mb-4">
              <ShieldCheckIcon />
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-4">
              Ace Your <span className="gradient-text">Exam</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Sharpen your skills with our free practice test. Experience a realistic exam simulation with high-quality questions written by certified professionals.
            </p>
          </header>

          {/* FEATURE CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <FeatureCard
              icon={<LightBulbIcon />}
              title="Realistic Questions"
              description="Up-to-date questions that mirror the actual exam format and difficulty."
              delay="0.2s"
            />
            <FeatureCard
              icon={<InfoIcon />}
              title="Detailed Explanations"
              description="Understand the 'why' behind each answer with clear, concise explanations."
              delay="0.3s"
            />
            <FeatureCard
              icon={<ClockIcon />}
              title="Timed Simulation"
              description="Get accustomed to the exam's time pressure with our built-in timer."
              delay="0.4s"
            />
          </div>

          {/* BUTTONS SECTION */}
          <div
            className="animate-fade-in-up flex flex-col sm:flex-row gap-4 justify-center"
            style={{ animationDelay: '0.5s' }}
          >
            {/* LOGIN BUTTON (New One) */}
            <Link
              href="/auth?action=signin"
              className="login-btn group inline-flex items-center justify-center text-white font-bold text-lg py-4 px-10 rounded-lg"
            >
              Login
            </Link>

            {/* START EXAM BUTTON (Original One) */}
            <Link
              href="/browse-exams"
              className="start-btn group inline-flex items-center justify-center text-white font-bold text-lg py-4 px-10 rounded-lg"
            >
              Start Free Practice Test
              <ArrowRightIcon />
            </Link>
          </div>

        </main>

        {/* FOOTER */}
        <footer className="text-center mt-12 text-gray-500 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <p>&copy; 2025 Evalufy. All Rights Reserved.</p>
        </footer>
      </div>
    </>
  );
};

export const dynamic = 'force-static';

export default App;
