import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Globe, ChevronRight, Sparkles, Layers, ArrowRight } from 'lucide-react';
import { servicesApi } from '../services/api';
import { ServiceCategory } from '../types';

export const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<ServiceCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    servicesApi.list().then(setServices);
  }, []);

  const categories = ['All', 'Engineering', 'Design', 'AI & Data', 'Marketing', 'Media', 'Writing', 'Creative Tech'];

  const filtered = services.filter(s => {
    const matchCategory = activeCategory === 'All' || s.category.toLowerCase() === activeCategory.toLowerCase();
    const matchSearch = !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>20 Verified Service Disciplines</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Explore All Freelance Services
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Each category features escrow-backed contracts, verified talent trust metrics, and transparent average pricing benchmarks.
          </p>
        </div>

        {/* Search */}
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search 20 services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Services Grid (All 20 Services) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filtered.map((service) => (
          <div
            key={service.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all hover:shadow-md flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <Globe className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                  {service.project_count} active
                </span>
              </div>

              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                {service.category}
              </span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {service.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {service.description}
              </p>
            </div>

            <div className="mt-6 pt-3.5 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 tabular-nums font-mono">
                <span>Avg. Budget: <strong className="text-slate-900 dark:text-white">${service.avg_budget}</strong></span>
                <span>~{service.delivery_days} days</span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Link
                  to={`/services/${service.id}`}
                  className="flex-1 py-1.5 text-center text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
                >
                  Details
                </Link>
                <Link
                  to={`/customer/projects/create?service_id=${service.id}`}
                  className="flex-1 py-1.5 text-center text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-colors"
                >
                  Post Job
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
