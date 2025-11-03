import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Simple types for our test data
export interface Question {
    question: string;
    options: string[];
    answer: string;
}

export interface GenerateTestRequest {
    testName: string;
    description: string;
    numQuestions: number;
    duration: number;
    levelOfDifficulty?: string;
}

export interface TestResponse {
    testId: string;
    testName: string;
    duration: number;
    questions?: Question[];
    message?: string;
}

export const testService = {
    generateTest: async (data: GenerateTestRequest): Promise<TestResponse> => {
        try {
            const response = await axios.post<TestResponse>(`${baseURL}/api/tests/generate`, data);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.error || 'Failed to generate test');
            }
            throw new Error('Failed to generate test');
        }
    },
    
    getTestById: async (testId: string): Promise<TestResponse> => {
        try {
            const response = await axios.get<TestResponse>(`${baseURL}/api/tests/${testId}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.error || 'Failed to fetch test');
            }
            throw new Error('Failed to fetch test');
        }
    }
};