import { ExamCategory } from '../types';

export const EXAM_DATA = [
    { 
        title: 'AWS Certified Solutions Architect - Associate', 
        questions: 65, 
        duration: '130 mins', 
        slug: 'aws-saa', 
        category: 'Cloud' as ExamCategory 
    },
    { 
        title: 'CompTIA Security+', 
        questions: 90, 
        duration: '90 mins', 
        slug: 'comptia-sec', 
        category: 'Security' as ExamCategory 
    },
    { 
        title: 'Certified Kubernetes Administrator (CKA)', 
        questions: 20, 
        duration: '120 mins', 
        slug: 'cka', 
        category: 'DevOps' as ExamCategory 
    }
];

export const CATEGORIES: ('All' | ExamCategory)[] = ['All', 'Cloud', 'Security', 'DevOps', 'Custom'];