'use client';

import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BrowseExamsView } from './components/BrowseExamsView';
import { ProfileView } from './components/ProfileView';
import { CreateTest } from './components/CreateTest';
import { VIEWS, View } from './types';

/* ---------- MAIN DASHBOARD ---------- */
export default function DashboardPage() {
  const [activeView, setActiveView] = useState<View>(VIEWS.BROWSE);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const renderView = () => {
    switch (activeView) {
      case VIEWS.BROWSE:
        return <BrowseExamsView searchTerm={searchTerm} />;
      case VIEWS.PROFILE:
        return <ProfileView />;
      case VIEWS.CREATE:
        return <CreateTest />;
      default:
        return <div className="text-gray-400 text-center py-20">Coming Soon...</div>;
    }
  };

  return (
    <div className="flex h-screen gap-4 p-4 overflow-hidden">
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        isOpen={isSidebarOpen} 
      />
      <main className="flex-1 flex flex-col overflow-y-auto pr-2">
        {activeView === VIEWS.BROWSE && (
          <Header 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
            toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} 
          />
        )}
        {renderView()}
      </main>

      {/* ✅ Global styles for dotted background + glass + gradients */}
      <style jsx global>{`
        body {
          font-family: 'Inter', sans-serif;
          background: #0a0a0a radial-gradient(circle at 1px 1px, #2a2a2a 1px, transparent 0);
          background-size: 2rem 2rem;
          color: #e5e7eb;
        }
        .glass-card {
          background: rgba(20, 20, 20, 0.6);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(10px);
        }
        .start-btn {
          background: linear-gradient(90deg, #f9973e, #f76b1c);
          color: white;
          transition: all 0.3s;
        }
        .start-btn:hover { transform: scale(1.03); }
        .gradient-text {
          background: linear-gradient(90deg, #f9973e, #f76b1c);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </div>
  );
}
