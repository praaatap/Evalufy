'use client';
import React, { useState } from 'react';
import { Icons } from '../icons';
import { useRouter } from 'next/navigation';
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

export const CreateTest: React.FC = () => {
    const [testName, setTestName] = useState("");
    const [description, setDescription] = useState("");
    const [numQuestions, setNumQuestions] = useState(5);
    const [duration, setDuration] = useState(30);
    const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
    const [loading, setLoading] = useState(false);
    const [generatedQuestions, setGeneratedQuestions] = useState<
        { question: string; options: string[]; answer: string }[]
    >([]);

    const router = useRouter();

    const handleGenerate = async () => {
        try {
            // Validate inputs
            if (!testName.trim()) return alert("Enter a test name!");
            if (!description.trim()) return alert("Enter a description!");
            if (numQuestions < 1) return alert("Enter at least 1 question!");
            if (duration < 5) return alert("Duration must be at least 5 minutes!");
            
            setLoading(true);
            console.log('Generating test with parameters:', {
                testName,
                description,
                numQuestions,
                duration,
                levelOfDifficulty: difficulty
            });

            const response = await axios.post<TestResponse>('http://localhost:8080/api/tests/generate', {
                testName,
                description,
                numQuestions,
                duration,
                levelOfDifficulty: difficulty
            }); 

            console.log('Test generated successfully:', response.data);

            // You can show questions if returned here
            if (response?.data?.questions) {
                setGeneratedQuestions(response.data.questions as Question[]);
            }

            // Redirect to confirmation page with testId
            router.push(`/confirm?testId=${response.data.testId}`);
        } catch (error) {
            setLoading(false);
            console.error('Error generating test:', error);
            
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.message || error.message || 'Failed to generate test. Please try again.');
            } else {
                alert('An unexpected error occurred. Please try again.');
            }
        }

    };

    return (
        <div className="min-h-screen text-white flex flex-col items-center px-4 py-10">
            <div className="glass-card w-full max-w-5xl p-8 rounded-2xl shadow-lg">
                <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center gradient-text">
                    ✨ Create AI-Generated Test
                </h1>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* Test Name */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Test Name</label>
                        <input
                            value={testName}
                            onChange={(e) => setTestName(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 outline-none"
                            placeholder="e.g. AWS Basics"
                        />
                    </div>

                    {/* Duration */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Duration (mins)</label>
                        <input
                            type="number"
                            min={5}
                            value={duration}
                            onChange={(e) => setDuration(Number(e.target.value))}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 outline-none"
                        />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                        <label className="block text-sm text-gray-400 mb-1">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 outline-none"
                            placeholder="Short description about this test..."
                        />
                    </div>

                    {/* Number of Questions */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Number of Questions</label>
                        <input
                            type="number"
                            min={1}
                            value={numQuestions}
                            onChange={(e) => setNumQuestions(Number(e.target.value))}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 outline-none"
                        />
                    </div>

                    {/* Difficulty Level */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Difficulty Level</label>
                        <select
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value as "Easy" | "Medium" | "Hard")}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 outline-none"
                        >
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>
                </div>

                {/* Generate Button */}
                <div className="text-center">
                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className={`action-btn px-10 py-3 rounded-xl text-lg font-semibold ${loading ? "opacity-70" : ""}`}
                    >
                        ⚡ {loading ? "Generating with AI..." : "Generate Questions"}
                    </button>
                </div>

                {/* Loader */}
                {loading && (
                    <div className="flex justify-center mt-6">
                        <div className="loader"></div>
                    </div>
                )}

                {/* Generated Questions */}
                {!loading && generatedQuestions.length > 0 && (
                    <div className="border-t border-white/10 pt-6 mt-8">
                        <h2 className="text-2xl font-bold mb-4 gradient-text">Generated Questions</h2>
                        <div className="space-y-4">
                            {generatedQuestions.map((q, i) => (
                                <div key={i} className="glass-card p-4 rounded-xl border border-white/10">
                                    <p className="font-medium text-orange-400">
                                        {i + 1}. {q.question}
                                    </p>
                                    <ul className="pl-5 mt-2 list-disc text-sm text-gray-300">
                                        {q.options.map((opt, j) => (
                                            <li key={j}>{opt}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                .glass-card {
                    background: rgba(20, 20, 20, 0.6);
                    border: 1px solid rgba(255,255,255,0.1);
                    backdrop-filter: blur(10px);
                }
                .action-btn {
                    background: linear-gradient(90deg, #f9973e, #f76b1c);
                    box-shadow: 0 4px 20px rgba(247, 107, 28, 0.3);
                    color: white;
                    transition: all 0.3s;
                }
                .action-btn:hover {
                    transform: scale(1.05);
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
