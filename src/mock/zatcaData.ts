import {
  BusinessProfile,
  User,
  Category,
  Unit,
  Product,
  Warehouse,
  Customer,
  Supplier,
  Invoice,
  Purchase,
  ReturnRecord,
  StockCount,
  VatReturnDeclaration
} from '../types/zatcaErp';
import { generateZatcaTlvQrCode } from '../utils/zatcaCrypto';

export const INITIAL_BUSINESS_PROFILE: BusinessProfile = {
  id: 'biz-saudi-001',
  companyNameAr: 'شركة الحلول المتكاملة للأعمال المحدودة',
  companyNameEn: 'Saudi Integrated Business Solutions Ltd.',
  crNumber: '1010884920',
  vatNumber: '310499281000003',
  streetName: 'طريق الملك فهد، حي الصحافة',
  buildingNumber: '7420',
  district: 'الصحافة',
  city: 'الرياض',
  postalCode: '13315',
  country: 'المملكة العربية السعودية',
  zatcaPhase: 'PHASE_2',
  csidStatus: 'ACTIVE',
  csidProductionKey: 'PCSID-SA-2026-991823-AUTH',
  lastZatcaSync: '2026-09-29 16:30'
};

export const MOCK_USERS: User[] = [
  {
    id: 'usr-owner-1',
    name: 'سليمان عبد العزيز الراجحي',
    email: 'owner@saudi-solutions.sa',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    role: 'OWNER',
    roleTitle: 'مالك المنشأة (Business Owner)',
    phone: '+966 50 123 4567',
    businessId: 'biz-saudi-001',
    businessProfile: INITIAL_BUSINESS_PROFILE,
    token: 'jwt-mock-token-saudi-owner'
  },
  {
    id: 'usr-finance-1',
    name: 'م. سارة المحمد',
    email: 'finance@saudi-solutions.sa',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    role: 'FINANCE_MANAGER',
    roleTitle: 'مديرة الحسابات والضرائب',
    phone: '+966 55 987 6543',
    businessId: 'biz-saudi-001',
    businessProfile: INITIAL_BUSINESS_PROFILE,
    token: 'jwt-mock-token-saudi-finance'
  },
  {
    id: 'usr-store-1',
    name: 'أحمد الغامدي',
    email: 'inventory@saudi-solutions.sa',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    role: 'STORE_KEEPER',
    roleTitle: 'أمين المستودع الرئيسي',
    phone: '+966 53 444 3322',
    businessId: 'biz-saudi-001',
    businessProfile: INITIAL_BUSINESS_PROFILE
  }
];

export const MOCK_CATEGORIES: Category[] = [
  { id: 'cat-1', nameAr: 'أجهزة ومعدات إلكترونية', nameEn: 'Electronics & Hardware', description: 'خوادم، حواسب، ومحطات نقاط بيع', productCount: 14 },
  { id: 'cat-2', nameAr: 'أنظمة وبرمجيات سحابية', nameEn: 'Software & Cloud Solutions', description: 'رخص برامج وتكامل شبكات', productCount: 8 },
  { id: 'cat-3', nameAr: 'مستلزمات مكتبية وتقنية', nameEn: 'Office & Tech Supplies', description: 'طابعات حرارية وأوراق فواتير ZATCA', productCount: 22 }
];

export const MOCK_UNITS: Unit[] = [
  { id: 'unit-1', nameAr: 'حبة (قطعة)', nameEn: 'Piece', code: 'PCE' },
  { id: 'unit-2', nameAr: 'كرتون', nameEn: 'Box', code: 'BOX' },
  { id: 'unit-3', nameAr: 'رخصة سنوية', nameEn: 'Annual License', code: 'YEAR' },
  { id: 'unit-4', nameAr: 'باقة تشغيلية', nameEn: 'Package', code: 'PKG' }
];

