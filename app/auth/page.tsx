'use client';

import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#f76b1c]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const updateChanegs = () => console.log(`
  working
  `)

export default function AuthPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const action = searchParams.get('action') || 'login';
  const isLogin = action === 'login';
  updateChanegs();
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
        .glass-card {
          background-color: rgba(20, 20, 20, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
        }
        .action-btn {
          background: linear-gradient(90deg, #f9973e, #f76b1c);
          box-shadow: 0 4px 20px 0 rgba(252, 127, 43, 0.3);
          transition: all 0.3s ease-in-out;
        }
        .action-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 30px 0 rgba(252, 127, 43, 0.4);
        }
        .gradient-text {
          background: linear-gradient(90deg, #f9973e, #f76b1c);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>

      <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden">
        <div className="glass-card rounded-2xl p-8 w-full max-w-md shadow-2xl animate-fade-in-up">
          {/* HEADER */}
          <div className="text-center mb-6">
            <div className="inline-block bg-neutral-800 border border-neutral-700 p-3 rounded-full mb-4">
              <UserIcon />
            </div>
            <h2 className="text-3xl font-bold text-white">
              {isLogin ? 'Welcome Back' : 'Create Your Account'}
            </h2>
            <p className="text-gray-400 mt-2 text-sm">
              {isLogin
                ? 'Sign in to access your personalized dashboard.'
                : 'Sign up and start your exam journey today!'}
            </p>
          </div>

          {/* FORM */}
          <form className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm mb-1 text-gray-300">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full p-3 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm mb-1 text-gray-300">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full p-3 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              />
            </div>

            {/* Confirm Password (Only Signup) */}
            {!isLogin && (
              <div>
                <label className="block text-sm mb-1 text-gray-300">Confirm Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full p-3 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full action-btn text-white font-semibold py-3 rounded-xl text-lg mt-2"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>

            {/* Divider */}
            <div className="flex items-center justify-center text-gray-500 my-2 text-sm">
              <span className="w-1/3 border-b border-gray-700" />
              <span className="mx-3">OR</span>
              <span className="w-1/3 border-b border-gray-700" />
            </div>

            {/* Google Login */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl py-3 transition-all text-white"
            >
              <FcGoogle size={22} />
              Continue with Google
            </button>
          </form>

          {/* FOOTER TEXT */}
          <div className="text-center mt-6 text-gray-400 text-sm">
            {isLogin ? (
              <>
                Don’t have an account?{' '}
                <button
                  onClick={() => router.push('/auth?action=signup')}
                  className="font-semibold text-orange-400 hover:underline"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => router.push('/auth?action=login')}
                  className="font-semibold text-orange-400 hover:underline"
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}