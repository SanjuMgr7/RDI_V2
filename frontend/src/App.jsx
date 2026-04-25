import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, X } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

import Sidebar from './components/Sidebar';
import MetricsRow from './components/MetricsRow';
import PipelineBoard from './components/PipelineBoard';
import TalentPoolTable from './components/TalentPoolTable';
import SlideOverProfile from './components/SlideOverProfile';
import AiEmailModal from './components/AiEmailModal';

export default function App() {
  const [allApps, setAllApps] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState("pipeline");
  const [selectedProfile, setSelectedProfile] = useState(null); 
  const [selectedCandidates, setSelectedCandidates] = useState([]); 
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/applications');
      setAllApps(res.data);
    } catch (err) { toast.error("Failed to connect to database"); }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) return;

    const draggedApp = allApps.find(a => a.id === draggableId);
    const updatedApps = allApps.map(app => app.id === draggableId ? { ...app, status: destination.droppableId } : app);
    setAllApps(updatedApps);

    if (destination.droppableId === 'Hired') {
      toast.success(`🎉 ${draggedApp.student?.name} has been Hired!`, { duration: 4000, iconTheme: { primary: '#10B981', secondary: '#fff' }});
    } else {
      toast.success(`Moved ${draggedApp.student?.name} to ${destination.droppableId}`);
    }

    try { await axios.patch(`http://localhost:5000/api/applications/${draggableId}`, { status: destination.droppableId }); } 
    catch (error) { fetchData(); toast.error("Database sync failed. Reverting."); }
  };

  const displayedApps = allApps.filter(app => {
    const query = searchQuery.toLowerCase();
    return app.student?.name.toLowerCase().includes(query) || 
           app.listingTitle.toLowerCase().includes(query) || 
           app.student?.skills?.some(skill => skill.toLowerCase().includes(query));
  });

  const sortedApps = [...displayedApps].sort((a, b) => {
    if (!sortConfig.key) return 0;
    let aValue = sortConfig.key === 'name' ? a.student.name : sortConfig.key === 'role' ? a.listingTitle : a.student.domain;
    let bValue = sortConfig.key === 'name' ? b.student.name : sortConfig.key === 'role' ? b.listingTitle : b.student.domain;
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const toggleCandidate = (id) => setSelectedCandidates(prev => prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]);
  const toggleAll = () => setSelectedCandidates(selectedCandidates.length === sortedApps.length ? [] : sortedApps.map(a => a.id));

  const handleBulkEmail = () => {
    const selectedEmails = allApps.filter(app => selectedCandidates.includes(app.id)).map(app => app.student?.email).filter(Boolean).join(',');
    window.location.href = `mailto:?bcc=${selectedEmails}&subject=${encodeURIComponent("Update regarding your application with RDI")}`;
    toast.success(`Drafting email to ${selectedCandidates.length} candidates!`, { icon: '✉️' });
  };

  const handleTagClick = (e, skill) => {
    e.stopPropagation(); 
    setSearchQuery(skill);
    toast(`Filtering by ${skill}`, { icon: '🔍' });
  };

  const metrics = {
    totalCandidates: allApps.length,
    shortlisted: allApps.filter(a => a.status === 'Shortlisted').length,
    activeInterviews: allApps.filter(a => a.status === 'Interview').length,
    hired: allApps.filter(a => a.status === 'Hired').length
  };

  return (
    <div className="flex h-screen bg-[#F4F7FA] font-sans text-slate-900 overflow-hidden">
      <Toaster position="bottom-right" />
      <Sidebar view={view} setView={setView} />

      <div className="flex-1 flex flex-col overflow-auto min-w-0 relative">
        <main className="p-6 md:p-8 flex-1 flex flex-col max-w-[1600px] mx-auto w-full">
          
          <div className="bg-blue-600 rounded-[2rem] py-6 px-8 md:py-8 md:px-10 text-white mb-8 shadow-md relative overflow-hidden shrink-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex-1 w-full">
                <h1 className="text-2xl md:text-3xl font-medium tracking-tight mb-2">
                  Welcome back. Today's a hiring day.
                </h1>
                <p className="text-blue-100/90 text-sm max-w-md font-medium">
                  Review active applications, manage interviews, and organize your talent pipeline.
                </p>
              </div>

              <div className="w-full md:w-auto md:min-w-[400px]">
                <div className="relative w-full">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input 
                    type="text" placeholder="Search Candidates, Skills..." value={searchQuery}
                    className="pl-14 pr-4 py-3.5 w-full bg-white border border-transparent rounded-2xl text-base text-slate-900 placeholder-slate-400 shadow-lg focus:outline-none focus:ring-4 focus:ring-white/40 transition-all"
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && <X className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 cursor-pointer hover:text-slate-800" onClick={() => setSearchQuery('')} />}
                </div>
              </div>
            </div>
          </div>

          <MetricsRow {...metrics} />

          {view === 'pipeline' && (
            <PipelineBoard 
              displayedApps={displayedApps} 
              onDragEnd={onDragEnd} 
              setSelectedProfile={setSelectedProfile} 
              handleTagClick={handleTagClick} 
            />
          )}

          {view === 'talent-pool' && (
            <TalentPoolTable 
              sortedApps={sortedApps} 
              selectedCandidates={selectedCandidates} 
              toggleAll={toggleAll} 
              toggleCandidate={toggleCandidate} 
              requestSort={requestSort} 
              sortConfig={sortConfig} 
              handleBulkEmail={handleBulkEmail} 
              setSelectedProfile={setSelectedProfile} 
              handleTagClick={handleTagClick} 
            />
          )}
        </main>

        <SlideOverProfile 
          profile={selectedProfile} 
          onClose={() => setSelectedProfile(null)} 
          onOpenAiModal={() => setIsAiModalOpen(true)}
        />

        <AiEmailModal 
          isOpen={isAiModalOpen} 
          onClose={() => setIsAiModalOpen(false)} 
          profile={selectedProfile} 
        />
      </div>
    </div>
  );
}