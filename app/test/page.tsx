'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface Question {
  question: string;
  options: string[];
  answer: string;
}

interface TestData {
  testName: string;
  duration: number;
  questions: Question[];
}

const ExamPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const testId = searchParams.get('testId');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testData, setTestData] = useState<TestData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  // Fetch test data
  useEffect(() => {
    const fetchTest = async () => {
      if (!testId) {
        setError('No test ID provided');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get<TestData>(`http://localhost:8080/api/tests/${testId}`);
        setTestData(response.data);
        setTimeLeft(response.data.duration * 60); // Convert minutes to seconds
      } catch (err) {
        console.error('Error fetching test:', err);
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setError('Test not found or has expired. Tests are only available for 5 minutes after creation.');
        } else {
          setError('Failed to load test data. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [testId]);

  // Timer countdown
  useEffect(() => {
    if (!timeLeft || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev && prev > 0) {
          return prev - 1;
        } else {
          clearInterval(timer);
          // Handle exam submission on time out
          handleSubmit();
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerSelect = (questionIndex: number, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const handleNext = () => {
    if (testData && currentQuestionIndex < testData.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (!testData) return;

    // Calculate score
    let correctAnswers = 0;
    testData.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.answer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / testData.questions.length) * 100);

    // Store results in local storage for the results page
    localStorage.setItem('examResults', JSON.stringify({
      score,
      totalQuestions: testData.questions.length,
      correctAnswers,
      selectedAnswers,
      testName: testData.testName,
    }));

    // Navigate to results page
    router.push('/exam-results');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="loader"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white px-4">
        <div className="glass-card p-8 rounded-xl max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-400">Error</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="cursor-pointer bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-2 rounded-lg"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!testData) return null;

  const currentQuestion = testData.questions[currentQuestionIndex];
  const minutes = Math.floor((timeLeft || 0) / 60);
  const seconds = (timeLeft || 0) % 60;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with Timer and Progress */}
        <div className="glass-card p-4 rounded-xl mb-6 flex justify-between items-center">
          <div className="text-sm">
            Question {currentQuestionIndex + 1} of {testData.questions.length}
          </div>
          <div className="text-xl font-bold text-orange-400">
            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
          </div>
        </div>

        {/* Question Card */}
        <div className="glass-card p-6 rounded-xl mb-6">
          <h2 className="text-xl font-semibold mb-6">{currentQuestion.question}</h2>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(currentQuestionIndex, option)}
                className={`w-full p-4 rounded-lg text-left transition-all ${
                  selectedAnswers[currentQuestionIndex] === option
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {currentQuestionIndex === testData.questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
            >
              Submit Test
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
            >
              Next
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .glass-card {
          background: rgba(20, 20, 20, 0.6);
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
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

export default ExamPage;