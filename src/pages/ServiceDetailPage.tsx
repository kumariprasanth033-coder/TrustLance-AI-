import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Globe, ArrowRight, ShieldCheck, Clock, DollarSign, Star, Sparkles, CheckCircle2, ChevronLeft } from 'lucide-react';
import { servicesApi, freelancersApi } from '../services/api';
import { ServiceCategory } from '../types';
import { TrustScoreRing } from '../components/TrustScoreRing';

export const ServiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<ServiceCategory | null>(null);
  const [freelancers, setFreelancers] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      servicesApi.getById(Number(id)).then((s) => s && setService(s));
      freelancersApi.list().then(setFreelancers);
    }
  }, [id]);

  if (!service) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-xs text-slate-500">
        Loading service details from MySQL...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Back breadcrumb */}
      <div>
        <Link
          to="/services"
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>All Services</span>
        </Link>
      </div>

      {/* Hero Service Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#151B2E] border border-slate-200 dark:border-white/10 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            <span>{service.category}</span>
            <span>·</span>
            <span className="tabular-nums font-mono">{service.project_count} active projects</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {service.name}
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            {service.description}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs tabular-nums font-mono text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              <span>Avg Budget: <strong className="text-slate-900 dark:text-white">${service.avg_budget}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>Delivery Time: <strong className="text-slate-900 dark:text-white">~{service.delivery_days} days</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-purple-500" />
              <span>Escrow Protection: <strong className="text-slate-900 dark:text-white">Enabled</strong></span>
            </div>
          </div>
        </div>

        <div>
          <Link
            to={`/customer/projects/create?service_id=${service.id}`}
            className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4" />
            <span>Post a Project in This Service</span>
          </Link>
        </div>
      </div>

      {/* Recommended Freelancers in this discipline */}
      <div>
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
            Verified Talent
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Top Rated Freelancers in {service.name}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {freelancers.slice(0, 3).map((f) => (
            <div
              key={f.id}
              className="p-6 rounded-3xl bg-white dark:bg-[#151B2E] border border-slate-200 dark:border-white/10 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={f.avatar_url}
                      alt={f.full_name}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-white/10"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{f.full_name}</h4>
                      <span className="text-xs text-slate-500 dark:text-slate-400 block line-clamp-1">{f.headline}</span>
                    </div>
                  </div>
                  <TrustScoreRing score={f.trust_score} size={50} strokeWidth={4} showTier={false} />
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed mb-4">
                  {f.bio}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {f.skills?.slice(0, 3).map((sk: any, i: number) => (
                    <span key={i} className="text-[11px] px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 font-mono border border-slate-200/50 dark:border-white/5">
                      {sk.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 dark:text-white tabular-nums">${f.hourly_rate}/hr</span>
                <Link
                  to={`/freelancers/${f.id}`}
                  className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500 flex items-center gap-1"
                >
                  <span>View Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
