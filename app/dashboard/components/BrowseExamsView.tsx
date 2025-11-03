import React, { useState, useMemo } from 'react';
import { ExamCard } from './ExamCard';
import { ExamCategory, Exam } from '../types';

const CATEGORIES: ('All' | ExamCategory)[] = ['All', 'Cloud', 'Security', 'DevOps', 'Custom'];

const EXAM_DATA: Exam[] = [
    { title: 'AWS Certified Solutions Architect - Associate', questions: 65, duration: '130 mins', slug: 'aws-saa', category: 'Cloud' },
    { title: 'CompTIA Security+', questions: 90, duration: '90 mins', slug: 'comptia-sec', category: 'Security' },
    { title: 'Certified Kubernetes Administrator (CKA)', questions: 20, duration: '120 mins', slug: 'cka', category: 'DevOps' },
];

interface BrowseExamsViewProps {
    searchTerm: string;
}

export const BrowseExamsView: React.FC<BrowseExamsViewProps> = ({ searchTerm }) => {
    const [category, setCategory] = useState<'All' | ExamCategory>('All');
    const filtered = useMemo(
        () => EXAM_DATA.filter(e => 
            (category === 'All' || e.category === category) && 
            e.title.toLowerCase().includes(searchTerm.toLowerCase())
        ), 
        [searchTerm, category]
    );

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4 text-white">Browse Exams</h2>
            <div className="flex gap-2 mb-6 flex-wrap">
                {CATEGORIES.map((cat: 'All' | ExamCategory) => (
                    <button 
                        key={cat} 
                        onClick={() => setCategory(cat)} 
                        className={`py-1.5 px-4 rounded-full text-sm font-semibold ${
                            category === cat ? 'bg-orange-500 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((exam: Exam) => <ExamCard key={exam.slug} exam={exam} />)}
            </div>
        </div>
    );
};