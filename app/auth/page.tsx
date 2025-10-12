'use client';
import React, { useState, useEffect, Suspense } from 'react';

// Your existing icon components remain the same...
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#f76b1c]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="22" height="22" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.901,35.636,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
  </svg>
);

// Create a component that uses useSearchParams
function AuthContent() {
  const [action, setAction] = useState('login');
  
  useEffect(() => {
    // Read URL params on initial load
    const params = new URLSearchParams(window.location.search);
    const actionParam = params.get('action');
    if (actionParam) {
      setAction(actionParam);
    }

    // Listen for browser back/forward navigation
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setAction(params.get('action') || 'login');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const isLogin = action === 'login';

  const handleNavigation = (newAction: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('action', newAction);
    window.history.pushState({}, '', url);
    setAction(newAction);
  };

  return (
    <div className="h-screen flex items-center justify-center p-4 overflow-hidden">
      <div className="glass-card rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl animate-fade-in-up">
        {/* HEADER */}
        <div className="text-center mb-6">
          <div className="inline-block bg-neutral-800 border border-neutral-700 p-3 rounded-full mb-4">
            <UserIcon />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
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
            <GoogleIcon />
            Continue with Google
          </button>
        </form>

        {/* FOOTER TEXT */}
        <div className="text-center mt-6 text-gray-400 text-sm">
          {isLogin ? (
            <>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => handleNavigation('signup')}
                className="font-semibold text-orange-400 hover:underline"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => handleNavigation('login')}
                className="font-semibold text-orange-400 hover:underline"
              >
                Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Main AuthPage component with Suspense
export default function AuthPage() {
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
      
      <Suspense fallback={
        <div className="h-screen flex items-center justify-center">
          <div className="text-white text-lg">Loading...</div>
        </div>
      }>
        <AuthContent />
      </Suspense>
    </>
  );
}