import React from 'react';
import { History, FolderOpen, Trash2, Calendar, Sparkles, Plus } from 'lucide-react';
import { Language, Project } from '../types';
import { getT } from '../utils/i18n';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onLoadProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onNewProject: () => void;
  language: Language;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  projects,
  onLoadProject,
  onDeleteProject,
  onNewProject,
  language,
}) => {
  if (!isOpen) return null;

  const t = getT(language);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white tracking-tight">
                {t.historyTitle}
              </h2>
              <p className="text-xs text-slate-400">
                {projects.length} {language === 'fr' ? 'projet(s) sauvegardé(s)' : 'saved project(s)'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label={language === 'fr' ? 'Fermer' : 'Close'}
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        {/* Project List */}
        <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar pr-1">
          {projects.length === 0 ? (
            <div className="p-8 text-center space-y-3 bg-slate-950/50 rounded-2xl border border-slate-800">
              <p className="text-xs text-slate-400">{t.noHistory}</p>
              <button
                onClick={() => {
                  onClose();
                  onNewProject();
                }}
                className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{t.newProject}</span>
              </button>
            </div>
          ) : (
            projects.map((proj) => (
              <div
                key={proj.id}
                className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between gap-3 group"
              >
                <div
                  onClick={() => {
                    onLoadProject(proj);
                    onClose();
                  }}
                  className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 overflow-hidden flex-shrink-0 flex items-center justify-center p-1">
                    <img
                      src={proj.product.studioImage || proj.product.originalImage}
                      alt={proj.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-200 truncate group-hover:text-amber-400 transition">
                      {proj.title}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {new Date(proj.createdAt).toLocaleDateString(
                          language === 'fr' ? 'fr-FR' : 'en-US',
                          { day: 'numeric', month: 'short' }
                        )}
                      </span>
                      <span>&bull;</span>
                      <span>{proj.scenes.length} visuels</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      onLoadProject(proj);
                      onClose();
                    }}
                    className="p-2 rounded-lg bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-300 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                    title={t.openProject}
                  >
                    <FolderOpen className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteProject(proj.id)}
                    className="p-2 rounded-lg bg-slate-900 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition cursor-pointer"
                    title={t.deleteProject}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Bar */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-800">
          <button
            onClick={() => {
              onClose();
              onNewProject();
            }}
            className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>{t.newProject}</span>
          </button>
          <button
            onClick={onClose}
            className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
