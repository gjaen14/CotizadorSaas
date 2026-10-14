
import React, { useRef, useState, useEffect } from 'react';
import { AppState, ElementPosition } from '../types';
import { Mail, Phone, MapPin, Globe, Instagram } from 'lucide-react';

interface Props {
  data: AppState;
  isLayoutMode?: boolean;
  onPositionChange?: (key: string, pos: ElementPosition) => void;
  currentPageIndex?: number;
  totalPages?: number;
  isForPrint?: boolean;
}

export const QuotePreview: React.FC<Props> = ({
  data,
  isLayoutMode,
  onPositionChange,
  currentPageIndex = 0,
  totalPages = 1,
  isForPrint = false
}) => {
  const { items, company, client, settings } = data;
  const containerRef = useRef<HTMLDivElement>(null);

  const ITEMS_PER_PAGE = 7;
  const getPageItems = (pageIndex: number) => {
    const start = pageIndex * ITEMS_PER_PAGE;
    return items.slice(start, start + ITEMS_PER_PAGE);
  };

  // --- Design tokens from skill ---
  const goldPrimary = settings.themeColor || '#B39260';
  const beigeSecondary = '#E5DAC8';
  const brownText = '#9E866B';

  // --- Dragging ---
  const [dragTarget, setDragTarget] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent, key: string) => {
    if (!isLayoutMode || !containerRef.current) return;
    e.preventDefault();
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setDragTarget(key);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragTarget || !containerRef.current || !onPositionChange) return;
      const r = containerRef.current.getBoundingClientRect();
      onPositionChange(dragTarget, {
        x: Math.round(e.clientX - r.left - dragOffset.x),
        y: Math.round(e.clientY - r.top - dragOffset.y),
      });
    };
    const handleMouseUp = () => setDragTarget(null);
    if (dragTarget) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragTarget, dragOffset, onPositionChange]);

  // --- Calculations ---
  const visibleItems = items.filter(item => item.isVisible !== false);
  const formatBalboa = (amount: number) => {
    const n = new Intl.NumberFormat('es-PA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
    return `B/. ${n}`;
  };

  const subtotal = visibleItems.reduce((a, i) => a + i.price * i.quantity, 0);
  const taxAmount = visibleItems.reduce((a, i) => i.hasTax ? a + i.price * i.quantity * settings.taxRate : a, 0);
  const total = subtotal + taxAmount;

  // --- Positions ---
  const pos = settings.elementPositions || {};
  const getPos = (key: string, defX: number, defY: number) => {
    const p = (pos as any)[key];
    if (p && typeof p === 'object' && 'position' in p) return p.position || { x: defX, y: defY };
    return p || { x: defX, y: defY };
  };
  const getStyle = (key: string) => {
    const p = (pos as any)[key];
    if (p && typeof p === 'object' && 'style' in p) {
      return {
        fontSize: p.style.fontSize ? `${p.style.fontSize}px` : undefined,
        fontWeight: p.style.fontWeight || undefined,
        color: p.style.color || undefined
      };
    }
    return {};
  };

  const renderDraggable = (key: string, content: React.ReactNode, defaultX: number, defaultY: number, className: string = '') => {
    const p = getPos(key, defaultX, defaultY);
    const customStyle = getStyle(key);
    return (
      <div
        onMouseDown={(e) => handleMouseDown(e, key)}
        style={{
          position: 'absolute', left: p.x, top: p.y,
          cursor: isLayoutMode ? 'grab' : 'default',
          zIndex: isLayoutMode ? 50 : 20,
          ...customStyle
        }}
        className={`${className} ${isLayoutMode ? 'ring-2 ring-orange-500 ring-dashed bg-white/50 hover:bg-white/90' : ''}`}
        data-debug-id={key}
      >
        {isLayoutMode && (
          <div className="absolute -top-6 left-0 bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-t font-bold uppercase pointer-events-none whitespace-nowrap z-50">
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </div>
        )}
        {content}
      </div>
    );
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    const parts = dateString.split('T')[0].split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts.map(Number);
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        const d = new Date(year, month - 1, day);
        return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
      }
    }
    const d = new Date(dateString);
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div
      ref={containerRef}
      id="print-area"
      className="a4-paper mx-auto relative overflow-hidden bg-white"
      style={{ fontFamily: "'Montserrat', sans-serif", color: brownText }}
      data-v="2.1-transparent"
    >
      {/* Layout Mode Grid */}
      {isLayoutMode && (
        <div className="absolute inset-0 z-50 pointer-events-none opacity-20"
          style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}
        />
      )}

      {/* Background Image */}
      {settings.backgroundImageUrl && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img src={settings.backgroundImageUrl} alt="Background" className="w-full h-full object-cover"
            style={{ opacity: (settings.backgroundOpacity || 10) / 100 }} />
        </div>
      )}

      {/* Watermark "PE" text */}
      {!settings.backgroundImageUrl && (
        <div className="absolute z-0 pointer-events-none select-none" style={{
          top: '45%', left: '50%', transform: 'translate(-50%, -50%)',
          fontFamily: "'Playfair Display', serif", fontSize: '300px',
          color: 'rgba(179, 146, 96, 0.05)', lineHeight: 1,
        }}>PE</div>
      )}

      {/* Logo Image Watermark (when bg image is absent) */}
      {company.logoUrl && !settings.backgroundImageUrl && (
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-[0.05]">
          <img src={company.logoUrl} alt="Watermark" className="w-[500px] h-[500px] object-contain grayscale" />
        </div>
      )}

      {/* ═══ HEADER: Quote # + Date ═══ */}
      {!settings.hideHeader && renderDraggable('titleHeaderGroup', (
        <div style={{ width: '340px', backgroundColor: 'transparent' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', padding: '4px 16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <strong style={{ fontSize: '12px', letterSpacing: '1px' }}>COTIZACIÓN #</strong>
              <span style={{ fontSize: '15px', fontWeight: 400, marginTop: '2px' }}>{settings.quoteNumber}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <strong style={{ fontSize: '12px', letterSpacing: '1px' }}>FECHA</strong>
              <span style={{ fontSize: '15px', fontWeight: 400, marginTop: '2px' }}>{settings.date}</span>
            </div>
          </div>
        </div>
      ), 420, 140, 'titleHeaderGroup')}

      {/* ═══ CLIENT INFO ═══ */}
      {renderDraggable('clientInfo', (
        <div style={{ width: '420px', backgroundColor: 'transparent' }}>
          <p style={{ color: '#CFC0A8', fontWeight: 700, fontSize: '10.5px', letterSpacing: '0.5px', marginBottom: '1px' }}>COTIZADO A:</p>
          <h3 style={{ color: goldPrimary, fontWeight: 800, fontSize: '22px', marginBottom: '5px', lineHeight: 1.15 }}>
            {client.name ? client.name.toUpperCase() : 'NOMBRE DEL CLIENTE'}
          </h3>
          <div style={{ fontSize: '11.5px', lineHeight: 1.35, color: brownText, display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {client.idNumber && (
              <p style={{ margin: 0 }}>
                <strong style={{ color: '#CFC0A8', fontWeight: 700 }}>RUC / ID: </strong>
                {client.idNumber}
              </p>
            )}
            {client.phone && (
              <p style={{ margin: 0 }}>
                <strong style={{ color: '#CFC0A8', fontWeight: 700 }}>Teléfono: </strong>
                {client.phone}
              </p>
            )}
            {client.email && (
              <p style={{ margin: 0 }}>
                <strong style={{ color: '#CFC0A8', fontWeight: 700 }}>Email: </strong>
                {client.email}
              </p>
            )}
            {settings.eventDate && (
              <p style={{ margin: 0 }}>
                <strong style={{ color: '#CFC0A8', fontWeight: 700 }}>Fecha del evento: </strong>
                {formatDate(settings.eventDate)}
              </p>
            )}
            {settings.eventLocation && (
              <p style={{ margin: 0 }}>
                <strong style={{ color: '#CFC0A8', fontWeight: 700 }}>Lugar del evento: </strong>
                {settings.eventLocation}
              </p>
            )}
          </div>
        </div>
      ), 40, 205)}

      {/* ═══ GRAN TOTAL PILL ═══ */}
      {renderDraggable('companyInfo', (
        <div style={{
          color: '#fff',
          padding: '15px 30px',
          display: 'flex', alignItems: 'center',
          backgroundColor: 'transparent',
        }}>
          <div style={{
            fontSize: '10px', fontWeight: 700, textAlign: 'right',
            marginRight: '15px', paddingRight: '15px',
            borderRight: '2px solid #fff', lineHeight: 1.3,
          }}>GRAN<br />TOTAL</div>
          <div style={{ fontSize: '28px', fontWeight: 800 }}>{formatBalboa(total)}</div>
        </div>
      ), 480, 240)}

      {/* ═══ ITEMS TABLE (CSS Grid) ═══ */}
      {renderDraggable('itemsTable', (
        <div style={{ width: '715px', position: 'relative', backgroundColor: 'transparent' }}>
          {/* Header */}
          <div style={{
            display: 'grid', gridTemplateColumns: '40% 15% 15% 20%',
            borderBottom: `2px solid ${goldPrimary}`,
            paddingBottom: '10px', marginBottom: '10px',
            fontSize: '14px', letterSpacing: '2px', color: goldPrimary,
          }}>
            <div>SERVICIO</div>
            <div style={{ textAlign: 'center' }}>CTD.</div>
            <div style={{ textAlign: 'center' }}>PRECIO</div>
            <div style={{ textAlign: 'right' }}>TOTAL</div>
          </div>
          {/* Rows */}
          {getPageItems(currentPageIndex).map(item => (
            item.isVisible && (
              <div key={item.id} style={{
                display: 'grid', gridTemplateColumns: '40% 15% 15% 20%',
                padding: '15px 0', fontSize: '13px', color: brownText,
              }}>
                <div>{item.description}</div>
                <div style={{ textAlign: 'center' }}>{String(item.quantity).padStart(2, '0')}</div>
                <div style={{ textAlign: 'center' }}>{formatBalboa(item.price)}</div>
                <div style={{ textAlign: 'right', fontWeight: 700 }}>{formatBalboa(item.price * item.quantity)}</div>
              </div>
            )
          ))}
        </div>
      ), 40, 365)}

      {/* ═══ PAYMENT METHODS ═══ */}
      {renderDraggable('paymentSection', (
        <div style={{
          color: '#fff',
          padding: '20px 30px 20px 40px',
          width: '340px',
          backgroundColor: 'transparent',
        }}>
          <h4 style={{ fontSize: '14px', marginBottom: '5px', fontWeight: 700 }}>Métodos de pago:</h4>
          {settings.paymentInfo && (
            <div style={{ fontSize: '11px', lineHeight: 1.4, whiteSpace: 'pre-wrap' }}>
              {settings.paymentInfo.split(/(\bACH\b|\bCta\. de Ahorros\b|\bYAPPY\b)/gi).map((part, i) => (
                /ACH|Cta\. de Ahorros|YAPPY/i.test(part) ? <strong key={i}>{part}</strong> : part
              ))}
            </div>
          )}
        </div>
      ), 0, 785)}

      {/* ═══ FINAL TOTAL BOX ═══ */}
      {currentPageIndex === totalPages - 1 && renderDraggable('totalsBox', (
        <div style={{
          padding: '10px',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center', width: '260px',
          backgroundColor: 'transparent',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '70%', fontSize: '13px', marginBottom: '4px', color: brownText }}>
            <span>Subtotal</span><span>{formatBalboa(subtotal)}</span>
          </div>
          {taxAmount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '70%', fontSize: '13px', marginBottom: '8px', color: brownText }}>
              <span>{settings.taxName} ({(settings.taxRate * 100).toFixed(0)}%)</span><span>{formatBalboa(taxAmount)}</span>
            </div>
          )}
          <div style={{
            color: '#fff',
            fontSize: '28px', fontWeight: 800,
            padding: '10px 30px', marginTop: '45px',
            backgroundColor: 'transparent',
          }}>{formatBalboa(total)}</div>
        </div>
      ), 530, 740)}

      {/* ═══ CONDITIONS / NOTES ═══ */}
      {currentPageIndex === totalPages - 1 && renderDraggable('notesSection', (
        <div style={{
          width: '715px', fontSize: '9px', lineHeight: 1.5,
          textAlign: 'justify' as const, color: brownText,
          backgroundColor: 'transparent',
        }}>
          {settings.notes && (
            <p>
              {settings.notes.startsWith('CONDICIONES:') ? (
                <><strong>CONDICIONES:</strong>{settings.notes.substring('CONDICIONES:'.length)}</>
              ) : (
                <><strong>CONDICIONES: </strong>{settings.notes}</>
              )}
            </p>
          )}
        </div>
      ), 40, 870)}

      {/* ═══ FOOTER CONTACT ═══ */}
      {renderDraggable('footerContact', (
        <div style={{
          width: '100%', maxWidth: '793px',
          padding: '30px 40px',
          backgroundColor: 'transparent',
        }}>
          <h4 style={{ color: goldPrimary, fontSize: '14px', fontWeight: 800, marginBottom: '20px', marginLeft: '10px' }}>
            CONTACTO:
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px 10px', fontSize: '13px' }}>
            {company.email && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={16} style={{ color: brownText, flexShrink: 0 }} /><span>{company.email}</span>
              </div>
            )}
            {company.website && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Globe size={16} style={{ color: brownText, flexShrink: 0 }} /><span>{company.website}</span>
              </div>
            )}
            {company.address && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={16} style={{ color: brownText, flexShrink: 0 }} /><span>{company.address}</span>
              </div>
            )}
            {company.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={16} style={{ color: brownText, flexShrink: 0 }} /><span>{company.phone}</span>
              </div>
            )}
            {company.instagram && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', gridColumn: '1 / -1', justifyContent: 'center', marginTop: '10px' }}>
                <Instagram size={16} style={{ color: brownText, flexShrink: 0 }} /><span>{company.instagram}</span>
              </div>
            )}
          </div>
        </div>
      ), 0, 960)}

    </div>
  );
};
