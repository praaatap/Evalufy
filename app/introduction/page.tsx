'use client'

import React from 'react'
import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react'

// --- Icons ---
const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#f76b1c]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l7 4v6a10 10 0 11-14 0V6l7-4z" />
  </svg>
)

const FeatureIcon = ({ children }: { children: React.ReactNode }) => (
  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
    {children}
  </div>
)

const ArrowRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
)

// --- Main Page ---
export default function IntroductionPage() {
  const { data: session } = useSession()

  return (
    <>
      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fade-up 0.6s ease-out forwards; opacity: 0; }
        body {
          background-color: #0a0a0a;
          background-image: radial-gradient(circle at 1px 1px, #2a2a2a 1px, transparent 0);
          background-size: 2rem 2rem;
        }
        .glass {
          background-color: rgba(20,20,20,0.5);
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
        }
        .gradient-text {
          background: linear-gradient(90deg, #f9973e, #f76b1c);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .start-btn {
          background: linear-gradient(90deg, #f9973e, #f76b1c);
          box-shadow: 0 4px 20px rgba(252,127,43,0.3);
          transition: all 0.3s ease-in-out;
        }
        .start-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 30px rgba(252,127,43,0.4);
        }
        .logout-btn {
          background: linear-gradient(90deg, #3a8dff, #0056ff);
          box-shadow: 0 4px 20px rgba(0,86,255,0.3);
          transition: all 0.3s ease-in-out;
        }
        .logout-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 30px rgba(0,86,255,0.4);
        }
      `}</style>

      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <div className="fade-up max-w-4xl w-full">
          {/* HEADER */}
          <div className="flex flex-col items-center mb-8">
            <div className="bg-white/5 border border-white/10 p-4 rounded-full mb-5">
              <ShieldIcon />
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3">
              Welcome to <span className="gradient-text">EvalufyAI</span>
            </h1>
            <p className="text-gray-400 max-w-xl mx-auto">
              {session
                ? `Hi ${session.user?.name || 'Learner'}, ready to continue your journey?`
                : 'Sharpen your skills with realistic, AI-powered exam simulations.'}
            </p>
          </div>

          {/* FEATURES */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="glass rounded-2xl p-6 fade-up" style={{ animationDelay: '0.2s' }}>
              <FeatureIcon>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </FeatureIcon>
              <h3 className="text-lg font-semibold text-white mb-1">Smart Practice</h3>
              <p className="text-gray-400 text-sm">Adaptive AI adjusts difficulty as you improve.</p>
            </div>
            <div className="glass rounded-2xl p-6 fade-up" style={{ animationDelay: '0.3s' }}>
              <FeatureIcon>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l7 4v6a10 10 0 11-14 0V6l7-4z" />
                </svg>
              </FeatureIcon>
              <h3 className="text-lg font-semibold text-white mb-1">Secure Progress</h3>
              <p className="text-gray-400 text-sm">Your progress and results are safely stored.</p>
            </div>
            <div className="glass rounded-2xl p-6 fade-up" style={{ animationDelay: '0.4s' }}>
              <FeatureIcon>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </FeatureIcon>
              <h3 className="text-lg font-semibold text-white mb-1">Timed Exams</h3>
              <p className="text-gray-400 text-sm">Get used to real exam conditions with timers.</p>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="fade-up flex flex-col sm:flex-row gap-4 justify-center" style={{ animationDelay: '0.5s' }}>
            {session ? (
              <>
                <Link href="/dashboard" className="start-btn group inline-flex items-center justify-center text-white font-bold py-4 px-10 rounded-lg">
                  Go to Dashboard
                  <ArrowRight />
                </Link>
                <button onClick={() => signOut()} className="logout-btn group inline-flex items-center justify-center text-white font-bold py-4 px-10 rounded-lg">
                  Logout
                </button>
              </>
            ) : (
              <button onClick={() => signIn('google')} className="start-btn group inline-flex items-center justify-center text-white font-bold py-4 px-10 rounded-lg">
                Sign in with Google
                <ArrowRight />
              </button>
            )}
          </div>

          {/* FOOTER */}
          <footer className="text-gray-500 mt-10 text-sm fade-up" style={{ animationDelay: '0.6s' }}>
            © 2025 EvalufyAI — All Rights Reserved.
          </footer>
        </div>
      </div>
    </>
  )
}