export const MOCK_WAREHOUSES: Warehouse[] = [
  {
    id: 'wh-1',
    nameAr: 'مستودع الرياض المركزي - السلي',
    nameEn: 'Riyadh Central Warehouse',
    code: 'WH-RUH-01',
    address: 'منطقة السلي الصناعية، مخرج 18',
    city: 'الرياض',
    isPrimary: true,
    totalProductsCount: 38,
    totalStockValueSar: 485000
  },
  {
    id: 'wh-2',
    nameAr: 'مستودع جدة الإقليمي - ميناء جدة',
    nameEn: 'Jeddah Regional Warehouse',
    code: 'WH-JED-02',
    address: 'حي الخمرة اللوجستي',
    city: 'جدة',
    isPrimary: false,
    totalProductsCount: 24,
    totalStockValueSar: 290000
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    nameAr: 'شاشة نقطة بيع حرارية متوافقة مع ZATCA',
    nameEn: 'ZATCA Thermal POS Terminal Pro 15"',
    barcode: '628100099801',
    sku: 'POS-TERM-Z2',
    categoryId: 'cat-1',
    categoryName: 'أجهزة ومعدات إلكترونية',
    unitId: 'unit-1',
    unitName: 'حبة (قطعة)',
    buyPrice: 1800,
    sellPrice: 2400,
    vatRate: 0.15,
    taxType: 'STANDARD',
    stockQuantity: 45,
    minStockAlert: 10,
    warehouseId: 'wh-1'
  },
  {
    id: 'prod-2',
    nameAr: 'طابعة فواتير حرارية سريعة high-speed QR',
    nameEn: 'ZATCA QR Receipt Thermal Printer',
    barcode: '628100099802',
    sku: 'PRN-ZATCA-80',
    categoryId: 'cat-1',
    categoryName: 'أجهزة ومعدات إلكترونية',
    unitId: 'unit-1',
    unitName: 'حبة (قطعة)',
    buyPrice: 350,
    sellPrice: 550,
    vatRate: 0.15,
    taxType: 'STANDARD',
    stockQuantity: 120,
    minStockAlert: 25,
    warehouseId: 'wh-1'
  },
  {
    id: 'prod-3',
    nameAr: 'اشتراك الربط البرمجي مع منصة فاتورة (ZATCA API Phase 2)',
    nameEn: 'ZATCA Phase 2 Cloud API License (1 Year)',
    barcode: '628100099803',
    sku: 'SW-ZATCA-API-1Y',
    categoryId: 'cat-2',
    categoryName: 'أنظمة وبرمجيات سحابية',
    unitId: 'unit-3',
    unitName: 'رخصة سنوية',
    buyPrice: 1200,
    sellPrice: 2000,
    vatRate: 0.15,
    taxType: 'STANDARD',
    stockQuantity: 999,
    minStockAlert: 5,
    warehouseId: 'wh-1'
  },
  {
    id: 'prod-4',
    nameAr: 'كرتون ورق حراري للفواتير الضريبية (50 رول)',
    nameEn: 'Thermal Paper Rolls Box (50 Rolls)',
    barcode: '628100099804',
    sku: 'SUP-ROLL-50',
    categoryId: 'cat-3',
    categoryName: 'مستلزمات مكتبية وتقنية',
    unitId: 'unit-2',
    unitName: 'كرتون',
    buyPrice: 90,
    sellPrice: 140,
    vatRate: 0.15,
    taxType: 'STANDARD',
    stockQuantity: 210,
    minStockAlert: 30,
    warehouseId: 'wh-1'
  }
];

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'مؤسسة أفق التقنية للتجارة',
    companyName: 'مؤسسة أفق التقنية للتجارة',
    vatNumber: '310188920100003',
    crNumber: '1010543210',
    phone: '+966 11 456 7890',
    email: 'info@ofuqtech.sa',
    address: 'حي العليا، طريق الملك فهد',
    city: 'الرياض',
    customerType: 'B2B',
    totalPurchasesSar: 68400
  },
  {
    id: 'cust-2',
    name: 'شركة سلاسل التجزئة السعودية',
    companyName: 'شركة سلاسل التجزئة السعودية',
    vatNumber: '310277192800003',
    crNumber: '4030112233',
    phone: '+966 12 600 1122',
    email: 'purchasing@retail-sa.com',
    address: 'حي الزهراء، طريق الملك عبد العزيز',
    city: 'جدة',
    customerType: 'B2B',
    totalPurchasesSar: 142000
  },
  {
    id: 'cust-3',
    name: 'عميل نقدي (مبيعات التجزئة B2C)',
    phone: '+966 50 000 0000',
    address: 'الرياض - فرع المعرض',
    city: 'الرياض',
    customerType: 'B2C',
    totalPurchasesSar: 12500
  }
];

