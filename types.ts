
export interface QuoteItem {
  id: string;
  description: string;
  price: number;
  quantity: number;
  hasTax: boolean; // Apply ITBMS/VAT
  isVisible?: boolean; // New: For draft items that shouldn't appear in print
}

export interface CompanyInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  logoUrl?: string;
  slogan?: string; // New
  ruc?: string; // New: Tax ID/RUC
  contactPerson?: string; // New: Specific contact person name
  instagram?: string; // New
  website?: string; // New
}

export interface ClientInfo {
  name: string;
  idNumber: string; // RUC / CIP
  email: string;
  phone: string;
  type?: string; // New: "Tipo de cliente"
}

export interface ElementPosition {
  x: number;
  y: number;
}

export interface StyleSettings {
  fontSize?: number;     // Tamaño de fuente en px
  fontWeight?: 'normal' | 'bold' | 'lighter';
  color?: string;        // Color del texto (hex o named)
}

export interface TitleHeaderGroup {
  position: ElementPosition;
  style: StyleSettings;
}

export interface QuoteSettings {
  taxName: string; // e.g., "ITBMS", "IVA"
  taxRate: number; // e.g., 0.07 for 7%
  currencySymbol: string;
  themeColor: string;
  quoteNumber: string;
  date: string;
  eventDate?: string; // New
  eventLocation?: string; // New
  paymentInfo?: string; // New: For bank details section
  notes: string; // Used for Conditions
  backgroundImageUrl?: string; // New: Custom background
  backgroundOpacity?: number; // New: Opacity for background
  
  // Layout Settings
  layoutTopMargin?: number; // Deprecated but kept for compatibility, prefer elementPositions.itemsTable.y
  hideHeader?: boolean; // Option to hide text header if background has it

  // Draggable Positions
  elementPositions?: {
    companyInfo?: ElementPosition;
    logo?: ElementPosition;
    clientInfo?: ElementPosition;
    
    // New: Title header group (number + date with styling)
    titleHeaderGroup?: TitleHeaderGroup;
    
    // New independent sections
    itemsTable?: ElementPosition;
    totalsBox?: ElementPosition;
    paymentSection?: ElementPosition;
    notesSection?: ElementPosition;
    footerContact?: ElementPosition;
  }
}

export interface AppState {
  items: QuoteItem[];
  company: CompanyInfo;
  client: ClientInfo;
  settings: QuoteSettings;
}
