import React from 'react';
import { signOut, useSession } from 'next-auth/react';
import { View } from '../types';
import { Icons } from './icons';

const NAV_ITEMS = [
    { name: 'Browse Exams', icon: <Icons.Home />, view: 'browse' as View },
    { name: 'Create Test', icon: <Icons.Add />, view: 'create' as View },
    { name: 'My Results', icon: <Icons.Home />, view: 'results' as View },
    { name: 'Profile', icon: <Icons.Home />, view: 'profile' as View }
];

interface SidebarProps {
    activeView: View;
    setActiveView: (v: View) => void;
    isOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isOpen }) => {
    const { data: session } = useSession();

    return (
        <aside className={`glass-card p-6 rounded-2xl transition-all duration-300 ${isOpen ? 'w-56' : 'w-20'}`}>
            <h1 className={`text-xl font-bold text-white mb-8 ${isOpen ? 'block' : 'hidden'}`}>
                Evalufy<span className="gradient-text">AI</span>
            </h1>
            <nav className="flex flex-col gap-2">
                {NAV_ITEMS.map((item) => (
                    <button
                        key={item.name}
                        onClick={() => setActiveView(item.view)}
                        className={`flex items-center gap-3 w-full p-3 rounded-lg text-sm font-semibold transition-all
                        ${activeView === item.view 
                            ? 'bg-orange-500/20 text-orange-400' 
                            : 'text-gray-400 hover:bg-white/10 hover:text-white'
                        }`}
                    >
                        {item.icon}
                        {isOpen && <span>{item.name}</span>}
                    </button>
                ))}

                {isOpen && session && (
                    <button
                        onClick={() => signOut({ callbackUrl: '/auth' })}
                        className="flex items-center gap-3 w-full p-3 mt-auto rounded-lg text-sm font-semibold text-red-400 hover:bg-red-500/10"
                    >
                        <span>Sign Out</span>
                    </button>
                )}
            </nav>
        </aside>
    );
};