export const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: 'supp-1',
    name: 'شركة التقنيات المتقدمة للاستيراد',
    companyName: 'شركة التقنيات المتقدمة للاستيراد',
    vatNumber: '300099887700003',
    crNumber: '1010998877',
    phone: '+966 11 222 3344',
    email: 'supply@advtech.sa',
    address: 'المنطقة الصناعية الثانية',
    city: 'الرياض',
    balanceDueSar: 0
  },
  {
    id: 'supp-2',
    name: 'المصنع السعودي للأجهزة الإلكترونية',
    companyName: 'المصنع السعودي للأجهزة الإلكترونية',
    vatNumber: '300554433200003',
    crNumber: '2050119988',
    phone: '+966 13 888 7766',
    email: 'sales@saudi-electro.sa',
    address: 'المدينة الصناعية الأولى',
    city: 'الدمام',
    balanceDueSar: 18500
  }
];

const sampleQr1 = generateZatcaTlvQrCode({
  sellerName: INITIAL_BUSINESS_PROFILE.companyNameAr,
  vatNumber: INITIAL_BUSINESS_PROFILE.vatNumber,
  timestamp: '2026-09-29T14:15:00Z',
  totalWithVat: '5635.00',
  vatAmount: '735.00'
});

const sampleQr2 = generateZatcaTlvQrCode({
  sellerName: INITIAL_BUSINESS_PROFILE.companyNameAr,
  vatNumber: INITIAL_BUSINESS_PROFILE.vatNumber,
  timestamp: '2026-09-28T11:20:00Z',
  totalWithVat: '2760.00',
  vatAmount: '360.00'
});

export const MOCK_INVOICES: Invoice[] = [
  {
    id: 'inv-8841',
    invoiceNumber: 'INV-2026-00841',
    uuid: '7f9c2d1b-8392-4112-a849-0192bce8110a',
    invoiceType: 'STANDARD',
    issueDate: '2026-09-29',
    issueTime: '14:15:00',
    customerId: 'cust-1',
    customerName: 'مؤسسة أفق التقنية للتجارة',
    customerVatNumber: '310188920100003',
    items: [
      {
        productId: 'prod-1',
        productName: 'شاشة نقطة بيع حرارية متوافقة مع ZATCA',
        unitName: 'حبة (قطعة)',
        quantity: 2,
        unitPrice: 2400,
        discountAmount: 0,
        vatRate: 0.15,
        vatAmount: 720,
        totalWithVat: 5520
      },
      {
        productId: 'prod-4',
        productName: 'كرتون ورق حراري للفواتير الضريبية (50 رول)',
        unitName: 'كرتون',
        quantity: 1,
        unitPrice: 100,
        discountAmount: 0,
        vatRate: 0.15,
        vatAmount: 15,
        totalWithVat: 115
      }
    ],
    subtotalExclVat: 4900,
    totalDiscount: 0,
    totalVatAmount: 735,
    grandTotal: 5635,
    status: 'CLEARED',
    zatcaClearanceStatus: 'CLEARED',
    zatcaQrCodeBase64: sampleQr1,
    previousInvoiceHash: '4f88219c28...previous_hash_chain',
    invoiceCounterValue: 841,
    cryptographicStamp: 'ZATCA-ECDSA-SECP256K1-STAMP-OK'
  },
  {
    id: 'inv-8840',
    invoiceNumber: 'INV-2026-00840',
    uuid: '3a1104e1-2299-4c28-98b3-aa889100224b',
    invoiceType: 'SIMPLIFIED',
    issueDate: '2026-09-28',
    issueTime: '11:20:00',
    customerId: 'cust-3',
    customerName: 'عميل نقدي (مبيعات التجزئة B2C)',
    items: [
      {
        productId: 'prod-3',
        productName: 'اشتراك الربط البرمجي مع منصة فاتورة (ZATCA API Phase 2)',
        unitName: 'رخصة سنوية',
        quantity: 1,
        unitPrice: 2400,
        discountAmount: 0,
        vatRate: 0.15,
        vatAmount: 360,
        totalWithVat: 2760
      }
    ],
    subtotalExclVat: 2400,
    totalDiscount: 0,
    totalVatAmount: 360,
    grandTotal: 2760,
    status: 'REPORTED',
    zatcaClearanceStatus: 'REPORTED',
    zatcaQrCodeBase64: sampleQr2,
    previousInvoiceHash: '19b22a00c2...previous_hash_chain',
    invoiceCounterValue: 840,
    cryptographicStamp: 'ZATCA-SIMPLIFIED-STAMP-OK'
  }
];

