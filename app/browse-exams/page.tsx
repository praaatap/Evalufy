'use client'
import React, { useState, useMemo } from 'react';

// --- 1. Centralized Types & Constants ---
// It's better to define these at the top so they are easy to find and manage.

type ExamCategory = 'Cloud' | 'Security' | 'DevOps' | 'Custom';

type Exam = {
    title: string;
    questions: number;
    duration: string;
    slug: string;
    category: ExamCategory;
};

// Using a constant object for view names prevents typos and makes the code clearer.
const VIEWS = {
  BROWSE: 'browse',
  CREATE: 'create', // New view for creating a test
  RESULTS: 'results',
  PROFILE: 'profile',
} as const;

type View = typeof VIEWS[keyof typeof VIEWS];

// --- Dummy Icons ---
// In a real app, you might use an icon library like 'react-icons'.
const HomeIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

// New icon for the "Create Test" tab
const CreateIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const UploadIcon: React.FC = () => (
    <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
    </svg>
);


// --- 2. Static Data ---
// Defining data and constants outside the components prevents them from being
// recreated on every render, which is more performant.

const NAV_ITEMS = [
    { name: 'Browse Exams', icon: <HomeIcon />, view: VIEWS.BROWSE },
    { name: 'Create Test', icon: <CreateIcon />, view: VIEWS.CREATE }, // New Nav Item
    { name: 'My Results', icon: <HomeIcon />, view: VIEWS.RESULTS },
    { name: 'Profile', icon: <HomeIcon />, view: VIEWS.PROFILE },
];

const EXAM_DATA: Exam[] = [
    { title: 'AWS Certified Solutions Architect - Associate', questions: 65, duration: '130 mins', slug: 'aws-saa', category: 'Cloud' },
    { title: 'CompTIA Security+', questions: 90, duration: '90 mins', slug: 'comptia-sec', category: 'Security' },
    { title: 'Certified Kubernetes Administrator (CKA)', questions: 20, duration: '120 mins', slug: 'cka', category: 'DevOps' },
    { title: 'AWS Certified Cloud Practitioner', questions: 65, duration: '90 mins', slug: 'aws-ccp', category: 'Cloud' },
    { title: 'Certified Information Systems Security Professional (CISSP)', questions: 150, duration: '180 mins', slug: 'cissp', category: 'Security' },
    { title: 'Terraform Associate', questions: 45, duration: '60 mins', slug: 'terraform', category: 'DevOps' },
];

const CATEGORIES: ('All' | ExamCategory)[] = ['All', 'Cloud', 'Security', 'DevOps', 'Custom'];


// --- 3. Reusable Components ---

