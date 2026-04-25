import React from 'react';
import { Layout, Users } from 'lucide-react';

export default function Sidebar({ view, setView }) {
  return (
    <aside className="w-64 border-r border-gray-200/60 flex flex-col bg-[#F8FAFC] z-10 shrink-0">
      <div className="p-6 flex items-center gap-3">
        <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-[12px] tracking-wider shadow-sm">
          RDI
        </div>
        <span className="font-bold tracking-tight text-lg text-slate-800">Recruiter</span>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-1.5">
        <button 
          onClick={() => setView('pipeline')} 
          className={`w-full flex items-center px-4 py-3 rounded-full font-semibold text-sm transition-all ${view === 'pipeline' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-slate-500 hover:bg-slate-200/50'}`}
        >
          <Layout className="h-4 w-4 mr-3" /> Active Pipeline
        </button>
        <button 
          onClick={() => setView('talent-pool')} 
          className={`w-full flex items-center px-4 py-3 rounded-full font-semibold text-sm transition-all ${view === 'talent-pool' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-slate-500 hover:bg-slate-200/50'}`}
        >
          <Users className="h-4 w-4 mr-3" /> Talent Pool
        </button>
      </nav>
    </aside>
  );
}