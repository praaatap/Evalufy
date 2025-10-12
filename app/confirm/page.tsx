'use client';
import React, { useState } from 'react';

// --- Reusable Icon Components ---
// Using icons consistent with the landing page theme.
const ClipboardListIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
);

const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
);


// --- Main App Component ---
const ExamSetup = () => {
  const [questionCount, setQuestionCount] = useState(10);
  // Exam time is calculated based on question count (approx. 1.8 mins per question)
  const examTime = Math.round(questionCount * 1.8);

  const questionOptions = [10, 25, 65]; // Quick select options

  return (
    <>
      <style>{`
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fade-in-up 0.5s ease-out forwards;
            opacity: 0;
        }
        body {
            font-family: 'Inter', sans-serif;
            background-color: #0a0a0a;
            background-image: radial-gradient(circle at 1px 1px, #2a2a2a 1px, transparent 0);
            background-size: 2rem 2rem;
            color: #e5e7eb;
        }
        .config-card {
            background-color: rgba(20, 20, 20, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border-radius: 1rem;
            padding: 1.5rem;
            text-align: center;
        }
        .gradient-text {
            background: linear-gradient(90deg, #f9973e, #f76b1c);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-fill-color: transparent;
        }
        .option-btn {
            background-color: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.2s ease-in-out;
        }
        .option-btn:hover {
            background-color: rgba(255, 255, 255, 0.1);
            border-color: rgba(255, 255, 255, 0.2);
        }
        .option-btn.selected {
            background: linear-gradient(90deg, #f9973e, #f76b1c);
            color: white;
            border-color: transparent;
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
      `}</style>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden">
        <main className="w-full max-w-2xl mx-auto text-center">
          
          <header className="mb-10 animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-4">
              Customize Your <span className="gradient-text">Practice Exam</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Select the number of questions to tailor the test to your needs.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Question Selection Card */}
            <div className="config-card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <ClipboardListIcon />
                <h3 className="text-xl font-semibold mb-4 text-white">Number of Questions</h3>
                <div className="flex justify-center space-x-3">
                    {questionOptions.map(opt => (
                        <button 
                            key={opt}
                            onClick={() => setQuestionCount(opt)}
                            className={`option-btn font-semibold py-2 px-5 rounded-lg ${questionCount === opt ? 'selected' : ''}`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>
            
            {/* Time Display Card */}
            <div className="config-card animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <ClockIcon />
                <h3 className="text-xl font-semibold mb-3 text-white">Estimated Duration</h3>
                <p className="text-4xl font-bold text-gray-100">{examTime} <span className="text-lg font-medium text-gray-400">mins</span></p>
            </div>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <a href={`/aws_exam_practice?questions=${questionCount}&time=${examTime}`} className="start-btn group inline-flex items-center justify-center text-white font-bold text-lg py-4 px-10 rounded-lg">
              Start Exam
              <ArrowRightIcon />
            </a>
          </div>

        </main>
      </div>
    </>
  );
};

export default ExamSetup;
