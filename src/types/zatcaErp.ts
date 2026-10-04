export type UserRole = 'OWNER' | 'FINANCE_MANAGER' | 'STORE_KEEPER' | 'CASHIER' | 'SUPER_ADMIN';

export interface BusinessProfile {
  id: string;
  companyNameAr: string;
  companyNameEn: string;
  crNumber: string; // 10 digits Commercial Registration
  vatNumber: string; // 15 digits Saudi VAT ID
  streetName: string;
  buildingNumber: string;
  district: string;
  city: string;
  postalCode: string;
  country: string;
  zatcaPhase: 'PHASE_1' | 'PHASE_2';
  csidStatus: 'ACTIVE' | 'PENDING' | 'EXPIRED' | 'NOT_ACTIVATED';
  csidProductionKey?: string;
  lastZatcaSync?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  roleTitle: string;
  phone: string;
  businessId: string;
  businessProfile?: BusinessProfile;
  token?: string;
}

export interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  description?: string;
  productCount?: number;
}

export interface Unit {
  id: string;
  nameAr: string; // حبة، كرتون، كيلو
  nameEn: string; // Piece, Box, Kg
  code: string;
}

export interface Product {
  id: string;
  nameAr: string;
  nameEn: string;
  barcode: string;
  sku: string;
  categoryId: string;
  categoryName?: string;
  unitId: string;
  unitName?: string;
  buyPrice: number; // Excl. VAT
  sellPrice: number; // Excl. VAT
  vatRate: number; // Standard 0.15 (15%)
  taxType: 'STANDARD' | 'ZERO_RATED' | 'EXEMPT';
  stockQuantity: number;
  minStockAlert: number;
  warehouseId?: string;
}

export interface Warehouse {
  id: string;
  nameAr: string;
  nameEn: string;
  code: string;
  address: string;
  city: string;
  isPrimary: boolean;
  totalProductsCount?: number;
  totalStockValueSar?: number;
}

export interface InventoryRecord {
  id: string;
  productId: string;
  productName: string;
  warehouseId: string;
  warehouseName: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  lastUpdated: string;
}

export interface Customer {
  id: string;
  name: string;
  companyName?: string;
  vatNumber?: string; // For B2B Tax Invoices
  crNumber?: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  customerType: 'B2B' | 'B2C';
  totalPurchasesSar: number;
}

export interface Supplier {
  id: string;
  name: string;
  companyName: string;
  vatNumber: string; // 15 digits for Input VAT calculation
  crNumber: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  balanceDueSar: number;
}

export interface InvoiceItem {
  productId: string;
  productName: string;
  unitName: string;
  quantity: number;
  unitPrice: number; // Excl VAT
  discountAmount: number;
  vatRate: number; // 0.15
  vatAmount: number;
  totalWithVat: number;
}

export type InvoiceType = 'STANDARD' | 'SIMPLIFIED'; // B2B = Standard (Clearance), B2C = Simplified (Reporting)
export type InvoiceStatus = 'CLEARED' | 'REPORTED' | 'PENDING_ZATCA' | 'REJECTED' | 'DRAFT';

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g. INV-2026-00841
  uuid: string;
  invoiceType: InvoiceType;
  issueDate: string; // YYYY-MM-DD
  issueTime: string; // HH:mm:ss
  customerId?: string;
  customerName: string;
  customerVatNumber?: string;
  items: InvoiceItem[];
  subtotalExclVat: number;
  totalDiscount: number;
  totalVatAmount: number;
  grandTotal: number; // Subtotal - Discount + VAT
  status: InvoiceStatus;
  zatcaClearanceStatus?: 'CLEARED' | 'REPORTED' | 'WARNING' | 'ERROR';
  zatcaQrCodeBase64?: string;
  previousInvoiceHash?: string;
  invoiceCounterValue?: number;
  cryptographicStamp?: string;
  xmlSignedUrl?: string;
}

export interface PurchaseItem {
  productId: string;
  productName: string;
  quantity: number;
  unitCost: number; // Excl VAT
  vatRate: number;
  vatAmount: number;
  totalWithVat: number;
}

export interface Purchase {
  id: string;
  purchaseNumber: string;
  supplierId: string;
  supplierName: string;
  supplierVatNumber: string;
  warehouseId: string;
  warehouseName: string;
  purchaseDate: string;
  items: PurchaseItem[];
  subtotalExclVat: number;
  totalVatAmount: number; // Deductible Input VAT
  grandTotal: number;
  paymentStatus: 'PAID' | 'PARTIAL' | 'UNPAID';
}

export interface ReturnRecord {
  id: string;
  returnNumber: string; // Credit/Debit Note number
  type: 'SALES_RETURN' | 'PURCHASE_RETURN';
  originalReferenceNumber: string;
  partyName: string;
  date: string;
  items: { productName: string; quantity: number; amountWithVat: number }[];
  totalVatRefundSar: number;
  totalRefundSar: number;
  reason: string;
  zatcaStatus: 'REPORTED' | 'CLEARED';
}

export interface StockCount {
  id: string;
  referenceNumber: string;
  warehouseId: string;
  warehouseName: string;
  date: string;
  status: 'COMPLETED' | 'IN_PROGRESS';
  discrepancyItemsCount: number;
  totalVarianceValueSar: number;
  notes: string;
}

export interface VatReturnDeclaration {
  periodYear: number;
  periodQuarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  periodName: string;
  // Output VAT (Sales)
  standardRatedSalesSar: number;
  standardRatedSalesVatSar: number; // 15%
  zeroRatedSalesSar: number;
  exemptSalesSar: number;
  totalOutputVatSar: number;

  // Input VAT (Purchases)
  standardRatedPurchasesSar: number;
  standardRatedPurchasesVatSar: number; // 15%
  zeroRatedPurchasesSar: number;
  totalInputVatSar: number;

  // Net Tax Due
  netTaxPayableSar: number;
  submissionStatus: 'DRAFT' | 'READY_FOR_SUBMISSION' | 'SUBMITTED_AND_PAID';
  paymentReferenceSadad?: string;
}
