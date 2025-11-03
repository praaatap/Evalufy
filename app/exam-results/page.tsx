'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ExamResults {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  selectedAnswers: { [key: number]: string };
  testName: string;
}

const ResultsPage: React.FC = () => {
  const router = useRouter();
  const [results, setResults] = useState<ExamResults | null>(null);

  useEffect(() => {
    const storedResults = localStorage.getItem('examResults');
    if (!storedResults) {
      router.replace('/dashboard');
      return;
    }

    setResults(JSON.parse(storedResults));
    // Clear results from storage
    localStorage.removeItem('examResults');
  }, [router]);

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="loader"></div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4">
      <div className="max-w-2xl mx-auto">
        <div className="glass-card p-8 rounded-xl">
          <h1 className="text-3xl font-bold mb-6 text-center gradient-text">
            Exam Results
          </h1>

          <div className="text-center mb-8">
            <h2 className="text-xl text-gray-400 mb-2">{results.testName}</h2>
            <div className={`text-5xl font-bold mb-2 ${getScoreColor(results.score)}`}>
              {results.score}%
            </div>
            <p className="text-gray-400">
              {results.correctAnswers} correct out of {results.totalQuestions} questions
            </p>
          </div>

          <div className="space-y-4 text-center">
            {results.score >= 80 ? (
              <p className="text-green-400 text-lg">
                Excellent! You've demonstrated a strong understanding of the material.
              </p>
            ) : results.score >= 60 ? (
              <p className="text-yellow-400 text-lg">
                Good effort! There's room for improvement but you're on the right track.
              </p>
            ) : (
              <p className="text-red-400 text-lg">
                Keep practicing! Review the materials and try again to improve your score.
              </p>
            )}
          </div>

          <div className="mt-8 flex justify-center space-x-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .glass-card {
          background: rgba(20, 20, 20, 0.6);
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
        }
        .gradient-text {
          background: linear-gradient(90deg, #f9973e, #f76b1c);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .loader {
          border: 4px solid rgba(255,255,255,0.1);
          border-left-color: #f76b1c;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ResultsPage;