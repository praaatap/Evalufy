import React from 'react';
import { signOut, useSession } from 'next-auth/react';
import { Icons } from '../icons';

interface HeaderProps {
    searchTerm: string;
    setSearchTerm: (t: string) => void;
    toggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ searchTerm, setSearchTerm, toggleSidebar }) => {
    const { data: session } = useSession();
    
    return (
        <header className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
                <button onClick={toggleSidebar} className="md:hidden p-2 bg-white/5 rounded-lg text-white">
                    <Icons.Menu />
                </button>
                <input
                    type="text"
                    placeholder="Search for an exam..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all w-72"
                />
            </div>
            {session && (
                <div className="flex items-center gap-3 bg-white/5 px-3 py-2 rounded-xl border border-white/10">
                    <img src={session.user?.image || '/user.png'} alt="avatar" className="h-8 w-8 rounded-full" />
                    <span className="text-sm text-gray-300">{session.user?.name}</span>
                    <button onClick={() => signOut({ callbackUrl: '/auth' })} className="text-xs text-orange-400 hover:underline ml-2">Logout</button>
                </div>
            )}
        </header>
    );
};