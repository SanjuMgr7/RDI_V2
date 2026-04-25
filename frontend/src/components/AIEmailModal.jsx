import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Sparkles, RefreshCw, Calendar } from 'lucide-react';

export default function AiEmailModal({ isOpen, onClose, profile }) {
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTone, setActiveTone] = useState('professional');

  useEffect(() => {
    if (isOpen && profile) {
      generateDraft('professional');
    }
  }, [isOpen, profile]);

  const generateDraft = async (tone) => {
    setIsGenerating(true);
    setActiveTone(tone);
    try {
      const res = await axios.post('http://localhost:5000/api/ai/draft-email', {
        candidateName: profile.student?.name,
        jobTitle: profile.listingTitle,
        tone: tone,
        skills: profile.student?.skills || []
      });
      
      setEmailSubject(res.data.subject);
      setEmailBody(res.data.body);
    } catch (error) {
      setEmailSubject("Error");
      setEmailBody("Error generating draft. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOpenCalendar = () => {
    const subject = encodeURIComponent(emailSubject);
    const details = encodeURIComponent(emailBody);
    const gcalLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${subject}&details=${details}&add=${profile.student?.email}`;
    window.open(gcalLink, '_blank');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-100 flex flex-col">
        
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">AI Interview Drafter</h3>
              <p className="text-[11px] font-medium text-slate-500">Personalized invite for {profile?.student?.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"><X className="h-5 w-5" /></button>
        </div>

        <div className="p-6 bg-slate-50 flex-1">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Style:</span>
            {['professional', 'casual', 'short'].map(tone => (
              <button 
                key={tone}
                onClick={() => generateDraft(tone)}
                disabled={isGenerating}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${activeTone === tone ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300'}`}
              >
                {tone}
              </button>
            ))}
          </div>

          <div className="relative space-y-4">
            {isGenerating && (
              <div className="absolute inset-0 bg-white/70 backdrop-blur-sm rounded-xl z-10 flex items-center justify-center border border-slate-200">
                <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm">
                  <RefreshCw className="h-4 w-4 animate-spin" /> Personalizing your message...
                </div>
              </div>
            )}
            
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 ml-1">Email Subject</label>
              <input 
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 shadow-sm outline-none"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 ml-1">Message</label>
              <textarea 
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                className="w-full h-64 p-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none shadow-sm leading-relaxed outline-none"
              />
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-white flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors">Cancel</button>
          <button onClick={handleOpenCalendar} disabled={isGenerating} className="px-5 py-2.5 rounded-xl text-sm font-bold bg-slate-900 text-white hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-sm">
            <Calendar className="h-4 w-4" /> Continue to Calendar
          </button>
        </div>

      </div>
    </div>
  );
}