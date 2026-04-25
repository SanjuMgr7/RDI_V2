import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { MoreVertical } from 'lucide-react';
import DomainBadge from './DomainBadge';

const STAGES = ['Applied', 'Shortlisted', 'Interview', 'Hired'];

export default function PipelineBoard({ displayedApps, onDragEnd, setSelectedProfile, handleTagClick }) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-6 overflow-x-auto pb-4 h-full items-start scrollbar-hide">
        {STAGES.map((stage) => (
          <div key={stage} className="flex-1 min-w-[320px] max-w-[320px] flex flex-col h-full">
            <div className="flex items-center gap-2 mb-4 px-1">
              <h3 className="font-bold text-sm text-slate-800">{stage}</h3>
              <span className="text-xs font-bold text-slate-400">({displayedApps.filter(a => a.status === stage).length})</span>
            </div>
            
            <Droppable droppableId={stage}>
              {(provided, snapshot) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className={`flex-1 overflow-y-auto rounded-2xl transition-colors ${snapshot.isDraggingOver ? 'bg-slate-200/50' : 'bg-transparent'}`}>
                  {displayedApps.filter((app) => app.status === stage).map((app, index) => (
                    <Draggable key={app.id} draggableId={app.id} index={index}>
                      {(provided, snapshot) => (
                        <div 
                          ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} 
                          onClick={() => setSelectedProfile(app)}
                          className={`bg-white p-5 rounded-3xl border border-slate-100 mb-4 shadow-sm hover:shadow-md transition-all group cursor-pointer ${snapshot.isDragging ? 'shadow-xl scale-105 z-50 ring-2 ring-blue-500' : ''}`}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold">
                                {app.student?.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <h4 className="font-bold text-[15px] text-slate-900">{app.student?.name}</h4>
                                <div className="text-xs text-slate-400 font-medium">{app.listingTitle}</div>
                              </div>
                            </div>
                            <MoreVertical className="h-5 w-5 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex flex-wrap gap-1.5">
                              {app.student?.skills?.slice(0, 2).map(skill => (
                                <span key={skill} onClick={(e) => handleTagClick(e, skill)} className="text-[10px] font-semibold px-2 py-1 bg-slate-100 hover:bg-slate-200 cursor-pointer text-slate-600 rounded-lg transition-colors">{skill}</span>
                              ))}
                            </div>
                            <DomainBadge domain={app.student?.domain} />
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}