
import React, { useState, useEffect } from 'react';
import { AppState, QuoteItem, ElementPosition } from './types';
import { QuoteItemRow } from './components/QuoteItemRow';
import { QuotePreview } from './components/QuotePreview';
import { Printer, Plus, Settings, User, Building, Palette, LayoutTemplate, Image as ImageIcon, ArrowUpDown, Move, Calendar, MapPin, CreditCard, Globe, Instagram, PenSquare, Eye } from 'lucide-react';

const INITIAL_STATE: AppState = {
  items: [
    { id: '1', description: 'Conferencias de Impacto', price: 500.00, quantity: 1, hasTax: true, isVisible: true }
  ],
  company: {
    name: 'Deisy Mavares',
    email: 'info@deisymavares.com',
    phone: '',
    address: '',
    slogan: '',
    ruc: '',
    contactPerson: '',
    website: 'www.deisymavares.com',
    instagram: '@DeisyMavares',
    logoUrl: '' // Placeholder compatible style
  },
  client: {
    name: '',
    idNumber: '',
    email: '',
    phone: '',
    type: '',
  },
  settings: {
    taxName: 'ITBMS',
    taxRate: 0.07,
    currencySymbol: 'B/.',
    themeColor: '#2A221E', // Color-Brand-Dark from UI/UX Forensic Invoice skill
    quoteNumber: '2431 - 25',
    date: new Date().toISOString().split('T')[0],
    eventDate: '',
    eventLocation: '',
    paymentInfo: 'ACH:\nBanco General\nCta. de Ahorros: 0423017582417\nYAPPY: 6074-1047',
    notes: 'CONDICIONES: Cotización válida por 15 días. Se debe abonar el 50% para reserva de fecha, y se cancela 2 días antes del evento. NO HACEMOS DEVOLUCIONES, ni cambios de productos elegidos luego de aprobada la cotización. Se podrá re agendar fecha según disponibilidad. La duración del alquiler es de 24 horas.',
    backgroundImageUrl: 'https://deisymavares.com/CotizacionStandar.png',
    backgroundOpacity: 100,
    layoutTopMargin: 300,
    hideHeader: false,
    elementPositions: {
      titleHeaderGroup: {
        position: { x: 480, y: 150 },
        style: { fontSize: 12, color: '#ffffff' }
      },
      clientInfo: { x: 40, y: 175 },
      logo: { x: 350, y: 40 },
      itemsTable: { x: 40, y: 330 },
      paymentSection: { x: 0, y: 715 },  // Gold bg, starts from left edge
      totalsBox: { x: 460, y: 750 },     // Beige box, right side
      notesSection: { x: 40, y: 870 },
      footerContact: { x: 100, y: 940 }    // Full width beige footer
    }
  }
};

