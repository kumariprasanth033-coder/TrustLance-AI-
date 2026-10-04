import React, { useState } from 'react';
import { Search, X, Users, Briefcase, Layers, Lock, Scale, ArrowRight } from 'lucide-react';
import { adminApi } from '../../services/api';

interface AdminQuickSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEntity: (tab: string, entityId: any) => void;
}

export const AdminQuickSearch: React.FC<AdminQuickSearchProps> = ({
  isOpen,
  onClose,
  onSelectEntity
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async (val: string) => {
    setQuery(val);
    if (!val.trim()) {
      setResults(null);
      return;
    }
    setLoading(true);
    try {
      const res = await adminApi.globalSearch(val);
      setResults(res);
    } catch (e) {}
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-[#151B2E] rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[80vh] bold-dark-text">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-white/5 flex items-center gap-3">
          <Search className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Global Search: search by user name, email, contract title, service, escrow ID..."
            className="flex-1 bg-transparent text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Section */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs font-semibold">
          {loading && (
            <div className="py-6 text-center text-slate-500 font-bold">
              Searching MySQL database records...
            </div>
          )}

          {!loading && results && (
            <div className="space-y-4">
              {/* Users */}
              {results.users && results.users.length > 0 && (
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">
                    Users ({results.users.length})
                  </span>
                  <div className="divide-y divide-slate-100 dark:divide-white/5">
                    {results.users.map((u: any) => (
                      <div
                        key={u.id}
                        onClick={() => { onSelectEntity('users', u.id); onClose(); }}
                        className="py-2 px-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-blue-500" />
                          <div>
                            <span className="font-extrabold text-slate-900 dark:text-white block">{u.full_name}</span>
                            <span className="text-[11px] text-slate-500 font-mono">{u.email} • {u.role}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {results.projects && results.projects.length > 0 && (
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">
                    Projects ({results.projects.length})
                  </span>
                  <div className="divide-y divide-slate-100 dark:divide-white/5">
                    {results.projects.map((p: any) => (
                      <div
                        key={p.id}
                        onClick={() => { onSelectEntity('projects', p.id); onClose(); }}
                        className="py-2 px-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-cyan-500" />
                          <div>
                            <span className="font-extrabold text-slate-900 dark:text-white block">{p.title}</span>
                            <span className="text-[11px] text-slate-500 font-mono">${p.budget} • Status: {p.status}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Services */}
              {results.services && results.services.length > 0 && (
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">
                    Marketplace Services ({results.services.length})
                  </span>
                  <div className="divide-y divide-slate-100 dark:divide-white/5">
                    {results.services.map((s: any) => (
                      <div
                        key={s.id}
                        onClick={() => { onSelectEntity('services', s.id); onClose(); }}
                        className="py-2 px-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4 text-indigo-500" />
                          <div>
                            <span className="font-extrabold text-slate-900 dark:text-white block">{s.name}</span>
                            <span className="text-[11px] text-slate-500 font-mono">{s.category} • ${s.avg_budget} avg</span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!loading && query && (!results || (results.users.length === 0 && results.projects.length === 0 && results.services.length === 0)) && (
            <div className="py-8 text-center text-slate-500 font-semibold">
              No direct matches found for "{query}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
