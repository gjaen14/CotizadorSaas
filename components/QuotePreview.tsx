
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

  const ITEMS_PER_PAGE = 8;
  const getPageItems = (pageIndex: number) => {
    const start = pageIndex * ITEMS_PER_PAGE;
    return items.slice(start, start + ITEMS_PER_PAGE);
  };

  // --- Design tokens from skill ---
  const colorBrandDark = '#2A221E';
  const colorRowBeige = '#EFEBE7';
  const colorTextPrimary = '#000000';
  const colorTextInverse = '#FFFFFF';

  const fontSerif = "'Playfair Display', serif";
  const fontSans = "'Montserrat', sans-serif";

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
    const d = new Date(dateString);
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div
      ref={containerRef}
      id="print-area"
      className="a4-paper mx-auto relative overflow-hidden bg-white"
      style={{
        fontFamily: fontSans,
        color: colorTextPrimary,
        padding: '5% 8% 5% 8%',
        boxSizing: 'border-box'
      }}
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
          fontFamily: fontSerif, fontSize: '300px',
          color: 'rgba(42, 34, 30, 0.05)', lineHeight: 1,
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
        <div style={{ backgroundColor: 'transparent' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px', color: colorBrandDark, fontFamily: fontSerif }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <strong style={{ fontSize: '11px', letterSpacing: '1px' }}>FECHA</strong>
              <span style={{ fontSize: '14px', fontWeight: 400, marginTop: '2px', fontFamily: fontSans }}>{settings.date}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <strong style={{ fontSize: '11px', letterSpacing: '1px' }}>COTIZACIÓN #</strong>
              <span style={{ fontSize: '14px', fontWeight: 400, marginTop: '2px', fontFamily: fontSans }}>{settings.quoteNumber}</span>
            </div>
          </div>
        </div>
      ), 420, 220, 'titleHeaderGroup')}

      {/* ═══ CLIENT INFO ═══ */}
      {renderDraggable('clientInfo', (
        <div style={{ width: '380px', backgroundColor: 'transparent' }}>
          <p style={{ color: colorBrandDark, fontWeight: 700, fontSize: '12px', marginBottom: '2px' }}>COTIZADO A:</p>
          <h3 style={{ fontFamily: fontSerif, color: colorBrandDark, fontWeight: 800, fontSize: '28px', marginBottom: '10px', lineHeight: 1.1 }}>
            {client.name ? client.name.toUpperCase() : 'NOMBRE DEL CLIENTE'}
          </h3>
          {client.idNumber && (
            <p style={{ fontSize: '14px', marginBottom: '5px' }}>
              <strong style={{ color: colorBrandDark, fontWeight: 700 }}>RUC / ID: </strong>
              {client.idNumber}
            </p>
          )}
          {settings.eventDate && (
            <p style={{ fontSize: '14px', marginBottom: '5px' }}>
              <strong style={{ color: colorBrandDark, fontWeight: 700 }}>Fecha del evento: </strong>
              {formatDate(settings.eventDate)}
            </p>
          )}
          {settings.eventLocation && (
            <p style={{ fontSize: '14px', marginBottom: '5px' }}>
              <strong style={{ color: colorBrandDark, fontWeight: 700 }}>Lugar del evento: </strong>
              {settings.eventLocation}
            </p>
          )}
        </div>
      ), 40, 220)}


      {/* ═══ ITEMS TABLE (CSS Grid) ═══ */}
      {renderDraggable('itemsTable', (
        <div style={{ width: '715px', position: 'relative', backgroundColor: 'transparent' }}>
          {/* Header */}
          <div style={{
            display: 'grid', gridTemplateColumns: '50% 15% 15% 20%',
            backgroundColor: colorBrandDark,
            padding: '10px 12px', marginBottom: '10px',
            fontSize: '13px', letterSpacing: '2px', color: colorTextInverse,
            fontFamily: fontSans,
            fontWeight: 700,
            borderRadius: '4px',
          }}>
            <div>SERVICIO</div>
            <div style={{ textAlign: 'center' }}>PRECIO</div>
            <div style={{ textAlign: 'center' }}>CANT.</div>
            <div style={{ textAlign: 'right' }}>TOTAL</div>
          </div>
          {/* Rows */}
          {getPageItems(currentPageIndex).map((item, idx) => (
            item.isVisible && (
              <div key={item.id} style={{
                display: 'grid', gridTemplateColumns: '50% 15% 15% 20%',
                padding: '12px 12px', fontSize: '13px', color: colorTextPrimary,
                backgroundColor: idx % 2 === 0 ? colorRowBeige : 'transparent',
                borderRadius: '4px',
                fontFamily: fontSans,
              }}>
                <div>{item.description}</div>
                <div style={{ textAlign: 'center' }}>{formatBalboa(item.price)}</div>
                <div style={{ textAlign: 'center' }}>{String(item.quantity).padStart(2, '0')}</div>
                <div style={{ textAlign: 'right', fontWeight: 700 }}>{formatBalboa(item.price * item.quantity)}</div>
              </div>
            )
          ))}
        </div>
      ), 40, 330)}

      {/* ═══ PAYMENT METHODS ═══ */}
      {renderDraggable('paymentSection', (
        <div style={{
          color: colorBrandDark,
          padding: '20px 30px 20px 40px',
          width: '340px',
          backgroundColor: 'transparent',
          fontFamily: fontSans,
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
      ), 40, 755)}

      {/* ═══ FINAL TOTAL BOX ═══ */}
      {currentPageIndex === totalPages - 1 && renderDraggable('totalsBox', (
        <div style={{
          padding: '10px 0px',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'flex-end', width: '230px',
          backgroundColor: 'transparent',
          fontFamily: fontSans,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '13px', marginBottom: '6px', color: colorTextPrimary }}>
            <span>Subtotal</span><span style={{ fontWeight: 600 }}>{formatBalboa(subtotal)}</span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            fontSize: '13px',
            marginBottom: '6px',
            color: colorTextPrimary,
            visibility: taxAmount > 0 ? 'visible' : 'hidden'
          }}>
            <span>{settings.taxName} ({(settings.taxRate * 100).toFixed(0)}%)</span><span style={{ fontWeight: 600 }}>{formatBalboa(taxAmount)}</span>
          </div>
          <div style={{
            color: colorBrandDark,
            fontSize: '28px', fontWeight: 800,
            padding: '12px 0px', marginTop: '12px',
            textAlign: 'right',
            width: '100%',
            backgroundColor: 'transparent',
          }}>{formatBalboa(total)}</div>
        </div>
      ), 490, 740)}

      {/* ═══ CONDITIONS / NOTES ═══ */}
      {currentPageIndex === totalPages - 1 && renderDraggable('notesSection', (
        <div style={{
          width: '650px',
          backgroundColor: 'transparent',
          fontFamily: fontSans,
        }}>
          {settings.notes && (
            <div>
              <h5 style={{
                fontFamily: fontSerif,
                color: colorBrandDark,
                fontSize: '11px',
                letterSpacing: '2px',
                fontWeight: 700,
                marginBottom: '6px',
                textTransform: 'uppercase'
              }}>Términos y Condiciones</h5>
              <p style={{
                fontSize: '9px',
                lineHeight: 1.6,
                textAlign: 'justify' as const,
                color: colorTextPrimary,
                margin: 0,
                opacity: 0.85
              }}>
                {settings.notes.replace(/^CONDICIONES:\s*/i, '')}
              </p>
            </div>
          )}
        </div>
      ), 40, 865)}

      {/* ═══ FOOTER CONTACT ═══ */}
      {renderDraggable('footerContact', (
        <div style={{
          width: '100%', maxWidth: '793px',
          padding: '25px 40px',
          backgroundColor: 'transparent',
          color: colorBrandDark,
          fontFamily: fontSans,
        }}>

          <div style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '15px 25px',
            fontSize: '12px'
          }}>
            {company.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  backgroundColor: colorBrandDark,
                  width: '26px',
                  height: '26px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Phone size={12} style={{ color: '#FFFFFF' }} />
                </div>
                <span>{company.phone}</span>
              </div>
            )}
            {company.email && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  backgroundColor: colorBrandDark,
                  width: '26px',
                  height: '26px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Mail size={12} style={{ color: '#FFFFFF' }} />
                </div>
                <span>{company.email}</span>
              </div>
            )}
            {company.website && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  backgroundColor: colorBrandDark,
                  width: '26px',
                  height: '26px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Globe size={12} style={{ color: '#FFFFFF' }} />
                </div>
                <span>{company.website}</span>
              </div>
            )}
            {company.address && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  backgroundColor: colorBrandDark,
                  width: '26px',
                  height: '26px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <MapPin size={12} style={{ color: '#FFFFFF' }} />
                </div>
                <span>{company.address}</span>
              </div>
            )}
            {company.instagram && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  backgroundColor: colorBrandDark,
                  width: '26px',
                  height: '26px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Instagram size={12} style={{ color: '#FFFFFF' }} />
                </div>
                <span>{company.instagram}</span>
              </div>
            )}
          </div>
        </div>
      ), 0, 980)}

    </div>
  );
};
