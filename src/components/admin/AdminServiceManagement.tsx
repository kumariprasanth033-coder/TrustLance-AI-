import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Search,
  FolderTree,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Check
} from 'lucide-react';
import { Card } from '../ui/Card';
import { servicesApi, categoriesApi } from '../../services/api';
import { ServiceCategory, CategoryItem } from '../../types';

interface AdminServiceManagementProps {
  onDataChanged: () => void;
}

export const AdminServiceManagement: React.FC<AdminServiceManagementProps> = ({ onDataChanged }) => {
  const [activeSubTab, setActiveSubTab] = useState<'services' | 'categories'>('services');
  const [services, setServices] = useState<ServiceCategory[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Modals state
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceCategory | null>(null);
  const [serviceForm, setServiceForm] = useState({
    name: '',
    category: 'Engineering',
    description: '',
    avg_budget: 1200,
    delivery_days: 14,
    icon: 'Sparkles',
    is_active: 1
  });

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    icon: 'Folder',
    is_active: 1
  });

  const loadAll = async () => {
    setLoading(true);
    try {
      const s = await servicesApi.list(undefined, undefined, true);
      const c = await categoriesApi.list(true);
      setServices(s);
      setCategories(c);
    } catch (e: any) {
      setMessage({ text: e.message || 'Failed to load services', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleOpenAddService = () => {
    setEditingService(null);
    setServiceForm({
      name: '',
      category: categories[0]?.name || 'Engineering',
      description: '',
      avg_budget: 1200,
      delivery_days: 14,
      icon: 'Sparkles',
      is_active: 1
    });
    setIsServiceModalOpen(true);
  };

  const handleOpenEditService = (service: ServiceCategory) => {
    setEditingService(service);
    setServiceForm({
      name: service.name,
      category: service.category,
      description: service.description,
      avg_budget: service.avg_budget,
      delivery_days: service.delivery_days,
      icon: service.icon || 'Sparkles',
      is_active: service.is_active
    });
    setIsServiceModalOpen(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceForm.name.trim() || !serviceForm.description.trim()) {
      setMessage({ text: 'Name and description are required.', type: 'error' });
      return;
    }

    try {
      if (editingService) {
        await servicesApi.update(editingService.id, serviceForm);
        setMessage({ text: `Service "${serviceForm.name}" updated successfully!`, type: 'success' });
      } else {
        await servicesApi.create(serviceForm);
        setMessage({ text: `New service "${serviceForm.name}" created and published to marketplace!`, type: 'success' });
      }
      setIsServiceModalOpen(false);
      loadAll();
      onDataChanged();
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      setMessage({ text: err.message || 'Operation failed', type: 'error' });
    }
  };

  const handleToggleService = async (service: ServiceCategory) => {
    try {
      const nextStatus = service.is_active === 1 ? false : true;
      await servicesApi.toggleStatus(service.id, nextStatus);
      setMessage({
        text: `Service "${service.name}" ${nextStatus ? 'activated' : 'disabled'}.`,
        type: 'success'
      });
      loadAll();
      onDataChanged();
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ text: err.message || 'Toggle failed', type: 'error' });
    }
  };

  const handleDeleteService = async (service: ServiceCategory) => {
    if (!confirm(`Are you sure you want to delete service "${service.name}"? If active projects are bound to it, deletion will be blocked.`)) {
      return;
    }
    try {
      await servicesApi.delete(service.id);
      setMessage({ text: `Service "${service.name}" deleted.`, type: 'success' });
      loadAll();
      onDataChanged();
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ text: err.message || 'Delete failed', type: 'error' });
    }
  };

  // Category handlers
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({ name: '', description: '', icon: 'Folder', is_active: 1 });
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setCategoryForm({
      name: cat.name,
      description: cat.description || '',
      icon: cat.icon || 'Folder',
      is_active: cat.is_active
    });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) return;

    try {
      if (editingCategory) {
        await categoriesApi.update(editingCategory.id, categoryForm);
        setMessage({ text: `Category "${categoryForm.name}" updated!`, type: 'success' });
      } else {
        await categoriesApi.create(categoryForm);
        setMessage({ text: `Category "${categoryForm.name}" created!`, type: 'success' });
      }
      setIsCategoryModalOpen(false);
      loadAll();
      onDataChanged();
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      setMessage({ text: err.message || 'Operation failed', type: 'error' });
    }
  };

  const handleDeleteCategory = async (cat: CategoryItem) => {
    if (!confirm(`Delete category "${cat.name}"? This is safeguarded against bound services.`)) return;
    try {
      await categoriesApi.delete(cat.id);
      setMessage({ text: `Category "${cat.name}" deleted.`, type: 'success' });
      loadAll();
      onDataChanged();
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ text: err.message || 'Delete failed', type: 'error' });
    }
  };

  const filteredServices = services.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase()) ||
    s.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header & Sub-tab Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <span>Marketplace Catalog & Service Management (CRUD)</span>
          </h2>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
            Full administrative CRUD control. Changes instantly cascade to the landing page, services directory, and project wizard.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeSubTab === 'services' ? (
            <button
              onClick={handleOpenAddService}
              className="btn-primary-gradient px-4 py-2 text-xs font-bold gap-1.5 flex items-center shadow-md shadow-blue-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Service</span>
            </button>
          ) : (
            <button
              onClick={handleOpenAddCategory}
              className="btn-primary-gradient px-4 py-2 text-xs font-bold gap-1.5 flex items-center shadow-md shadow-blue-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          )}
        </div>
      </div>

      {message && (
        <div className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 ${
          message.type === 'success'
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-800 dark:text-emerald-300'
            : 'bg-rose-50 dark:bg-rose-950/40 border border-rose-300 text-rose-800 dark:text-rose-300'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Tabs Switcher & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold w-full sm:w-auto">
          <button
            onClick={() => setActiveSubTab('services')}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg transition-all ${
              activeSubTab === 'services'
                ? 'bg-white dark:bg-[#151B2E] text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Services ({services.length})
          </button>
          <button
            onClick={() => setActiveSubTab('categories')}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg transition-all ${
              activeSubTab === 'categories'
                ? 'bg-white dark:bg-[#151B2E] text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Categories ({categories.length})
          </button>
        </div>

        <div className="w-full sm:w-72 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${activeSubTab}...`}
            className="w-full pl-9 pr-3 py-2 bg-white dark:bg-[#151B2E] border border-slate-300 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Services Table */}
      {activeSubTab === 'services' && (
        <Card className="p-0 overflow-hidden shadow-xl bg-white dark:bg-[#151B2E] bold-dark-text">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs bold-dark-text">
              <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                <tr>
                  <th className="py-3.5 px-4">ID</th>
                  <th className="py-3.5 px-4">Service Name</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Avg Budget</th>
                  <th className="py-3.5 px-4">Delivery</th>
                  <th className="py-3.5 px-4">Projects</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-semibold">
                {filteredServices.map((srv) => (
                  <tr key={srv.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-500">#{srv.id}</td>
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-extrabold text-slate-900 dark:text-white block">{srv.name}</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 max-w-sm">
                          {srv.description}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                        {srv.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      ${srv.avg_budget}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-mono">
                      {srv.delivery_days} days
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300">
                      {srv.project_count || 0}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleService(srv)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase transition-all ${
                          srv.is_active === 1
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-400 border border-slate-300'
                        }`}
                      >
                        {srv.is_active === 1 ? 'Active (Enabled)' : 'Disabled'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditService(srv)}
                          className="p-1.5 rounded-lg bg-blue-50 dark:bg-white/5 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-colors"
                          title="Edit Service"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteService(srv)}
                          className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors"
                          title="Delete Service"
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
      )}

      {/* Categories Table */}
      {activeSubTab === 'categories' && (
        <Card className="p-0 overflow-hidden shadow-xl bg-white dark:bg-[#151B2E] bold-dark-text">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs bold-dark-text">
              <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                <tr>
                  <th className="py-3.5 px-4">ID</th>
                  <th className="py-3.5 px-4">Category Name</th>
                  <th className="py-3.5 px-4">Slug</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-semibold">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-500">#{cat.id}</td>
                    <td className="py-3 px-4 font-extrabold text-slate-900 dark:text-white">
                      {cat.name}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">{cat.slug}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      {cat.description || 'Standard platform category'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        cat.is_active === 1
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-400'
                      }`}>
                        {cat.is_active === 1 ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditCategory(cat)}
                          className="p-1.5 rounded-lg bg-blue-50 dark:bg-white/5 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat)}
                          className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors"
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
      )}

      {/* SERVICE MODAL (CREATE / EDIT) */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-[#151B2E] rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 dark:border-white/10 shadow-2xl space-y-4 text-xs">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/5 pb-3">
              {editingService ? `Edit Service: ${editingService.name}` : 'Add New Marketplace Service'}
            </h3>

            <form onSubmit={handleSaveService} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Service Name</label>
                <input
                  type="text"
                  required
                  value={serviceForm.name}
                  onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                  placeholder="e.g. Cloud Security Architecture"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Category</label>
                <select
                  value={serviceForm.category}
                  onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-blue-500"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name} className="dark:bg-[#151B2E] text-slate-900 dark:text-white">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  placeholder="Comprehensive service capabilities, deliverables, and standards..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Average Budget ($)</label>
                  <input
                    type="number"
                    min="50"
                    value={serviceForm.avg_budget}
                    onChange={(e) => setServiceForm({ ...serviceForm, avg_budget: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white font-mono font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Delivery Target (Days)</label>
                  <input
                    type="number"
                    min="1"
                    value={serviceForm.delivery_days}
                    onChange={(e) => setServiceForm({ ...serviceForm, delivery_days: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white font-mono font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="srv_active"
                  checked={serviceForm.is_active === 1}
                  onChange={(e) => setServiceForm({ ...serviceForm, is_active: e.target.checked ? 1 : 0 })}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="srv_active" className="font-bold text-slate-800 dark:text-slate-200">
                  Service is Active & Available for Client Projects
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="btn-secondary-surface py-2.5 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary-gradient py-2.5 text-xs font-bold"
                >
                  {editingService ? 'Save Changes' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY MODAL */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-[#151B2E] rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-white/10 shadow-2xl space-y-4 text-xs">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/5 pb-2">
              {editingCategory ? 'Edit Category' : 'Create New Category'}
            </h3>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="e.g. Cloud Infrastructure"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Description</label>
                <input
                  type="text"
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  placeholder="Brief description"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="btn-secondary-surface py-2.5 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary-gradient py-2.5 text-xs font-bold"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
