import React from 'react';
import { Users, BookOpen, Mic, Award } from 'lucide-react';

export default function MetricsRow({ totalCandidates, shortlisted, activeInterviews, hired }) {
  const Card = ({ title, value, icon: Icon }) => (
    <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-semibold text-slate-600">{title}</span>
        <Icon className="h-5 w-5 text-slate-400" strokeWidth={2.5} />
      </div>
      <div className="flex items-end justify-between">
        <span className="text-4xl font-black text-blue-600 tracking-tight">{value}</span>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 shrink-0">
      <Card title="Total Candidates" value={totalCandidates} icon={Users} />
      <Card title="Shortlisted" value={shortlisted} icon={BookOpen} />
      <Card title="Interviews" value={activeInterviews} icon={Mic} />
      <Card title="Hired" value={hired} icon={Award} />
    </div>
  );
}