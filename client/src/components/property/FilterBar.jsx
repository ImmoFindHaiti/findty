import { Search, SlidersHorizontal } from 'lucide-react';
import useStore from '@/store/useStore';

export default function FilterBar({ filters, onChange }) {
  const { budget, setBudget } = useStore();

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <SlidersHorizontal size={20} className="text-green-600" />
        <h2 className="text-lg font-semibold">Filtres</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            value={filters.type || ''}
            onChange={e => onChange({ ...filters, type: e.target.value || undefined })}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Tous</option>
            <option value="LOCATION">Location</option>
            <option value="VENTE">Achat</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Budget max (HTG)</label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={1000000}
              step={5000}
              value={budget || 0}
              onChange={e => { const v = parseInt(e.target.value); setBudget(v); onChange({ ...filters, budgetMax: v || undefined }); }}
              className="flex-1"
            />
            <input
              type="number"
              value={budget || ''}
              onChange={e => { const v = parseInt(e.target.value); setBudget(v); onChange({ ...filters, budgetMax: v || undefined }); }}
              placeholder="Montant"
              className="w-28 border rounded-lg px-2 py-2 text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
          <input
            type="text"
            value={filters.ville || ''}
            onChange={e => onChange({ ...filters, ville: e.target.value || undefined })}
            placeholder="Ex: Port-au-Prince"
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Chambres min.</label>
          <input
            type="number"
            value={filters.chambres || ''}
            onChange={e => onChange({ ...filters, chambres: parseInt(e.target.value) || undefined })}
            placeholder="2"
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
        </div>
      </div>
    </div>
  );
}
