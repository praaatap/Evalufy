"use client";

import React, { useState, useEffect, Suspense } from "react";
import useQuestionStore from "../(store)/store";

// ✅ Define a TypeScript interface for your Question data
interface Question {
  question: string;
  options: Record<string, string>; // Example: { A: "Option A", B: "Option B" }
  correctAnswer?: string; // optional if not always present
}

interface ExamSettings {
  count: number;
  time: number;
}

const AlertTriangleIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-12 w-12 mx-auto text-yellow-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 
      2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 
      0L3.34 16c-.77 1.333.192 3 1.732 3z"
    />
  </svg>
);

const testingCode = () => {
  testingCode();
  console.log("This is a test function.");
}

const ExamComponent: React.FC = () => {
  const { questions, isLoading, error, fetchQuestions } = useQuestionStore();

  const [examStarted, setExamStarted] = useState<boolean>(false);
  const [examFinished, setExamFinished] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [examSettings, setExamSettings] = useState<ExamSettings>({
    count: 10,
    time: 18,
  });
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // Parse URL params and select questions
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const count = parseInt(params.get("questions") || "10", 10);
    const time = parseInt(params.get("time") || "18", 10);
    setExamSettings({ count, time });

    if (questions.length > 0) {
      const shuffled = [...questions].sort(() => 0.5 - Math.random());
      setFilteredQuestions(shuffled.slice(0, count));
    }
  }, [questions]);

  // Detect fullscreen exit
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (examStarted && !document.fullscreenElement) {
        setExamFinished(true);
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [examStarted]);

  const startExam = () => {
    if (filteredQuestions.length === 0) {
      alert("No questions have been loaded for the exam.");
      return;
    }

    document.documentElement
      .requestFullscreen()
      .then(() => setExamStarted(true))
      .catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
        );
      });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setExamFinished(true);
      if (document.fullscreenElement) document.exitFullscreen();
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen text-2xl font-semibold">
        Loading Questions...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Error: {error}
      </div>
    );

  if (examFinished)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-4">
        <AlertTriangleIcon />
        <h2 className="text-4xl font-bold mt-4 text-white">Exam Terminated</h2>
        <p className="text-lg text-gray-400 mt-2">
          You have exited full-screen mode or completed the test.
        </p>
        <button
          onClick={() => (window.location.href = "/")}
          className="start-btn mt-6 text-white font-bold py-3 px-8 rounded-lg"
        >
          Back to Home
        </button>
      </div>
    );

  if (!examStarted)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-4">
        <h2 className="text-4xl font-bold text-white">Ready to Begin?</h2>
        <p className="text-lg text-gray-400 mt-2 max-w-xl">
          You have selected{" "}
          <span className="font-bold text-orange-400">
            {examSettings.count} questions
          </span>{" "}
          for this test.
        </p>
        <p className="text-lg text-gray-400 mt-2 max-w-xl">
          The exam will start in full-screen mode. Exiting full-screen will
          automatically end the test.
        </p>
        <button
          onClick={startExam}
          className="start-btn mt-6 text-white font-bold py-3 px-8 rounded-lg"
        >
          Start Exam
        </button>
      </div>
    );

  if (filteredQuestions.length === 0)
    return (
      <div className="flex items-center justify-center h-screen text-2xl font-semibold">
        Preparing your exam...
      </div>
    );

  const currentQuestion = filteredQuestions[currentQuestionIndex];

  return (
    <div className="h-screen w-screen bg-[#0a0a0a] flex flex-col p-8 text-white overflow-y-auto">
      <div className="text-2xl font-bold mb-2">
        Question {currentQuestionIndex + 1} of {filteredQuestions.length}
      </div>

      <div className="w-full h-1 bg-neutral-800 rounded-full mb-6">
        <div
          className="h-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
          style={{
            width: `${
              ((currentQuestionIndex + 1) / filteredQuestions.length) * 100
            }%`,
          }}
        ></div>
      </div>

      <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium leading-relaxed">
          {currentQuestion.question}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(currentQuestion.options).map(([key, value]) => (
          <button key={key} className="option-btn text-left p-4 rounded-lg">
            <span className="font-bold mr-2">{key}.</span>
            {value}
          </button>
        ))}
      </div>

      <div className="mt-auto pt-6 text-right">
        <button
          onClick={handleNextQuestion}
          className="start-btn group inline-flex items-center justify-center text-white font-bold text-lg py-3 px-10 rounded-lg"
        >
          {currentQuestionIndex === filteredQuestions.length - 1
            ? "Finish Exam"
            : "Next Question"}
        </button>
      </div>
    </div>
  );
};

const Page: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen text-2xl font-semibold">
          Loading...
        </div>
      }
    >
      <style>{`
        body {
          font-family: 'Inter', sans-serif;
          background-color: #0a0a0a;
          background-image: radial-gradient(circle at 1px 1px, #2a2a2a 1px, transparent 0);
          background-size: 2rem 2rem;
          color: #e5e7eb;
        }
        .option-btn {
          background-color: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.2s ease-in-out;
        }
        .option-btn:hover {
          background-color: rgba(255, 255, 255, 0.1);
          border-color: #f76b1c;
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
      <ExamComponent />
    </Suspense>
  );
};

export default Page;
