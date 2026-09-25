import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShieldCheck, Clock, CheckCircle2, ChevronLeft, ArrowRight, DollarSign, Award, MessageSquare } from 'lucide-react';
import { freelancersApi } from '../services/api';
import { TrustScoreRing } from '../components/TrustScoreRing';

export const FreelancerProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [freelancer, setFreelancer] = useState<any>(null);

  useEffect(() => {
    if (id) {
      freelancersApi.getById(Number(id)).then(setFreelancer);
    }
  }, [id]);

  if (!freelancer) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-xs text-slate-500">Loading verified talent profile...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Breadcrumb */}
      <div>
        <Link
          to="/freelancers"
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Talent Directory</span>
        </Link>
      </div>

      {/* Main Profile Header Card */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <img
            src={freelancer.avatar_url}
            alt={freelancer.full_name}
            className="w-24 h-24 rounded-2xl object-cover border-2 border-slate-200 dark:border-slate-700 shadow-sm"
          />
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                {freelancer.full_name}
              </h1>
              <span className="p-1 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400" title="Identity & Skills Verified">
                <ShieldCheck className="w-4 h-4" />
              </span>
            </div>

            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              {freelancer.headline}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs tabular-nums font-mono text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1 text-amber-500 font-bold font-sans">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                {freelancer.rating} ({freelancer.review_count} client reviews)
              </span>
              <span>·</span>
              <span>{freelancer.completed_projects} Projects Completed</span>
              <span>·</span>
              <span className="text-emerald-600 font-bold">{freelancer.on_time_delivery_rate}% On-Time</span>
            </div>
          </div>
        </div>

        {/* Right side: Trust Score & Actions */}
        <div className="flex items-center gap-6 border-t lg:border-t-0 pt-6 lg:pt-0 w-full lg:w-auto justify-between lg:justify-end">
          <TrustScoreRing score={freelancer.trust_score} size={90} strokeWidth={7} />
          
          <div className="space-y-2">
            <Link
              to="/customer/projects/create"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
            >
              <span>Invite to Project</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <span className="block text-center text-xs font-mono tabular-nums text-slate-500">
              Rate: <strong className="text-slate-900 dark:text-white text-sm">${freelancer.hourly_rate}/hr</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Bio & Trust Score Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Biography & Skills */}
        <div className="lg:col-span-2 space-y-8">
          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-4">
              About Professional Experience
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {freelancer.bio}
            </p>

            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mt-6 mb-3">
              Verified Technical Competencies
            </h4>
            <div className="flex flex-wrap gap-2">
              {freelancer.skills?.map((sk: any, i: number) => (
                <div
                  key={i}
                  className="px-3 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-800 dark:text-slate-200 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                  <span>{sk.name}</span>
                  <span className="text-[10px] text-slate-400 uppercase">({sk.proficiency})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Client Reviews Section */}
          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-4">
              Verified Client Reviews ({freelancer.reviews?.length || 0})
            </h3>
            
            {freelancer.reviews && freelancer.reviews.length > 0 ? (
              <div className="space-y-4">
                {freelancer.reviews.map((rev: any) => (
                  <div key={rev.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <img src={rev.reviewer_avatar} alt={rev.reviewer_name} className="w-7 h-7 rounded-full object-cover" />
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{rev.reviewer_name}</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{rev.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">No reviews recorded yet for this profile.</p>
            )}
          </div>
        </div>

        {/* Right Column: AI Trust Score Radar Breakdown */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 text-white shadow-sm space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 block">
              Verified Algorithmic Breakdown
            </span>
            <h3 className="font-bold text-lg text-white">
              AI Trust Score Metrics
            </h3>
            
            <div className="space-y-3 text-xs pt-2 font-mono tabular-nums">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">On-Time Delivery (20%)</span>
                  <span className="font-bold text-emerald-400">{freelancer.on_time_delivery_rate}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${freelancer.on_time_delivery_rate}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Client Ratings (30%)</span>
                  <span className="font-bold text-blue-400">{freelancer.rating} / 5.0</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(freelancer.rating / 5) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Completion Integrity (25%)</span>
                  <span className="font-bold text-indigo-400">100%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: '100%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Response Latency (15%)</span>
                  <span className="font-bold text-cyan-400">{freelancer.response_time_hours} hrs</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full" style={{ width: '95%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Dispute Penalty</span>
                  <span className="font-bold text-emerald-400">0.0 (None)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Escrow Protection Guarantee</span>
            </h4>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
              Hiring Elena Vance is governed by TrustLance AI Escrow. Your payment is held safely until you review and approve each deliverable tranche.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
