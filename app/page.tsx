'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

// --- Import Modular Components ---
import FeatureCard from '@/components/FeatureCard';
import {
  ShieldCheckIcon,
  LightBulbIcon,
  InfoIcon,
  ClockIcon,
  ArrowRightIcon
} from '@/components/Icons';

// --- Main App Component ---
const App: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Auto-redirect to dashboard if user is authenticated (Your logic, unchanged)
  useEffect(() => {
    if (status === 'loading') return;
    
    if (session?.user) {
      console.log('User is authenticated, redirecting to dashboard...');
      router.prefetch('/dashboard');
      router.replace('/dashboard');
    }
  }, [session, status, router]);

  // Don't render content if we're going to redirect
  if (status === 'loading' || session?.user) {
    return (
      <div className="page-loader-wrapper">
        <div className="loader"></div>
      </div>
    );
  }

  // --- RENDER THE LANDING PAGE ---
  return (
    <div className="page-wrapper">
      
      {/* This <main> tag holds all your primary page content.
        The <footer> is now its sibling, which is semantically correct.
      */}
      <main className="w-full max-w-4xl mx-auto text-center">
        
        {/* HERO SECTION */}
        <section className="hero-section mb-8 sm:mb-10 animate-fade-in-up">
          <div className="header-icon-wrapper inline-block border p-2 sm:p-3 rounded-full mb-4">
            <ShieldCheckIcon />
          </div>
          <h1 className="page-title text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-4">
            Ace Your <span className="gradient-text">Exam</span>
          </h1>
          <p className="page-subtitle text-base sm:text-lg max-w-xl sm:max-w-2xl mx-auto px-2 sm:px-0">
            Sharpen your skills with our free practice test. Experience a realistic exam simulation with high-quality questions written by certified professionals.
          </p>
        </section>

        {/* FEATURES SECTION */}
        <section className="features-section grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 px-2 sm:px-0">
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
        </section>

        {/* CALL-TO-ACTION (CTA) SECTION */}
        <section
          className="cta-section animate-fade-in-up flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0"
          style={{ animationDelay: '0.5s' }}
        >
          <Link
            href="/auth?action=signin"
            className="login-btn group inline-flex items-center justify-center font-semibold text-base sm:text-lg py-3 sm:py-4 px-8 sm:px-10 rounded-lg"
          >
            Login
          </Link>
          <Link
            href="/browse-exams"
            className="start-btn group inline-flex items-center justify-center font-bold text-lg py-4 px-10 rounded-lg"
          >
            Start Free Practice Test
            <ArrowRightIcon />
          </Link>
        </section>

      </main>

      {/* FOOTER (Now a sibling to <main>) */}
      <footer className="page-footer text-center mt-12 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
        <p>&copy; 2025 Evalufy. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export const dynamic = 'force-static';
export default App;