export default function App() {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [activeTab, setActiveTab] = useState<'items' | 'client' | 'company' | 'settings'>('items');
  const [isGeneratingNotes, setIsGeneratingNotes] = useState(false);
  const [isLayoutMode, setIsLayoutMode] = useState(false);
  const [selectedItemsPage, setSelectedItemsPage] = useState(0); // Page index (0, 1, 2, ...)

  // Mobile responsive: detect viewport and toggle views
  const [isMobile, setIsMobile] = useState(false);
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => setIsMobile(e.matches);
    handleChange(mq); // initial check
    mq.addEventListener('change', handleChange as any);
    return () => mq.removeEventListener('change', handleChange as any);
  }, []);

  // Pagination: 8 items per page
  const ITEMS_PER_PAGE = 8;
  const totalPages = Math.max(1, Math.ceil(state.items.length / ITEMS_PER_PAGE));
  const getPageItems = (pageIndex: number) => {
    const start = pageIndex * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return state.items.slice(start, end);
  };

  // Handlers
  const updateItem = (id: string, field: keyof QuoteItem, value: any) => {
    setState(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const addItem = () => {
    const newItem: QuoteItem = {
      id: Date.now().toString(),
      description: '',
      price: 0,
      quantity: 1,
      hasTax: true,
      isVisible: true
    };
    setState(prev => ({ ...prev, items: [...prev.items, newItem] }));
    // Auto-advance to the page with the new item
    const newTotalPages = Math.ceil((state.items.length + 1) / ITEMS_PER_PAGE);
    setSelectedItemsPage(newTotalPages - 1);
  };

  const deleteItem = (id: string) => {
    setState(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
    // Recalculate pages and adjust selectedItemsPage if needed
    const newItemsCount = state.items.length - 1; // -1 because we're deleting one
    const newTotalPages = Math.max(1, Math.ceil(newItemsCount / ITEMS_PER_PAGE));
    if (selectedItemsPage >= newTotalPages) {
      setSelectedItemsPage(Math.max(0, newTotalPages - 1));
    }
  };

  const moveItem = (id: string, direction: 'up' | 'down') => {
    const index = state.items.findIndex(i => i.id === id);
    if (index < 0) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === state.items.length - 1) return;

    const newItems = [...state.items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    // Swap
    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];

    setState(prev => ({ ...prev, items: newItems }));
  };

  const updateSettings = (field: keyof typeof INITIAL_STATE.settings, value: any) => {
    setState(prev => ({ ...prev, settings: { ...prev.settings, [field]: value } }));
  };

  const updateCompany = (field: keyof typeof INITIAL_STATE.company, value: any) => {
    setState(prev => ({ ...prev, company: { ...prev.company, [field]: value } }));
  };

  const updateClient = (field: keyof typeof INITIAL_STATE.client, value: any) => {
    setState(prev => ({ ...prev, client: { ...prev.client, [field]: value } }));
  };

  const updateElementPosition = (key: string, pos: ElementPosition) => {
    setState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        elementPositions: {
          ...prev.settings.elementPositions,
          [key]: pos
        }
      }
    }));
  };

  const handlePrint = () => {
    setIsLayoutMode(false);
    setTimeout(() => window.print(), 100);
  };

  const handleMagicNotes = async () => {
    setIsGeneratingNotes(true);
    // AI features removed; you can add backend call here if needed
    setIsGeneratingNotes(false);
  };



  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans">

      {/* Left Sidebar / Editor (No Print) */}
      <div id="no-print-area" className={`w-full md:w-[450px] bg-slate-50 border-r border-slate-200 h-screen overflow-y-auto flex flex-col shadow-xl z-10 ${isMobile && mobileView !== 'editor' ? 'hidden' : ''}`}>

        <div className="p-6 bg-white border-b border-slate-200 sticky top-0 z-20">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <LayoutTemplate className="text-brand-600" />
            Editor de Cotización
          </h2>
          <p className="text-sm text-slate-500 mt-1">Versión MVP (React + Tailwind)</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-white sticky top-[85px] z-10">
          <button onClick={() => setActiveTab('items')} className={`flex-1 py-3 text-sm font-medium border-b-2 ${activeTab === 'items' ? 'border-brand-500 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Items</button>
          <button onClick={() => setActiveTab('client')} className={`flex-1 py-3 text-sm font-medium border-b-2 ${activeTab === 'client' ? 'border-brand-500 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Cliente</button>
          <button onClick={() => setActiveTab('company')} className={`flex-1 py-3 text-sm font-medium border-b-2 ${activeTab === 'company' ? 'border-brand-500 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Empresa</button>
          <button onClick={() => setActiveTab('settings')} className={`flex-1 py-3 text-sm font-medium border-b-2 ${activeTab === 'settings' ? 'border-brand-500 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Ajustes</button>
        </div>

        <div className="p-6 space-y-6 flex-grow">

          {/* ITEMS TAB */}
          {activeTab === 'items' && (
            <div className="space-y-4">
              {/* Información Principal */}
              <div className="bg-slate-100 p-4 rounded-lg flex gap-4 mb-4">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Nº de Cotización</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded bg-white"
                    value={state.settings.quoteNumber}
                    onChange={e => updateSettings('quoteNumber', e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Fecha Emisión</label>
                  <input
                    type="date"
                    className="w-full p-2 border rounded bg-white"
                    value={state.settings.date}
                    onChange={e => updateSettings('date', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center mb-2 mt-4">
                <h3 className="font-semibold text-slate-700">Productos / Servicios</h3>
                <button onClick={addItem} className="flex items-center gap-1 text-xs bg-brand-100 text-brand-700 px-3 py-1.5 rounded-full hover:bg-brand-200 transition-colors font-medium">
                  <Plus size={14} /> Agregar
                </button>
              </div>

              {/* Page Tabs for Items */}
              {totalPages > 1 && (
                <div className="flex gap-1 mb-4 flex-wrap">
                  {Array.from({ length: totalPages }).map((_, pageIdx) => (
                    <button
                      key={pageIdx}
                      onClick={() => setSelectedItemsPage(pageIdx)}
                      className={`px-3 py-1 text-xs font-medium rounded transition-colors ${selectedItemsPage === pageIdx
                        ? 'bg-brand-600 text-white'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                        }`}
                    >
                      Página {pageIdx + 1}
                    </button>
                  ))}
                </div>
              )}

              {getPageItems(selectedItemsPage).map((item, index) => {
                const globalIndex = selectedItemsPage * ITEMS_PER_PAGE + index;
                return (
                  <QuoteItemRow
                    key={item.id}
                    item={item}
                    currencySymbol={state.settings.currencySymbol}
                    isFirst={globalIndex === 0}
                    isLast={globalIndex === state.items.length - 1}
                    onChange={updateItem}
                    onDelete={deleteItem}
                    onMove={moveItem}
                  />
                );
              })}
            </div>
          )}

          {/* CLIENT TAB */}
          {activeTab === 'client' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-700 mb-2">
                <User size={18} />
                <h3 className="font-semibold">Datos del Cliente</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Nombre</label>
                  <input type="text" className="w-full p-2 border rounded" value={state.client.name} onChange={e => updateClient('name', e.target.value)} placeholder="Ej. Juan Pérez" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">RUC / ID</label>
                  <input type="text" className="w-full p-2 border rounded" value={state.client.idNumber} onChange={e => updateClient('idNumber', e.target.value)} placeholder="Ej. 8-123-456" />
                </div>
              </div>

              {/* Datos del Evento */}
              <div className="bg-slate-100 p-4 rounded-lg space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar size={16} className="text-slate-500" />
                  <span className="text-sm font-medium">Datos del Evento</span>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Fecha del Evento</label>
                  <input type="date" className="w-full p-2 border rounded" value={state.settings.eventDate || ''} onChange={e => updateSettings('eventDate', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Lugar del Evento</label>
                  <div className="flex items-center gap-1">
                    <MapPin size={14} className="text-slate-400" />
                    <input type="text" className="w-full p-2 border rounded" value={state.settings.eventLocation || ''} onChange={e => updateSettings('eventLocation', e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* COMPANY TAB */}
          {activeTab === 'company' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-700 mb-2">
                <Building size={18} />
                <h3 className="font-semibold">Mi Empresa</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Nombre Empresa</label>
                  <input type="text" className="w-full p-2 border rounded" value={state.company.name} onChange={e => updateCompany('name', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Eslogan</label>
                  <input type="text" className="w-full p-2 border rounded" value={state.company.slogan || ''} onChange={e => updateCompany('slogan', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Persona de Contacto</label>
                  <input type="text" className="w-full p-2 border rounded" value={state.company.contactPerson || ''} onChange={e => updateCompany('contactPerson', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">RUC Empresa</label>
                  <input type="text" className="w-full p-2 border rounded" value={state.company.ruc || ''} onChange={e => updateCompany('ruc', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Dirección</label>
                  <textarea rows={2} className="w-full p-2 border rounded" value={state.company.address} onChange={e => updateCompany('address', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Logo URL</label>
                  <input type="text" className="w-full p-2 border rounded" value={state.company.logoUrl || ''} onChange={e => updateCompany('logoUrl', e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Website</label>
                    <input type="text" className="w-full p-2 border rounded" value={state.company.website || ''} onChange={e => updateCompany('website', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Instagram</label>
                    <input type="text" className="w-full p-2 border rounded" value={state.company.instagram || ''} onChange={e => updateCompany('instagram', e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-700 mb-2">
                <Settings size={18} />
                <h3 className="font-semibold">Configuración & Evento</h3>
              </div>

              <button
                onClick={() => setIsLayoutMode(!isLayoutMode)}
                className={`w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all font-bold ${isLayoutMode ? 'bg-orange-100 text-orange-700 border-2 border-orange-300 animate-pulse' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                <Move size={18} />
                {isLayoutMode ? '🔓 Terminar Edición (Bloquear)' : '🔒 Mover Elementos (Desbloquear)'}
              </button>

              {isLayoutMode && (
                <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded border border-orange-200">
                  Modo Edición Activado: Arrastra las cajas naranjas en la vista previa para acomodar tu diseño sobre el fondo.
                </div>
              )}



              {/* Payment Info */}
              <div className="bg-slate-100 p-4 rounded-lg space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <CreditCard size={16} className="text-slate-500" />
                  <span className="text-sm font-medium">Métodos de Pago</span>
                </div>
                <textarea
                  rows={4}
                  className="w-full p-2 border rounded text-sm"
                  value={state.settings.paymentInfo || ''}
                  onChange={e => updateSettings('paymentInfo', e.target.value)}
                  placeholder="ACH, Yappy, etc..."
                />
              </div>

              {/* Visual Settings */}
              <div className="bg-slate-100 p-4 rounded-lg space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <Palette size={16} className="text-slate-500" />
                  <span className="text-sm font-medium">Estilo</span>
                </div>
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {['#2A221E', '#B39260', '#2563eb', '#dc2626', '#000000'].map(color => (
                    <button
                      key={color}
                      onClick={() => updateSettings('themeColor', color)}
                      className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${state.settings.themeColor === color ? 'border-slate-800 scale-110' : 'border-white'}`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>

                {/* Background Image Upload */}
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">URL Fondo (Imagen)</label>
                  <input type="text" className="w-full p-2 border rounded text-xs" placeholder="https://..." value={state.settings.backgroundImageUrl || ''} onChange={e => updateSettings('backgroundImageUrl', e.target.value)} />
                  <div className="mt-2 flex items-center gap-2">
                    <label className="text-xs text-slate-500">o subir archivo desde tu equipo:</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files && e.target.files[0];
                        if (!f) return;
                        const reader = new FileReader();
                        reader.onload = () => {
                          const result = reader.result as string;
                          updateSettings('backgroundImageUrl', result);
                        };
                        reader.readAsDataURL(f);
                      }}
                      className="text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => updateSettings('backgroundImageUrl', '')}
                      className="text-xs text-red-600 hover:underline ml-2"
                    >Quitar fondo</button>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">Consejo: para imprimir con plantilla activa la opción "Imprimir fondos/colores" en las opciones de tu impresora/visor PDF.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1 flex justify-between">
                    Opacidad Fondo
                    <span>{state.settings.backgroundOpacity ?? 100}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    className="w-full"
                    value={state.settings.backgroundOpacity ?? 100}
                    onChange={e => updateSettings('backgroundOpacity', parseInt(e.target.value))}
                  />
                </div>
                <div className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    id="hideHeader"
                    checked={state.settings.hideHeader}
                    onChange={(e) => updateSettings('hideHeader', e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="hideHeader" className="text-xs text-slate-600">Ocultar Encabezado de Texto</label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Condiciones / Notas</label>
                <textarea
                  rows={6}
                  className="w-full p-2 border rounded text-xs"
                  value={state.settings.notes}
                  onChange={e => updateSettings('notes', e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Print Button */}
        <div className={`p-6 border-t border-slate-200 bg-white sticky z-20 ${isMobile ? 'bottom-16' : 'bottom-0'}`}>
          <button
            onClick={handlePrint}
            className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-lg flex items-center justify-center gap-2 font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            <Printer size={20} />
            Imprimir / Guardar PDF
          </button>
        </div>
      </div>

      {/* Right Preview Area */}
      <div className={`flex-1 bg-slate-200 h-screen overflow-y-auto flex justify-center items-start ${isMobile ? (mobileView === 'preview' ? 'p-2 pb-20' : 'hidden') : 'p-8'}`}>
        <div className={`shadow-2xl transition-all ${isLayoutMode ? 'scale-[0.95] ring-4 ring-orange-300' : ''} ${isMobile ? 'w-full max-w-[100vw] overflow-x-auto' : ''}`}>
          <QuotePreview
            data={state}
            isLayoutMode={isLayoutMode}
            onPositionChange={updateElementPosition}
            currentPageIndex={selectedItemsPage}
            totalPages={totalPages}
            isForPrint={false}
          />
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_12px_rgba(0,0,0,0.1)] z-50 flex h-16">
          <button
            onClick={() => setMobileView('editor')}
            className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${mobileView === 'editor'
              ? 'text-brand-600 bg-brand-50'
              : 'text-slate-500 hover:text-slate-700'
              }`}
          >
            <PenSquare size={20} />
            <span className="text-xs font-medium">Editar</span>
          </button>
          <button
            onClick={() => setMobileView('preview')}
            className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${mobileView === 'preview'
              ? 'text-brand-600 bg-brand-50'
              : 'text-slate-500 hover:text-slate-700'
              }`}
          >
            <Eye size={20} />
            <span className="text-xs font-medium">Preview</span>
          </button>
        </div>
      )}

      {/* Hidden Print Area - All Pages */}
      <div id="print-all-pages" style={{ display: 'none' }}>
        {Array.from({ length: totalPages }).map((_, pageIdx) => (
          <div key={pageIdx}>
            <QuotePreview
              data={state}
              isLayoutMode={false}
              onPositionChange={updateElementPosition}
              currentPageIndex={pageIdx}
              totalPages={totalPages}
              isForPrint={true}
            />
            {pageIdx < totalPages - 1 && <div style={{ pageBreakAfter: 'always' }} />}
          </div>
        ))}
      </div>

    </div>
  );
}
