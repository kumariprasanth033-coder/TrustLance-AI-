import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertTriangle,
  UserCheck,
  Shield,
  Trash2,
  Edit2,
  DollarSign,
  Briefcase,
  Star,
  ExternalLink,
  Lock,
  RotateCcw
} from 'lucide-react';
import { Card } from '../ui/Card';
import { adminApi } from '../../services/api';
import { User } from '../../types';

interface AdminUserManagementProps {
  viewMode: 'users' | 'customers' | 'freelancers';
  onDataChanged: () => void;
}

export const AdminUserManagement: React.FC<AdminUserManagementProps> = ({
  viewMode,
  onDataChanged
}) => {
  const [dataList, setDataList] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      if (viewMode === 'customers') {
        const c = await adminApi.getCustomers(search);
        setDataList(c);
      } else if (viewMode === 'freelancers') {
        const f = await adminApi.getFreelancers(search, statusFilter !== 'all' ? statusFilter : undefined);
        setDataList(f);
      } else {
        const u = await adminApi.getUsers(search, roleFilter !== 'all' ? roleFilter : undefined, statusFilter !== 'all' ? statusFilter : undefined);
        setDataList(u);
      }
    } catch (e: any) {
      setActionError(e.message || 'Error fetching user records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [viewMode, search, statusFilter, roleFilter]);

  const handleUpdateStatus = async (userId: number, nextStatus: 'active' | 'suspended' | 'pending_verification') => {
    try {
      await adminApi.updateUserStatus(userId, nextStatus, `Status updated by Admin to ${nextStatus}`);
      setActionSuccess(`User #${userId} status changed to ${nextStatus.toUpperCase()}`);
      loadData();
      onDataChanged();
      setTimeout(() => setActionSuccess(null), 3500);
    } catch (e: any) {
      setActionError(e.message || 'Failed to update user status');
    }
  };

  const handleToggleVerifyFreelancer = async (freelancerId: number, currentVerify: boolean) => {
    try {
      await adminApi.verifyFreelancer(freelancerId, !currentVerify);
      setActionSuccess(`Freelancer verification updated.`);
      loadData();
      onDataChanged();
      setTimeout(() => setActionSuccess(null), 3500);
    } catch (e: any) {
      setActionError(e.message || 'Verification update failed');
    }
  };

  const handleDeleteUser = async (user: any) => {
    if (!confirm(`Are you sure you want to delete user ${user.full_name} (${user.email})? Financial safeguards will block deletion if active escrow funds are held.`)) {
      return;
    }
    try {
      await adminApi.deleteUser(user.id);
      setActionSuccess(`User #${user.id} removed from database.`);
      loadData();
      onDataChanged();
      setTimeout(() => setActionSuccess(null), 3500);
    } catch (e: any) {
      setActionError(e.message || 'Cannot delete user');
      setTimeout(() => setActionError(null), 6000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight capitalize flex items-center gap-2">
            {viewMode === 'freelancers' ? <UserCheck className="w-5 h-5 text-indigo-600" /> : <Users className="w-5 h-5 text-blue-600" />}
            <span>
              {viewMode === 'customers' ? 'Customer Accounts Directory' :
               viewMode === 'freelancers' ? 'Verified Freelancer Intelligence' :
               'Platform User Administration'}
            </span>
          </h2>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
            Real MySQL profiles with full historical audit, escrow activity, and role authorization.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email..."
              className="w-full pl-9 pr-3 py-2 bg-white dark:bg-[#151B2E] border border-slate-300 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-blue-500"
            />
          </div>

          {viewMode === 'users' && (
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-[#151B2E] border border-slate-300 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white font-semibold focus:outline-none"
            >
              <option value="all">All Roles</option>
              <option value="customer">Customer</option>
              <option value="freelancer">Freelancer</option>
              <option value="admin">Admin</option>
            </select>
          )}

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-[#151B2E] border border-slate-300 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white font-semibold focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="pending_verification">Pending</option>
          </select>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {actionError && (
        <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 text-rose-800 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Main Table View */}
      <Card className="p-0 overflow-hidden shadow-xl bg-white dark:bg-[#151B2E] bold-dark-text">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs bold-dark-text">
            <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              <tr>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">{viewMode === 'customers' ? 'Company & Projects' : viewMode === 'freelancers' ? 'Domain & Expertise' : 'Role'}</th>
                <th className="py-3.5 px-4">{viewMode === 'freelancers' ? 'AI Perfection Score' : 'Trust Score'}</th>
                <th className="py-3.5 px-4">{viewMode === 'customers' ? 'Total Spent' : viewMode === 'freelancers' ? 'Total Earned' : 'Projects'}</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-semibold">
              {dataList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                        alt={item.full_name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-white/10"
                      />
                      <div>
                        <span className="font-extrabold text-slate-900 dark:text-white block">{item.full_name}</span>
                        <span className="text-[11px] text-slate-500 font-mono">{item.email}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    {viewMode === 'customers' ? (
                      <div>
                        <span className="text-slate-900 dark:text-white font-bold block">{item.company_name}</span>
                        <span className="text-[11px] text-slate-500">{item.total_projects} projects ({item.active_projects} active)</span>
                      </div>
                    ) : viewMode === 'freelancers' ? (
                      <div>
                        <span className="text-slate-900 dark:text-white font-bold block line-clamp-1">{item.headline}</span>
                        <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-mono">
                          ${item.hourly_rate}/hr • {item.completed_projects} projects
                        </span>
                      </div>
                    ) : (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                        item.role === 'admin' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-300' :
                        item.role === 'freelancer' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-300' :
                        'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-300'
                      }`}>
                        {item.role}
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 font-mono font-bold">
                    {viewMode === 'freelancers' ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-blue-600 dark:text-blue-400 font-extrabold">{item.perfection_score}/100</span>
                        <span className="text-[10px] text-slate-400">({item.trust_score} TS)</span>
                      </div>
                    ) : (
                      <span className="text-emerald-600 dark:text-emerald-400">{item.trust_score ?? 96.5}</span>
                    )}
                  </td>

                  <td className="py-3 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                    {viewMode === 'customers' ? (
                      <span>${(item.total_spent || 0).toLocaleString()}</span>
                    ) : viewMode === 'freelancers' ? (
                      <span className="text-emerald-600 dark:text-emerald-400">${(item.total_earned || 0).toLocaleString()}</span>
                    ) : (
                      <span>{item.project_count || 0}</span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      item.status === 'active' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-300' :
                      item.status === 'suspended' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-300' :
                      'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-300'
                    }`}>
                      {item.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-white/5 text-blue-600 dark:text-blue-400 hover:bg-blue-100 text-[11px] font-bold"
                      >
                        Inspect
                      </button>

                      {viewMode === 'freelancers' && (
                        <button
                          onClick={() => handleToggleVerifyFreelancer(item.id, item.is_verified)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                            item.is_verified
                              ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400'
                              : 'bg-slate-100 text-slate-600 dark:bg-white/10'
                          }`}
                        >
                          {item.is_verified ? 'Verified' : 'Verify'}
                        </button>
                      )}

                      {item.status === 'active' ? (
                        <button
                          onClick={() => handleUpdateStatus(item.user_id || item.id, 'suspended')}
                          className="px-2 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-[11px] font-bold hover:bg-rose-100"
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateStatus(item.user_id || item.id, 'active')}
                          className="px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold hover:bg-emerald-100"
                        >
                          Activate
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteUser(item)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* INSPECT DETAIL DRAWER/MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-[#151B2E] rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-slate-200 dark:border-white/10 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-3">
                <img
                  src={selectedItem.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                  alt={selectedItem.full_name}
                  className="w-10 h-10 rounded-full object-cover border"
                />
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{selectedItem.full_name}</h3>
                  <span className="text-[11px] text-slate-500 font-mono">{selectedItem.email}</span>
                </div>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                selectedItem.status === 'active' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40' : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40'
              }`}>
                {selectedItem.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Role Classification</span>
                <p className="font-extrabold text-slate-900 dark:text-white capitalize">{selectedItem.role}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">AI Trust Score</span>
                <p className="font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">{selectedItem.trust_score} / 100</p>
              </div>
              {selectedItem.hourly_rate && (
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Hourly Rate</span>
                  <p className="font-bold text-slate-900 dark:text-white font-mono">${selectedItem.hourly_rate}/hr</p>
                </div>
              )}
              {selectedItem.on_time_delivery_rate !== undefined && (
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">On-Time Delivery Rate</span>
                  <p className="font-bold text-slate-900 dark:text-white font-mono">{selectedItem.on_time_delivery_rate}%</p>
                </div>
              )}
            </div>

            {selectedItem.bio && (
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block mb-1">Biography & Verification Scope</span>
                <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed bg-slate-50 dark:bg-white/5 p-3 rounded-xl border border-slate-200 dark:border-white/5">
                  {selectedItem.bio}
                </p>
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-white/5">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="btn-primary-gradient px-5 py-2 text-xs font-bold"
              >
                Close Audit View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