const Sidebar: React.FC<{ activeView: View; setActiveView: (view: View) => void; isSidebarOpen: boolean }> = ({ activeView, setActiveView, isSidebarOpen }) => {
    return (
        <aside className={`glass-card p-6 rounded-3xl flex-shrink-0 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-24'}`}>
            <h1 className={`text-2xl font-bold text-white mb-10 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                Exam<span className="gradient-text">Prep</span>
            </h1>
            <nav>
                <ul>
                    {NAV_ITEMS.map(item => (
                        <li key={item.name}>
                            <button
                                onClick={() => setActiveView(item.view)}
                                className={`w-full flex items-center p-3 my-2 rounded-xl font-semibold transition-all ${activeView === item.view ? 'bg-orange-500/20 text-orange-400' : 'text-gray-400 hover:bg-white/10 hover:text-white'} ${!isSidebarOpen && 'justify-center'} cursor-pointer `}>
                                {item.icon}
                                <span className={`ml-4 transition-all duration-300 ${isSidebarOpen ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0 overflow-hidden'}`}>{item.name}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

const Header: React.FC<{ searchTerm: string; setSearchTerm: (term: string) => void; toggleSidebar: () => void; }> = ({ searchTerm, setSearchTerm, toggleSidebar }) => (
    <header className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="flex items-center w-full md:w-auto">
            <button onClick={toggleSidebar} className="p-2 mr-4 rounded-lg bg-white/5 text-white md:hidden">
                <HomeIcon />
            </button>
            <div className="relative w-full md:w-auto md:min-w-[300px] lg:min-w-[400px]">
                <input
                    type="text"
                    placeholder="Search for an exam..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                />
            </div>
        </div>
    </header>
);

const ExamCard: React.FC<{ exam: Exam }> = ({ exam }) => (
    <div className="glass-card p-6 rounded-3xl flex-shrink-0 w-full flex flex-col justify-between hover:scale-105 transition-transform duration-300 border border-transparent hover:border-orange-500/50 cursor-pointer ">
        <span className="text-sm font-semibold bg-orange-500/20 text-orange-400 py-1 px-3 rounded-full self-start">{exam.category}</span>
        <h3 className="text-xl font-bold text-white my-3">{exam.title}</h3>
        <div className="flex items-center text-gray-400 text-sm space-x-4">
            <span>{exam.questions} Questions</span>
            <span>{exam.duration}</span>
        </div>
        <button className="start-btn mt-6 py-3 px-6 w-full rounded-xl font-bold text-white hover:scale-105 transition-transform flex justify-center">
            Start Exam
        </button>
    </div>
);

const BrowseExamsView: React.FC<{ searchTerm: string }> = ({ searchTerm }) => {
    const [activeCategory, setActiveCategory] = useState<(typeof CATEGORIES)[number]>('All');

    const filteredExams = useMemo(() => {
        return EXAM_DATA.filter(exam => {
            const matchesCategory = activeCategory === 'All' || exam.category === activeCategory;
            const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [searchTerm, activeCategory]);

    return (
        <div className="flex flex-col h-full">
            <h2 className="text-3xl font-extrabold text-white mb-4">Browse Exams</h2>
            <div className="flex flex-wrap gap-2 mb-6">
                {CATEGORIES.map(category => (
                    <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`py-2 px-4 rounded-full font-semibold text-sm transition-all ${activeCategory === category ? 'bg-orange-500 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
                    >
                        {category}
                    </button>
                ))}
            </div>
            {filteredExams.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredExams.map(exam => (
                        <ExamCard key={exam.slug} exam={exam} />
                    ))}
                </div>
            ) : (
                <p className="text-gray-400">No exams found matching your criteria.</p>
            )}
        </div>
    );
};

// --- New Component for Creating a Test ---
const CreateTestView: React.FC = () => {
    const [fileName, setFileName] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFileName(event.target.files[0].name);
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Here you would handle the form submission, e.g., send data to an API
        console.log("Generating test with the provided data...");
        // You can add a loading state and success/error messages here
    };

    return (
        <div className="flex flex-col h-full">
            <h2 className="text-3xl font-extrabold text-white mb-6">Create a Custom Test</h2>
            <p className="text-gray-400 mb-8 max-w-3xl">
                Generate a personalized practice exam by providing your own study materials. Upload a PDF, add relevant topics, and link to external sources.
            </p>

            <form onSubmit={handleSubmit} className="glass-card p-8 rounded-3xl w-full flex flex-col gap-6">
                <div>
                    <label htmlFor="testTitle" className="block text-sm font-medium text-gray-300 mb-2">Test Title</label>
                    <input type="text" id="testTitle" placeholder="e.g., Final Year Cloud Computing Exam" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all" />
                </div>

                <div>
                    <label htmlFor="topics" className="block text-sm font-medium text-gray-300 mb-2">Topics</label>
                    <input type="text" id="topics" placeholder="Enter topics separated by commas (e.g., AWS S3, VPC, IAM)" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all" />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Upload Study Material (PDF)</label>
                    <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer bg-white/5 hover:bg-white/10 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <UploadIcon />
                            {fileName ? (
                                <p className="text-sm text-green-400"><span className="font-semibold">File selected:</span> {fileName}</p>
                            ) : (
                                <>
                                    <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-gray-500">PDF only (MAX. 10MB)</p>
                                </>
                            )}
                        </div>
                        <input id="file-upload" type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
                    </label>
                </div>

                <div>
                    <label htmlFor="sources" className="block text-sm font-medium text-gray-300 mb-2">Additional Sources</label>
                    <textarea id="sources" rows={4} placeholder="Add links to websites, articles, or other resources..." className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"></textarea>
                </div>

                <button type="submit" className="start-btn mt-4 py-3 px-6 w-full max-w-xs mx-auto rounded-xl font-bold text-white hover:scale-105 transition-transform flex justify-center">
                    Generate Test
                </button>
            </form>
        </div>
    );
};


const PlaceholderView: React.FC<{ title: string }> = ({ title }) => (
    <div className="flex items-center justify-center h-full">
        <h2 className="text-3xl font-bold text-white capitalize">{title}</h2>
    </div>
);


// --- 4. Main Page Component ---
export default function DashboardPage() {
    const [activeView, setActiveView] = useState<View>(VIEWS.BROWSE);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const renderContent = () => {
        switch (activeView) {
            case VIEWS.BROWSE:
                return <BrowseExamsView searchTerm={searchTerm} />;
            case VIEWS.CREATE:
                return <CreateTestView />; // Render the new component
            case VIEWS.RESULTS:
                return <PlaceholderView title="My Results" />;
            case VIEWS.PROFILE:
                return <PlaceholderView title="My Profile" />;
            default:
                return <BrowseExamsView searchTerm={searchTerm} />;
        }
    };

    return (
        <div className="flex min-h-screen gap-6 p-4 w-full h-screen overflow-hidden">
            <Sidebar activeView={activeView} setActiveView={setActiveView} isSidebarOpen={isSidebarOpen} />
            
            <main className="flex-1 w-[75%] flex flex-col h-full">
                <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
                <div className="flex-1 overflow-y-auto pr-2">{renderContent()}</div>
            </main>

            {/* For a real project, this style block should be in a global CSS file like 'globals.css' */}
            <style jsx global>{`
                body { background-color: #0a0a0a; color: #e5e7eb; font-family: 'Inter', sans-serif; overflow: hidden; }
                .glass-card { background-color: rgba(20, 20, 20, 0.5); border: 1px solid rgba(255, 255, 255, 0.1); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
                .start-btn { background: linear-gradient(90deg, #f9973e, #f76b1c); }
                .gradient-text { background: linear-gradient(90deg, #f9973e, #f76b1c); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
            `}</style>
        </div>
    );
}
