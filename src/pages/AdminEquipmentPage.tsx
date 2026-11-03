import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Filter, 
  AlertTriangle, 
  Layers, 
  CheckCircle2,
  X,
  Upload
} from 'lucide-react';
import { Equipment, EquipmentCategory } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { api } from '../services/api';

interface AdminEquipmentPageProps {
  equipmentList: Equipment[];
  onRefresh: () => void;
  onViewDetails: (item: Equipment) => void;
}

const CATEGORIES: EquipmentCategory[] = [
  'Projectors',
  'Smart Boards',
  'Audio & Microphones',
  'Laptops',
  'Cables & AV',
  'Laboratory Kits',
  'Presentation Remotes',
];

export const AdminEquipmentPage: React.FC<AdminEquipmentPageProps> = ({
  equipmentList,
  onRefresh,
  onViewDetails,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Equipment | null>(null);
  const [deletingItem, setDeletingItem] = useState<Equipment | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    category: 'Projectors' as EquipmentCategory,
    description: '',
    image: '/src/assets/images/equipment_laser_projector_1793676017444.jpg',
    totalQuantity: 5,
    location: '',
    condition: 'Good' as 'Excellent' | 'Good' | 'Needs Maintenance',
    status: 'Available' as 'Available' | 'Under Maintenance' | 'Decommissioned',
    modelNumber: '',
    specifications: '',
  });

  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const filtered = equipmentList.filter(e => {
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!e.name.toLowerCase().includes(q) && !e.location.toLowerCase().includes(q)) return false;
    }
    if (selectedCategory !== 'All' && e.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      category: 'Projectors',
      description: '',
      image: '/src/assets/images/equipment_laser_projector_1793676017444.jpg',
      totalQuantity: 5,
      location: 'Block A, Room 101',
      condition: 'Good',
      status: 'Available',
      modelNumber: '',
      specifications: '',
    });
    setFormError('');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (item: Equipment) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      description: item.description,
      image: item.image,
      totalQuantity: item.totalQuantity,
      location: item.location,
      condition: item.condition,
      status: item.status,
      modelNumber: item.modelNumber || '',
      specifications: item.specifications ? item.specifications.join(', ') : '',
    });
    setFormError('');
  };

  const handleSaveEquipment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.location) {
      setFormError('Name, Category, and Location are mandatory.');
      return;
    }

    setSubmitting(true);
    setFormError('');

    try {
      const specsArray = formData.specifications
        ? formData.specifications.split(',').map(s => s.trim()).filter(Boolean)
        : [];

      if (editingItem) {
        // Update
        const res = await api.updateEquipment(editingItem.id, {
          ...formData,
          totalQuantity: Number(formData.totalQuantity),
          specifications: specsArray,
        });
        if (res.success) {
          setFeedback({ type: 'success', text: `Equipment "${formData.name}" updated successfully.` });
          setEditingItem(null);
          onRefresh();
        }
      } else {
        // Create
        const res = await api.createEquipment({
          ...formData,
          totalQuantity: Number(formData.totalQuantity),
          specifications: specsArray,
        });
        if (res.success) {
          setFeedback({ type: 'success', text: `New equipment asset "${formData.name}" registered.` });
          setIsAddModalOpen(false);
          onRefresh();
        }
      }
    } catch (err: any) {
      setFormError(err.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEquipment = async () => {
    if (!deletingItem) return;
    try {
      const res = await api.deleteEquipment(deletingItem.id);
      if (res.success) {
        setFeedback({ type: 'success', text: `Asset "${deletingItem.name}" deleted from inventory.` });
        setDeletingItem(null);
        onRefresh();
      }
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message || 'Failed to delete asset.' });
      setDeletingItem(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 text-indigo-600 text-xs font-semibold uppercase tracking-wider mb-1">
            <Building2 className="w-3.5 h-3.5" />
            <span>Campus Asset Management</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Equipment Inventory Registry</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Add new assets, modify hardware parameters, update quantities, and designate maintenance states.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Equipment</span>
        </button>
      </div>

      {feedback && (
        <div className={`p-4 rounded-xl border text-xs flex items-center justify-between ${
          feedback.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          <span>{feedback.text}</span>
          <button onClick={() => setFeedback(null)} className="font-bold hover:underline">Dismiss</button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by asset name or location..."
            className="w-full text-xs rounded-xl border border-slate-300 pl-9 pr-3 py-2 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="text-xs rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 bg-white w-full sm:w-56"
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Equipment Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Asset Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Stock Pool</th>
                <th className="py-3 px-4">Status & Health</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                      <div>
                        <div className="font-semibold text-slate-900">{item.name}</div>
                        {item.modelNumber && (
                          <div className="text-[11px] font-mono text-slate-400">Model: {item.modelNumber}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800">
                    {item.category}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {item.location}
                  </td>
                  <td className="py-3 px-4 font-mono tabular-nums">
                    <span className="font-bold text-slate-900">{item.totalQuantity}</span> total
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col gap-1 items-start">
                      <StatusBadge status={item.status} size="sm" />
                      <span className="text-[10px] text-slate-500 font-medium">Condition: {item.condition}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onViewDetails(item)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
                        title="View details & test availability"
                      >
                        <Layers className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg"
                        title="Edit equipment"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingItem(item)}
                        className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg"
                        title="Delete asset"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Equipment Modal */}
      {(isAddModalOpen || editingItem !== null) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full overflow-hidden border border-slate-200 my-8">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-base">
                {editingItem ? 'Edit Equipment Parameters' : 'Register New Campus Equipment'}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingItem(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEquipment} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Equipment Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Sony Laser 4K Projector"
                    className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as EquipmentCategory })}
                    className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-600 bg-white"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed equipment description, capability notes, and accessories included..."
                  className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Total Quantity Pool *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.totalQuantity}
                    onChange={(e) => setFormData({ ...formData, totalQuantity: parseInt(e.target.value, 10) || 1 })}
                    className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Operational Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-600 bg-white"
                  >
                    <option value="Available">Available for Booking</option>
                    <option value="Under Maintenance">Under Maintenance</option>
                    <option value="Decommissioned">Decommissioned</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Physical Condition</label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value as any })}
                    className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-600 bg-white"
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Needs Maintenance">Needs Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Location / Department *</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Block A, Room 102"
                    className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Model / Serial Number</label>
                  <input
                    type="text"
                    value={formData.modelNumber}
                    onChange={(e) => setFormData({ ...formData, modelNumber: e.target.value })}
                    placeholder="e.g. OPT-ZH406-UHD"
                    className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-600 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Image URL or Local Asset Path</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="/src/assets/images/..."
                    className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-600 font-mono text-[11px]"
                  />
                </div>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                  <span>Quick choices:</span>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image: '/src/assets/images/equipment_laser_projector_1793676017444.jpg' })}
                    className="text-indigo-600 hover:underline"
                  >
                    Projector
                  </button>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image: '/src/assets/images/equipment_smartboard_1793676018403.jpg' })}
                    className="text-indigo-600 hover:underline"
                  >
                    Smart Board
                  </button>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image: '/src/assets/images/equipment_audio_kit_1793676018282.jpg' })}
                    className="text-indigo-600 hover:underline"
                  >
                    Audio Kit
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Specifications (Comma separated)</label>
                <input
                  type="text"
                  value={formData.specifications}
                  onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                  placeholder="e.g. 4K UHD, 5000 ANSI Lumens, 20-point touch, HDMI 2.1"
                  className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-indigo-600"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
                >
                  {submitting ? 'Saving...' : editingItem ? 'Save Asset Changes' : 'Create Equipment Asset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deletingItem !== null}
        title="Delete Equipment Asset"
        message={`Are you sure you want to delete "${deletingItem?.name}"? The system will reject deletion if there are active pending or approved reservations.`}
        confirmText="Confirm Delete"
        isDestructive={true}
        onConfirm={handleDeleteEquipment}
        onClose={() => setDeletingItem(null)}
      />
    </div>
  );
};
