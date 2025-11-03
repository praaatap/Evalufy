'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';

interface Question {
  question: string;
  options: string[];
  answer: string;
}

interface TestResponse {
  testId: string;
  testName: string;
  duration: number;
  message: string;
  questions?: Question[];
}

// --- Reusable Icon Components ---
// Using icons consistent with the landing page theme.
const ClipboardListIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10 mx-auto mb-3 sm:mb-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
);

const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10 mx-auto mb-3 sm:mb-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
  const searchParams = useSearchParams();
  const testId = searchParams.get('testId');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testData, setTestData] = useState<TestResponse | null>(null);

  useEffect(() => {
    const fetchTestData = async () => {
      if (!testId) {
        setError('No test ID provided');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching test data for ID:', testId);
        const response = await axios.get<TestResponse>(`http://localhost:8080/api/tests/${testId}`);
        const data = response.data;

        if (!data || !data.testName || !data.duration) {
          throw new Error('Invalid test data received');
        }

        console.log('Test data fetched successfully:', data);
        setTestData(data);
      } catch (err) {
        console.error('Error fetching test data:', err);
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 404) {
            setError('Test not found or has expired. Generated tests are only available for 5 minutes.');
          } else if (err.response?.data?.error) {
            setError(err.response.data.error);
          } else {
            setError(err.message || 'Failed to fetch test data');
          }
        } else {
          setError('Failed to fetch test data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTestData();
  }, [testId]);

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
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 sm:p-4 overflow-hidden">
        <main className="w-full max-w-2xl mx-auto text-center">
          {loading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <div className="loader"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 p-4 rounded-lg bg-red-500/10 mx-4 sm:mx-0">
              {error}
            </div>
          ) : testData ? (
            <>
              <header className="mb-8 sm:mb-10 animate-fade-in-up px-2 sm:px-0">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
                  Confirm Your <span className="gradient-text">Exam</span>
                </h1>
                <p className="text-base sm:text-lg text-gray-400 max-w-xl sm:max-w-2xl mx-auto">
                  Review your exam details before starting
                </p>
              </header>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12 px-2 sm:px-0">
                    {/* Questions Info Card */}
                <div className="config-card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <ClipboardListIcon />
                    <h3 className="text-xl font-semibold mb-4 text-white">Test Overview</h3>
                    <div className="text-gray-300">
                      <p className="mb-2">Test Name: <span className="text-white">{testData.testName}</span></p>
                      <p>Questions: <span className="text-white">{testData.questions?.length || 0}</span></p>
                    </div>
                </div>
                
                {/* Time Info Card */}
                <div className="config-card animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                    <ClockIcon />
                    <h3 className="text-xl font-semibold mb-3 text-white">Duration</h3>
                    <p className="text-4xl font-bold text-gray-100">
                      {testData.duration} <span className="text-lg font-medium text-gray-400">mins</span>
                    </p>
                </div>
              </div>

              {/* Sample Questions Preview */}
              {testData.questions && testData.questions.length > 0 && (
                <div className="config-card mb-8 animate-fade-in-up text-left" style={{ animationDelay: '0.4s' }}>
                  <h3 className="text-xl font-semibold mb-4 text-white">Sample Questions</h3>
                  <div className="space-y-4">
                    {testData.questions.slice(0, 2).map((q: Question, i: number) => (
                      <div key={i} className="p-4 bg-black/20 rounded-lg">
                        <p className="font-medium text-orange-400 mb-2">
                          {i + 1}. {q.question}
                        </p>
                        <ul className="space-y-1 text-sm text-gray-300">
                          {q.options.map((opt: string, j: number) => (
                            <li key={j}>{opt}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    {testData.questions.length > 2 && (
                      <p className="text-gray-400 text-sm italic text-center mt-4">
                        And {testData.questions.length - 2} more questions...
                      </p>
                    )}
                  </div>
                </div>
              )}              <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                <a 
                  href={`/test?testId=${testId}`} 
                  className="start-btn group inline-flex items-center justify-center text-white font-bold text-lg py-4 px-10 rounded-lg"
                >
                  Start Exam
                  <ArrowRightIcon />
                </a>
              </div>
            </>
          ) : null}
          

        </main>
      </div>
    </>
  );
};

export default ExamSetup;
