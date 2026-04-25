import React from 'react';
import { Phone, Mail, CheckSquare, Square, ChevronUp, ChevronDown } from 'lucide-react';
import DomainBadge from './DomainBadge';

export default function TalentPoolTable({ sortedApps, selectedCandidates, toggleAll, toggleCandidate, requestSort, sortConfig, handleBulkEmail, setSelectedProfile, handleTagClick }) {
  return (
    // Changed rounded-3xl to rounded-lg
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {/* BULK ACTION BAR */}
      {selectedCandidates.length > 0 && (
        <div className="bg-blue-50 px-6 py-4 border-b border-blue-100 flex items-center justify-between">
          <span className="text-sm font-bold text-blue-700">{selectedCandidates.length} Candidates Selected</span>
          {/* Buttons changed to rounded-md */}
          <button onClick={handleBulkEmail} className="text-xs font-bold bg-white text-blue-600 px-3 py-1.5 rounded-md border border-blue-200 hover:bg-blue-600 hover:text-white transition-colors shadow-sm">
            Bulk Email
          </button>
        </div>
      )}
      
      <div className="overflow-auto flex-1">
        <table className="min-w-full divide-y divide-slate-100 relative">
          <thead className="bg-slate-50/90 sticky top-0 backdrop-blur-sm z-10">
            <tr>
              <th className="px-6 py-4 w-10">
                <button onClick={toggleAll} className="text-slate-400 hover:text-slate-700">
                  {selectedCandidates.length === sortedApps.length && sortedApps.length > 0 ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                </button>
              </th>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('name')}>
                <div className="flex items-center gap-1">Candidate {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? <ChevronUp className="h-3 w-3"/> : <ChevronDown className="h-3 w-3"/>)}</div>
              </th>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('domain')}>
                Domain
              </th>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Top Skills</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('role')}>
                Target Role
              </th>
              <th className="px-6 py-4 text-right text-[11px] font-bold text-slate-500 uppercase tracking-wider">Contact</th>
            </tr>
          </thead>
          
          <tbody className="bg-white divide-y divide-slate-50">
            {sortedApps.map((app) => (
              <tr key={app.id} onClick={() => setSelectedProfile(app)} className="hover:bg-slate-50/80 transition-colors cursor-pointer group">
                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => toggleCandidate(app.id)} className={`${selectedCandidates.includes(app.id) ? 'text-blue-600' : 'text-slate-300'}`}>
                    {selectedCandidates.includes(app.id) ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                  </button>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    {/* Changed Avatar to rounded-lg for a modern look */}
                    <div className="h-9 w-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center text-xs font-bold border border-blue-100">
                      {app.student?.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-bold text-[14px] text-slate-900 group-hover:text-blue-600 transition-colors">{app.student?.name}</div>
                      <div className="text-[12px] text-slate-400 font-medium">Sem {app.student?.semester}</div>
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap"><DomainBadge domain={app.student?.domain} /></td>
                
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1.5 max-w-xs">
                    {app.student?.skills?.slice(0, 3).map(skill => (
                      // Changed skills to rounded-md
                      <span key={skill} onClick={(e) => handleTagClick(e, skill)} className="text-[10px] font-semibold px-2 py-1 bg-slate-100 text-slate-600 rounded-md uppercase">
                        {skill}
                      </span>
                    ))}
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-[13px] font-medium text-slate-700">{app.listingTitle}</div>
                  <div className="text-[10px] font-bold text-blue-500 uppercase mt-0.5">{app.status}</div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex flex-col items-end justify-center gap-1">
                    <a href={`mailto:${app.student?.email}`} className="text-[12px] font-medium text-slate-500 hover:text-blue-600">{app.student?.email}</a>
                    <div className="text-[11px] text-slate-400">{app.student?.phone || 'No phone'}</div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}