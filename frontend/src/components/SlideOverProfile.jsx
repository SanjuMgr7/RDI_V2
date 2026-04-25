import React from 'react';
import { Mail, Phone, Linkedin, Github, X, Sparkles } from 'lucide-react';
import DomainBadge from './DomainBadge';

export default function SlideOverProfile({ profile, onClose, onOpenAiModal }) {
  if (!profile) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-[0_0_40px_rgba(0,0,0,0.1)] border-l border-gray-200 flex flex-col z-[100]">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
        <h2 className="font-bold text-gray-900 tracking-tight">Candidate Profile</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-black transition-colors"><X className="h-5 w-5" /></button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 bg-[#FAFAFA]">
        <div className="flex flex-col items-center mb-8">
          <div className="h-24 w-24 rounded-full bg-white text-gray-900 flex items-center justify-center text-3xl font-black border border-gray-200 shadow-sm mb-4">
            {profile.student?.name.split(' ').map(n => n[0]).join('')}
          </div>
          <h3 className="text-xl font-bold text-gray-900 tracking-tight">{profile.student?.name}</h3>
          <p className="text-sm text-gray-500 font-medium mb-3">{profile.listingTitle}</p>
          <DomainBadge domain={profile.student?.domain} />
        </div>

        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4">Contact Details</h4>
            <div className="space-y-3">
              <a href={`mailto:${profile.student?.email}`} className="flex items-center gap-3 text-sm text-gray-600 hover:text-black transition-colors"><Mail className="h-4 w-4 text-gray-400"/> {profile.student?.email}</a>
              {profile.student?.phone && <a href={`tel:${profile.student?.phone}`} className="flex items-center gap-3 text-sm text-gray-600 hover:text-black transition-colors"><Phone className="h-4 w-4 text-gray-400"/> {profile.student?.phone}</a>}
              {profile.student?.linkedin && <a href={`https://${profile.student?.linkedin}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-gray-600 hover:text-black transition-colors"><Linkedin className="h-4 w-4 text-gray-400"/> {profile.student?.linkedin}</a>}
              {profile.student?.github && <a href={`https://${profile.student?.github}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-gray-600 hover:text-black transition-colors"><Github className="h-4 w-4 text-gray-400"/> {profile.student?.github}</a>}
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4">Technical Skills</h4>
            <div className="flex flex-wrap gap-2">
              {profile.student?.skills?.map(skill => (
                <span key={skill} className="text-xs font-semibold px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md uppercase tracking-wide">{skill}</span>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 p-5 rounded-xl shadow-sm text-white">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Current Status</h4>
            <span className="text-sm font-bold tracking-wide uppercase text-white">{profile.status}</span>
            <p className="text-xs text-slate-400 mt-1">Applied for {profile.listingTitle}</p>
          </div>
        </div>
      </div>
      
      <div className="p-5 border-t border-gray-200 bg-white">
        <button 
          onClick={onOpenAiModal}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold text-sm py-3.5 rounded-xl hover:bg-blue-700 transition-colors shadow-sm group"
        >
          <Sparkles className="h-4 w-4 text-blue-200 group-hover:text-white transition-colors" />
          Schedule Meeting
        </button>
      </div>
    </div>
  );
}