export const MOCK_PURCHASES: Purchase[] = [
  {
    id: 'pur-101',
    purchaseNumber: 'PO-2026-00101',
    supplierId: 'supp-1',
    supplierName: 'شركة التقنيات المتقدمة للاستيراد',
    supplierVatNumber: '300099887700003',
    warehouseId: 'wh-1',
    warehouseName: 'مستودع الرياض المركزي - السلي',
    purchaseDate: '2026-09-25',
    items: [
      {
        productId: 'prod-1',
        productName: 'شاشة نقطة بيع حرارية متوافقة مع ZATCA',
        quantity: 20,
        unitCost: 1800,
        vatRate: 0.15,
        vatAmount: 5400,
        totalWithVat: 41400
      }
    ],
    subtotalExclVat: 36000,
    totalVatAmount: 5400,
    grandTotal: 41400,
    paymentStatus: 'PAID'
  }
];

export const MOCK_RETURNS: ReturnRecord[] = [
  {
    id: 'ret-1',
    returnNumber: 'CN-2026-00012',
    type: 'SALES_RETURN',
    originalReferenceNumber: 'INV-2026-00835',
    partyName: 'مؤسسة أفق التقنية للتجارة',
    date: '2026-09-27',
    items: [
      { productName: 'طابعة فواتير حرارية', quantity: 1, amountWithVat: 632.5 }
    ],
    totalVatRefundSar: 82.5,
    totalRefundSar: 632.5,
    reason: 'تلف الشحنة أثناء النقل - استرجاع ضريبي معتمد ZATCA',
    zatcaStatus: 'CLEARED'
  }
];

export const MOCK_STOCK_COUNTS: StockCount[] = [
  {
    id: 'sc-1',
    referenceNumber: 'STK-RUH-2026-Q3',
    warehouseId: 'wh-1',
    warehouseName: 'مستودع الرياض المركزي - السلي',
    date: '2026-09-28',
    status: 'COMPLETED',
    discrepancyItemsCount: 2,
    totalVarianceValueSar: -240,
    notes: 'جرد نهاية الربع الثالث - مطابقة بنسبة 99.4%'
  }
];

export const INITIAL_VAT_DECLARATION: VatReturnDeclaration = {
  periodYear: 2026,
  periodQuarter: 'Q3',
  periodName: 'إقرار ضريبة القيمة المضافة - الربع الثالث 2026',
  standardRatedSalesSar: 284500,
  standardRatedSalesVatSar: 42675,
  zeroRatedSalesSar: 12000,
  exemptSalesSar: 0,
  totalOutputVatSar: 42675,

  standardRatedPurchasesSar: 165000,
  standardRatedPurchasesVatSar: 24750,
  zeroRatedPurchasesSar: 5000,
  totalInputVatSar: 24750,

  netTaxPayableSar: 17925, // 42675 - 24750
  submissionStatus: 'READY_FOR_SUBMISSION',
  paymentReferenceSadad: 'SADAD-ZATCA-99827-2026'
};
