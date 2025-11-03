import React from 'react';
import Link from 'next/link';
import { Exam } from '../types';

interface ExamCardProps {
    exam: Exam;
}

export const ExamCard: React.FC<ExamCardProps> = ({ exam }) => (
    <div className="glass-card p-5 rounded-xl border border-transparent hover:border-orange-500/30 transition-all hover:shadow-xl">
        <span className="text-xs bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full">{exam.category}</span>
        <h3 className="text-lg font-bold text-white mt-3 mb-2">{exam.title}</h3>
        <p className="text-gray-400 text-sm mb-4">{exam.questions} Questions • {exam.duration}</p>
        <Link href={`/confirm/${exam.slug}`}>
            <button className="start-btn py-2 px-4 w-full rounded-lg font-semibold text-sm">Start Exam</button>
        </Link>
    </div>
);