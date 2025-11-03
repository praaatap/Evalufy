'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { IoTimeOutline } from 'react-icons/io5';
import { FaExpand, FaCompress } from 'react-icons/fa';
import { MdNavigateNext, MdNavigateBefore } from 'react-icons/md';
import { AiOutlineWarning } from 'react-icons/ai';

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
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isExitWarningVisible, setIsExitWarningVisible] = useState(false);
  const [hasLeftFullScreen, setHasLeftFullScreen] = useState(false);

  // Handle full screen changes
  const handleFullscreenChange = useCallback(() => {
    const isCurrentlyFullscreen = document.fullscreenElement !== null;
    setIsFullScreen(isCurrentlyFullscreen);
    
    if (!isCurrentlyFullscreen && !loading && testData) {
      setHasLeftFullScreen(true);
      setIsExitWarningVisible(true);
      // Give user 5 seconds to return to fullscreen
      setTimeout(() => {
        if (!document.fullscreenElement) {
          router.push('/dashboard');
        }
      }, 5000);
    }
  }, [loading, testData, router]);

  // Set up fullscreen detection
  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [handleFullscreenChange]);

  // Toggle fullscreen
  const toggleFullScreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

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
        setTimeLeft(response.data.duration * 60);
        // Request fullscreen when test starts
        document.documentElement.requestFullscreen();
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

    let correctAnswers = 0;
    testData.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.answer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / testData.questions.length) * 100);

    localStorage.setItem('examResults', JSON.stringify({
      score,
      totalQuestions: testData.questions.length,
      correctAnswers,
      selectedAnswers,
      testName: testData.testName,
    }));

    router.push('/exam-results');
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'n') {
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'p') {
        handlePrevious();
      } else if (e.code === 'Space' && e.ctrlKey) {
        toggleFullScreen();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentQuestionIndex]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="loader"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white px-4">
        <div className="glass-card p-8 rounded-xl max-w-md w-full text-center">
          <div className="text-red-400 mb-4">
            <AiOutlineWarning size={48} className="mx-auto" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-red-400">Error</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-2 rounded-lg"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4">
      {/* Exit Warning Modal */}
      {isExitWarningVisible && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 rounded-xl max-w-md w-full text-center">
            <AiOutlineWarning size={48} className="mx-auto text-yellow-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Warning!</h3>
            <p className="text-gray-300 mb-4">
              Please return to full screen mode to continue your exam. 
              The exam will be terminated in 5 seconds if you remain in windowed mode.
            </p>
            <button
              onClick={() => document.documentElement.requestFullscreen()}
              className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-2 rounded-lg"
            >
              Return to Full Screen
            </button>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="glass-card p-4 rounded-xl mb-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <div className="text-gray-400">Question</div>
              <div className="text-xl font-bold">{currentQuestionIndex + 1}/{testData.questions.length}</div>
            </div>
            <div className="h-8 w-px bg-gray-700"></div>
            <div className="flex items-center space-x-2">
              <IoTimeOutline size={24} className="text-orange-400" />
              <div className="text-2xl font-bold font-mono">
                {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
              </div>
            </div>
          </div>
          
          <button
            onClick={toggleFullScreen}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label={isFullScreen ? "Exit full screen" : "Enter full screen"}
          >
            {isFullScreen ? <FaCompress size={20} /> : <FaExpand size={20} />}
          </button>
        </div>

        {/* Question Card */}
        <div className="glass-card p-8 rounded-xl mb-6">
          <h2 className="text-xl font-semibold mb-8 leading-relaxed">
            {currentQuestion.question}
          </h2>
          
          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(currentQuestionIndex, option)}
                className={`w-full p-4 rounded-xl text-left transition-all ${
                  selectedAnswers[currentQuestionIndex] === option
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/20'
                    : 'bg-white/5 hover:bg-white/10 hover:scale-[1.02]'
                }`}
                aria-label={`Option ${index + 1}: ${option}`}
              >
                <span className="inline-block w-6 h-6 rounded-full border-2 mr-3 text-center text-sm">
                  {String.fromCharCode(65 + index)}
                </span>
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all ${
              currentQuestionIndex === 0
                ? 'opacity-50 cursor-not-allowed'
                : 'bg-white/5 hover:bg-white/10 hover:scale-105'
            }`}
            aria-label="Previous question"
          >
            <MdNavigateBefore size={24} />
            <span>Previous</span>
          </button>
          
          {currentQuestionIndex === testData.questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="flex items-center space-x-2 px-8 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:scale-105 transition-all shadow-lg shadow-orange-500/20"
            >
              <span>Submit Test</span>
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:scale-105 transition-all shadow-lg shadow-orange-500/20"
            >
              <span>Next</span>
              <MdNavigateNext size={24} />
            </button>
          )}
        </div>

        {/* Question Navigation Dots */}
        <div className="mt-8 flex justify-center space-x-2 flex-wrap gap-2">
          {testData.questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentQuestionIndex
                  ? 'bg-orange-500 scale-125'
                  : selectedAnswers[index]
                  ? 'bg-green-500'
                  : 'bg-white/20'
              }`}
              aria-label={`Go to question ${index + 1}`}
            />
          ))}
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