import React from 'react';
import { signOut, useSession } from 'next-auth/react';

export const ProfileView: React.FC = () => {
    const { data: session } = useSession();

    return (
        <div className="flex flex-col items-center text-white mt-4">
            {/* Header */}
            <div className="glass-card w-full max-w-3xl p-8 rounded-2xl flex flex-col md:flex-row items-center md:items-start gap-6">
                <img
                    src={session?.user?.image || '/user.png'}
                    alt="Profile"
                    className="w-28 h-28 rounded-full border-2 border-orange-500/40 object-cover shadow-lg"
                />
                <div className="text-center md:text-left flex-1">
                    <h2 className="text-2xl font-bold">{session?.user?.name || 'User Name'}</h2>
                    <p className="text-gray-400">{session?.user?.email || 'user@email.com'}</p>
                    <p className="text-sm text-orange-400 mt-1">Member since June 2024</p>

                    <div className="flex flex-wrap gap-3 mt-4">
                        <span className="bg-white/10 text-sm px-3 py-1 rounded-full">Free Plan</span>
                        <span className="bg-white/10 text-sm px-3 py-1 rounded-full">Student Tier</span>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 w-full max-w-3xl">
                {[
                    { label: 'Tests Attempted', value: 12 },
                    { label: 'Average Score', value: '84%' },
                    { label: 'Global Rank', value: '#248' },
                ].map((stat, i) => (
                    <div key={i} className="glass-card p-6 rounded-xl text-center">
                        <h3 className="text-2xl font-bold text-orange-400">{stat.value}</h3>
                        <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Recent Tests */}
            <div className="glass-card mt-8 w-full max-w-3xl p-6 rounded-2xl">
                <h3 className="text-xl font-semibold mb-4">Recent Exams</h3>
                <ul className="divide-y divide-white/10">
                    {[
                        { name: 'AWS Solutions Architect', score: 92, date: 'Oct 2025' },
                        { name: 'CompTIA Security+', score: 78, date: 'Sep 2025' },
                        { name: 'Kubernetes CKA', score: 85, date: 'Aug 2025' },
                    ].map((exam, i) => (
                        <li key={i} className="flex justify-between py-3 text-sm">
                            <div>
                                <p className="font-medium">{exam.name}</p>
                                <p className="text-gray-500 text-xs">{exam.date}</p>
                            </div>
                            <span className="text-orange-400 font-semibold">{exam.score}%</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Settings + Logout */}
            <div className="glass-card mt-8 w-full max-w-3xl p-6 rounded-2xl">
                <h3 className="text-xl font-semibold mb-4">Account Settings</h3>

                <div className="flex flex-col gap-3 text-sm">
                    <button className="flex justify-between bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg transition-all">
                        <span>Change Password</span>
                        <span className="text-gray-400">→</span>
                    </button>

                    <button className="flex justify-between bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg transition-all">
                        <span>Upgrade to Pro</span>
                        <span className="text-orange-400">⭐</span>
                    </button>

                    <button
                        onClick={() => signOut({ callbackUrl: '/auth' })}
                        className="flex justify-between bg-red-500/10 hover:bg-red-500/20 px-4 py-2 rounded-lg text-red-400 font-semibold transition-all"
                    >
                        <span>Sign Out</span>
                        <span>↩</span>
                    </button>
                </div>
            </div>
        </div>
    );
};