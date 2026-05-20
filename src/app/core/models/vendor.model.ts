// User session model
export interface UserSession {
  lifnr: string;
}

// Profile model (VendorProfileSet)
export interface VendorProfile {
  Lifnr: string;
  Name1: string;
  City: string;
  Country: string;
  Company: string;
  ReconAcc: string;
  Street: string;
  PostCode?: string;
  Phone?: string;
  Email?: string;
}

// RFQ model (VendorRFQSet)
export interface VendorRFQ {
  Lifnr: string;
  Ebeln: string; // RFQ Number
  Bsart: string; // Type
  Bedat: string; // Date
  // Add other fields as necessary from OData response
  Ebelp?: string; // Item Number (EBELP)
  Matnr?: string; // Material (MATNR)
  Txz01?: string; // Item Description (TXZ01)
  Menge?: string | number; // Quantity (MENGE)
  Meins?: string; // Unit (MEINS)
  EBELP?: string; // UPPERCASE support
  MATNR?: string; // UPPERCASE support
  TXZ01?: string; // UPPERCASE support
  MENGE?: string | number; // UPPERCASE support
  MEINS?: string; // UPPERCASE support
}

// PO model (VendorPOSet)
export interface VendorPO {
  Lifnr: string;
  Ebeln: string; // PO Number
  Bedat: string; // Date
  Netwr: number; // Amount
  Waers: string; // Currency
  Ebelp?: string; // Item Number (EBELP)
  Matnr?: string; // Material (MATNR)
  Txz01?: string; // Item Description (TXZ01)
  Menge?: string | number; // Quantity (MENGE)
  Meins?: string; // Unit (MEINS)
  EBELP?: string; // UPPERCASE support
  MATNR?: string; // UPPERCASE support
  TXZ01?: string; // UPPERCASE support
  MENGE?: string | number; // UPPERCASE support
  MEINS?: string; // UPPERCASE support
}

// GR model (VendorGRSet)
export interface VendorGR {
  Lifnr: string;
  Mblnr: string; // Material Doc
  Mjahr: string; // Year
  Ebeln: string; // PO Number
  Budat: string; // Posting Date
  Matnr?: string; // Material (MATNR)
  Txz01?: string; // Item Description (TXZ01)
  Menge?: string | number; // Quantity (MENGE)
  Meins?: string; // Unit (MEINS)
  MATNR?: string; // UPPERCASE support
  TXZ01?: string; // UPPERCASE support
  MENGE?: string | number; // UPPERCASE support
  MEINS?: string; // UPPERCASE support
}

// Invoice model (VendorInvoiceSet)
export interface VendorInvoice {
  Lifnr: string;
  Belnr: string;  // Invoice Number
  Wrbtr: number;  // Amount
  Waers: string;  // Currency
  Budat?: string; // Posting Date (primary from API)
  Bldat?: string; // Document Date (fallback)
}

// Payment model (VendorPaymentSet)
export interface VendorPayment {
  Lifnr: string;
  Belnr: string;  // Document Number
  Gjahr?: string; // Fiscal Year
  Budat: string;  // Posting Date
  Wrbtr: number;  // Amount
  Waers: string;  // Currency
  // Legacy fallback fields (kept for compatibility)
  Augbl?: string;
  Augdt?: string;
  Bldat?: string;
}

// Aging model (VendorAgingSet)
export interface VendorAging {
  Lifnr: string;
  Belnr: string;
  Budat: string;    // Posting Date
  DueDate: string;  // Due Date
  AgingDays: number; // Days outstanding
  Amount: number;
  Waers: string;    // Currency
}

// Memo model (VendorMemoSet)
export interface VendorMemo {
  Lifnr: string;
  Belnr: string; // Document Number
  Gjahr: string; // Fiscal Year
  Budat: string; // Posting Date
  Dmbtr: number; // Amount
  Waers: string; // Currency
  MemoType: string;  // CREDIT or DEBIT
}
