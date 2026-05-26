import React from 'react';
import { QuoteItem } from '../types';
import { Trash2, Eye, EyeOff } from 'lucide-react';

interface Props {
  item: QuoteItem;
  currencySymbol: string;
  onChange: (id: string, field: keyof QuoteItem, value: any) => void;
  onDelete: (id: string) => void;
}

export const QuoteItemRow: React.FC<Props> = ({ item, currencySymbol, onChange, onDelete }) => {

  const isVisible = item.isVisible !== false; // Default to true if undefined

  return (
    <div className={`grid grid-cols-12 gap-2 mb-2 items-center bg-white p-2 rounded-lg shadow-sm border ${isVisible ? 'border-slate-200' : 'border-slate-200 bg-slate-50 opacity-60'}`}>
      {/* Description */}
      <div className="col-span-12 flex gap-1">
        <div className="relative w-full">
          <input
            type="text"
            value={item.description}
            onChange={(e) => onChange(item.id, 'description', e.target.value)}
            placeholder="Descripción del producto..."
            className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-brand-500 outline-none text-sm"
          />
          
        </div>
      </div>

      {/* Price */}
      <div className="col-span-5">
        <div className="relative">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">{currencySymbol}</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={item.price}
            onChange={(e) => onChange(item.id, 'price', parseFloat(e.target.value) || 0)}
            className="w-full p-2 pl-6 border border-slate-300 rounded focus:ring-2 focus:ring-brand-500 outline-none text-sm text-right"
          />
        </div>
      </div>

      {/* Quantity */}
      <div className="col-span-2">
        <input
          type="number"
          min="1"
          value={item.quantity}
          onChange={(e) => onChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
          className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-brand-500 outline-none text-sm text-center"
        />
      </div>

      {/* Tax Checkbox */}
      <div className="col-span-1 flex justify-center">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={item.hasTax}
            onChange={(e) => onChange(item.id, 'hasTax', e.target.checked)}
            className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
          />
          <span className="text-xs text-slate-500 hidden md:inline">I.</span>
        </label>
      </div>

      {/* Actions */}
      <div className="col-span-2 flex justify-end gap-1">
        <button
          onClick={() => onChange(item.id, 'isVisible', !isVisible)}
          className={`p-1.5 rounded transition-colors ${isVisible ? 'text-slate-400 hover:text-brand-600' : 'text-slate-400 hover:text-brand-600'}`}
          title={isVisible ? "Ocultar en impresión" : "Mostrar en impresión"}
        >
          {isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
          title="Eliminar"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};