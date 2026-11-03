import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  TrendingUp, 
  Layers, 
  BarChart3, 
  ShieldCheck, 
  CheckCircle2, 
  RefreshCw,
  Building2
} from 'lucide-react';
import { api } from '../services/api';

export const AdminReportsPage: React.FC = () => {
  const [usageData, setUsageData] = useState<any[]>([]);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usageRes, summaryRes] = await Promise.all([
        api.getEquipmentUsageReport(),
        api.getDashboardSummary(),
      ]);

      if (usageRes.success) setUsageData(usageRes.data);
      if (summaryRes.success) setSummaryData(summaryRes.data);
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleExportCSV = () => {
    if (!usageData || usageData.length === 0) return;

    const headers = [
      'Equipment ID',
      'Equipment Name',
      'Category',
      'Total Pool Units',
      'Location',
      'Condition',
      'Status',
      'Total Bookings',
      'Approved Bookings',
      'Total Units Reserved',
      'Estimated Utilization Score',
    ];

    const rows = usageData.map(item => [
      `"${item.id}"`,
      `"${item.name.replace(/"/g, '""')}"`,
      `"${item.category}"`,
      item.totalQuantity,
      `"${item.location}"`,
      `"${item.condition}"`,
      `"${item.status}"`,
      item.totalBookings,
      item.approvedBookings,
      item.totalUnitsReserved,
      `"${item.utilizationScore}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `smart_classroom_equipment_usage_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 text-indigo-600 text-xs font-semibold uppercase tracking-wider mb-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Campus Intelligence & Auditing</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Equipment Utilization & Reports</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit equipment demand, reservation frequency, department utilization, and export CSV compliance data.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchData}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Refresh data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV Report</span>
          </button>
        </div>
      </div>

      {/* Demand & Category Distribution Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-600" />
            Category Demand Distribution
          </h2>

          <div className="space-y-3">
            {summaryData?.bookingsByCategory && Object.entries(summaryData.bookingsByCategory).map(([cat, count]: [string, any]) => (
              <div key={cat} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-800">{cat}</span>
                  <span className="font-mono tabular-nums text-indigo-600 font-bold">{count} bookings</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (count / Math.max(1, summaryData.bookings.total)) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            Top Booked Equipment
          </h2>

          <div className="divide-y divide-slate-100">
            {summaryData?.mostBooked?.map((item: any, i: number) => (
              <div key={item.name} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-900">{i + 1}. {item.name}</span>
                  <div className="text-[11px] text-slate-400">{item.category}</div>
                </div>
                <div className="text-right font-mono tabular-nums">
                  <span className="font-bold text-slate-800">{item.count} reservations</span>
                  <div className="text-[10px] text-slate-400">{item.unitsRequested} total units allocated</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Utilization Report Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">Detailed Equipment Utilization Ledger</h3>
          <span className="text-xs text-slate-500 font-mono">Updated: Just now</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Equipment Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Pool Units</th>
                <th className="py-3 px-4">Approved Bookings</th>
                <th className="py-3 px-4">Units Reserved</th>
                <th className="py-3 px-4 text-right">Utilization Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {usageData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {item.name}
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-medium">
                    {item.category}
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {item.location}
                  </td>
                  <td className="py-3 px-4 font-mono tabular-nums">
                    {item.totalQuantity}
                  </td>
                  <td className="py-3 px-4 font-mono tabular-nums font-semibold text-emerald-700">
                    {item.approvedBookings}
                  </td>
                  <td className="py-3 px-4 font-mono tabular-nums">
                    {item.totalUnitsReserved}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-indigo-600 tabular-nums">
                    {item.utilizationScore}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
