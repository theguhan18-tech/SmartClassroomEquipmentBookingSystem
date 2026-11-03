import React, { useState, useMemo } from 'react';
import { Search, Filter, RotateCcw, Building2, Plus, Sparkles } from 'lucide-react';
import { Equipment, EquipmentCategory } from '../types';
import { EquipmentCard } from '../components/EquipmentCard';
import { useAuth } from '../context/AuthContext';

interface EquipmentCatalogPageProps {
  equipmentList: Equipment[];
  onViewDetails: (item: Equipment) => void;
  onBookNow: (item: Equipment) => void;
  onAddEquipment?: () => void;
  onEditEquipment?: (item: Equipment) => void;
}

const CATEGORIES: Array<EquipmentCategory | 'All'> = [
  'All',
  'Projectors',
  'Smart Boards',
  'Audio & Microphones',
  'Laptops',
  'Cables & AV',
  'Laboratory Kits',
  'Presentation Remotes',
];

export const EquipmentCatalogPage: React.FC<EquipmentCatalogPageProps> = ({
  equipmentList,
  onViewDetails,
  onBookNow,
  onAddEquipment,
  onEditEquipment,
}) => {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EquipmentCategory | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');

  // Extract unique locations
  const locations = useMemo(() => {
    const locSet = new Set<string>();
    equipmentList.forEach(e => {
      const block = e.location.split('-')[0].trim();
      if (block) locSet.add(block);
    });
    return Array.from(locSet);
  }, [equipmentList]);

  // Filtered equipment
  const filtered = useMemo(() => {
    return equipmentList.filter(item => {
      // Search
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchModel = item.modelNumber?.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchModel) return false;
      }

      // Category
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }

      // Status
      if (selectedStatus !== 'All' && item.status !== selectedStatus) {
        return false;
      }

      // Location
      if (selectedLocation !== 'All' && !item.location.includes(selectedLocation)) {
        return false;
      }

      return true;
    });
  }, [equipmentList, search, selectedCategory, selectedStatus, selectedLocation]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSelectedStatus('All');
    setSelectedLocation('All');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 text-indigo-600 text-xs font-semibold uppercase tracking-wider mb-1">
            <Building2 className="w-3.5 h-3.5" />
            <span>Campus Asset Catalog</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Smart Classroom Equipment</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time inventory of university smart boards, laser projectors, audio setups, and lab hardware.
          </p>
        </div>

        {user?.role === 'admin' && onAddEquipment && (
          <button
            onClick={onAddEquipment}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Equipment</span>
          </button>
        )}
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search box */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by equipment name, model number, or keyword..."
              className="w-full text-xs rounded-xl border border-slate-300 pl-9 pr-3 py-2.5 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
            />
          </div>

          {/* Location dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 bg-white"
            >
              <option value="All">All Locations & Blocks</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Status dropdown */}
          <div className="md:col-span-3 flex items-center gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 bg-white"
            >
              <option value="All">All Statuses</option>
              <option value="Available">Available Only</option>
              <option value="Under Maintenance">Under Maintenance</option>
            </select>

            {(search || selectedCategory !== 'All' || selectedStatus !== 'All' || selectedLocation !== 'All') && (
              <button
                onClick={handleResetFilters}
                className="p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors shrink-0"
                title="Reset filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Buttons / Segmented Controls */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Equipment Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-slate-900 text-base">No Equipment Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            No equipment matches your current search or category filters. Try adjusting your filters or search keywords.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-4 px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-3 px-1">
            <span>Showing <strong className="font-mono text-slate-800 tabular-nums">{filtered.length}</strong> equipment items</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((item) => (
              <EquipmentCard
                key={item.id}
                equipment={item}
                onViewDetails={onViewDetails}
                onBookNow={onBookNow}
                onEdit={onEditEquipment}
                isAdmin={user?.role === 'admin'}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
