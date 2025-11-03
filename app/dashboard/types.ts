export type ExamCategory = 'Cloud' | 'Security' | 'DevOps' | 'Custom';

export type Exam = {
    title: string;
    questions: number;
    duration: string;
    slug: string;
    category: ExamCategory;
};

export const VIEWS = {
    BROWSE: 'browse',
    CREATE: 'create',
    RESULTS: 'results',
    PROFILE: 'profile'
} as const;

export type View = typeof VIEWS[keyof typeof VIEWS];

export interface Question {
    question: string;
    options: string[];
    correctOption: number;
}