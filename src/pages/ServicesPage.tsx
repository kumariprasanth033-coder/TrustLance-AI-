import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Globe, ChevronRight, Sparkles, Layers, ArrowRight, CheckCircle2 } from 'lucide-react';
import { servicesApi } from '../services/api';
import { ServiceCategory } from '../types';

export const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<ServiceCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  useEffect(() => {
    servicesApi.list().then(setServices);
    const q = searchParams.get('q');
    if (q) setSearchQuery(q);
  }, [searchParams]);

  // Categories requested in Prompt #8
  const filterCategories = [
    'All',
    'AI & ML',
    'Development',
    'Design',
    'Marketing',
    'Writing',
    'Data',
    'Cybersecurity',
    'Cloud',
    'Other'
  ];

  const filtered = services.filter(s => {
    let matchCat = activeCategory === 'All';
    if (!matchCat) {
      const catLower = s.category.toLowerCase();
      const nameLower = s.name.toLowerCase();
      if (activeCategory === 'AI & ML') matchCat = catLower.includes('ai') || nameLower.includes('ai') || nameLower.includes('machine learning');
      else if (activeCategory === 'Development') matchCat = catLower.includes('engineer') || nameLower.includes('dev') || nameLower.includes('development') || nameLower.includes('blockchain');
      else if (activeCategory === 'Design') matchCat = catLower.includes('design') || nameLower.includes('design') || nameLower.includes('ui');
      else if (activeCategory === 'Marketing') matchCat = catLower.includes('marketing') || nameLower.includes('seo') || nameLower.includes('marketing');
      else if (activeCategory === 'Writing') matchCat = catLower.includes('writing') || nameLower.includes('content') || nameLower.includes('copy');
      else if (activeCategory === 'Data') matchCat = catLower.includes('data') || nameLower.includes('data') || nameLower.includes('analytics');
      else if (activeCategory === 'Cybersecurity') matchCat = nameLower.includes('security') || nameLower.includes('cyber');
      else if (activeCategory === 'Cloud') matchCat = nameLower.includes('cloud') || nameLower.includes('devops');
      else matchCat = true;
    }

    const matchSearch = !searchQuery || 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 dark:border-white/10 pb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-blue-600 dark:text-blue-400 mb-2 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
            <span>20 Specialized Disciplines & Escrow Protocols</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Explore Freelance Services
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-xl font-medium">
            “Find trusted professionals across the skills you need.”
          </p>
        </div>

        {/* Search */}
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search skills, services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-[#151B2E] border border-slate-300 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-2xs font-medium"
          />
        </div>
      </div>

      {/* Filter Bar with Horizontal Scroll and Gradient Active Indicator */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {filterCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white dark:bg-[#151B2E] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-blue-400 dark:hover:border-white/20'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((service) => (
          <div
            key={service.id}
            className="p-6 rounded-3xl bg-white dark:bg-[#151B2E] border border-slate-200 dark:border-white/10 hover:border-blue-500/50 transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between group shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600/10 to-purple-600/10 dark:from-blue-500/20 dark:to-purple-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold border border-blue-500/20 group-hover:scale-105 transition-transform">
                  <Globe className="w-5 h-5" />
                </div>
                {service.id <= 4 ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold border border-purple-500/20">
                    AI Recommended
                  </span>
                ) : (
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 tabular-nums font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5">
                    {service.project_count} projects
                  </span>
                )}
              </div>

              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                {service.category}
              </span>
              <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                {service.name}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed font-medium">
                {service.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 space-y-3">
              <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 tabular-nums font-mono font-medium">
                <span>Avg. Budget: <strong className="text-slate-900 dark:text-white font-bold">${service.avg_budget}</strong></span>
                <span>~{service.delivery_days} days</span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Link
                  to={`/services/${service.id}`}
                  className="flex-1 py-2 text-center text-xs font-bold text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl transition-colors border border-slate-200 dark:border-white/10"
                >
                  Details
                </Link>
                <Link
                  to={`/customer/projects/create?service_id=${service.id}`}
                  className="flex-1 py-2 text-center text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl shadow-xs transition-all"
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
