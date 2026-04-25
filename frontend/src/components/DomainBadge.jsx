import React from 'react';
import { ShieldAlert, Cpu, Code2 } from 'lucide-react';

export default function DomainBadge({ domain }) {
  const baseClasses = "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border transition-colors shadow-sm";
  
  switch(domain) {
    case 'IoT': 
      return <span className={`${baseClasses} bg-slate-50 border-slate-200 text-slate-700`}><Cpu className="h-3 w-3 text-slate-400"/> {domain}</span>;
    case 'Software': 
      return <span className={`${baseClasses} bg-zinc-50 border-zinc-200 text-zinc-700`}><Code2 className="h-3 w-3 text-zinc-400"/> {domain}</span>;
    case 'Cybersecurity': 
      return <span className={`${baseClasses} bg-gray-50 border-gray-300 text-gray-800`}><ShieldAlert className="h-3 w-3 text-gray-500"/> Cyber</span>;
    default: 
      return <span className={`${baseClasses} bg-white border-slate-100 text-slate-500`}>{domain}</span>;
  }
}