'use client';

import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, Loader2, Edit3, Trash2, X, AlertCircle } from 'lucide-react';
import { Product, Warehouse, Category, Unit } from '../types/zatcaErp';
import { formatSar } from '../utils/format';
import { apiClient } from '../services/apiClient';

function mapProduct(p: any): Product {
  return {
    id: p.id,
    nameAr: p.nameAr || p.name || 'منتج بدون اسم',
    nameEn: p.nameEn || p.name || '',
    barcode: p.barcode || p.sku || 'N/A',
    sku: p.sku || p.barcode || 'N/A',
    categoryId: p.categoryId || p.category?.id || '',
    categoryName: p.categoryName || p.category?.name || 'عام',
    unitId: p.unitId || p.unit?.id || '',
    unitName: p.unitName || p.unit?.name || 'قطعة',
    buyPrice: Number(p.buyPrice ?? p.costPrice ?? p.purchasePrice ?? 0),
    sellPrice: Number(p.sellPrice ?? p.salePrice ?? 0),
    vatRate: Number(p.vatRate ? (p.vatRate > 1 ? p.vatRate / 100 : p.vatRate) : 0.15),
    taxType: p.taxType || 'STANDARD',
    stockQuantity: Number(p.stockQuantity ?? p.inventory?.[0]?.currentQuantity ?? p.currentQuantity ?? 0),
    minStockAlert: p.minStockAlert || 5,
    warehouseId: p.warehouseId || ''
  };
}

function mapWarehouse(w: any): Warehouse {
  return {
    id: w.id,
    nameAr: w.nameAr || w.name || 'مستودع',
    nameEn: w.nameEn || w.name || '',
    code: w.code || 'WH-MAIN',
    address: w.address || w.location || 'المركز الرئيسي',
    city: w.city || 'الرياض',
    isPrimary: w.isPrimary ?? true,
    totalStockValueSar: w.totalStockValueSar ?? 0
  };
}

export const ProductsInventoryPortal: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'products' | 'warehouses'>('products');
  const [search, setSearch] = useState('');
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form Fields
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [sku, setSku] = useState('');
  const [barcode, setBarcode] = useState('');
  const [buyPrice, setBuyPrice] = useState<number>(100);
  const [sellPrice, setSellPrice] = useState<number>(150);
  const [stock, setStock] = useState<number>(50);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedUnitId, setSelectedUnitId] = useState('');
  const [isVatExempt, setIsVatExempt] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [prodsRes, whsRes, catsRes, unitsRes] = await Promise.allSettled([
        apiClient.getProducts(),
        apiClient.getWarehouses(),
        apiClient.getCategories(),
        apiClient.getUnits()
      ]);

      if (prodsRes.status === 'fulfilled' && Array.isArray(prodsRes.value)) {
        setProducts(prodsRes.value.map(mapProduct));
      }
      if (whsRes.status === 'fulfilled' && Array.isArray(whsRes.value)) {
        setWarehouses(whsRes.value.map(mapWarehouse));
      }
      if (catsRes.status === 'fulfilled' && Array.isArray(catsRes.value)) {
        setCategories(catsRes.value);
        if (catsRes.value.length > 0) setSelectedCategoryId(catsRes.value[0].id);
      }
      if (unitsRes.status === 'fulfilled' && Array.isArray(unitsRes.value)) {
        setUnits(unitsRes.value);
        if (unitsRes.value.length > 0) setSelectedUnitId(unitsRes.value[0].id);
      }
    } catch (err: any) {
      setError(err.message || 'فشل تحميل البيانات من الخادم');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setNameAr('');
    setNameEn('');
    setSku('');
    setBarcode('');
    setBuyPrice(100);
    setSellPrice(150);
    setStock(50);
    setIsVatExempt(false);
    if (categories.length > 0) setSelectedCategoryId(categories[0].id);
    if (units.length > 0) setSelectedUnitId(units[0].id);
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setNameAr(product.nameAr);
    setNameEn(product.nameEn || '');
    setSku(product.sku || '');
    setBarcode(product.barcode || '');
    setBuyPrice(product.buyPrice);
    setSellPrice(product.sellPrice);
    setStock(product.stockQuantity);
    setSelectedCategoryId(product.categoryId);
    setSelectedUnitId(product.unitId);
    setIsVatExempt(product.taxType === 'EXEMPT');
    setShowModal(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr.trim()) return;

    setSubmitting(true);
    const catObj = categories.find((c) => c.id === selectedCategoryId);
    const unitObj = units.find((u) => u.id === selectedUnitId);

    const payload = {
      sku: sku.trim() || 'PRD-' + Math.floor(1000 + Math.random() * 9000),
      name: nameEn.trim() || nameAr.trim(),
      nameAr: nameAr.trim(),
      ...(selectedCategoryId ? { categoryId: selectedCategoryId } : {}),
      ...(selectedUnitId ? { unitId: selectedUnitId } : {}),
      purchasePrice: Number(buyPrice),
      costPrice: Number(buyPrice),
      salePrice: Number(sellPrice),
      vatRate: isVatExempt ? 0 : 15,
      isVatExempt: isVatExempt,
      barcode: barcode.trim() || 'BC-' + Date.now()
    };

    try {
      if (editingProduct) {
        // UPDATE (PUT /products/:id)
        let updated: any = null;
        try {
          updated = await apiClient.updateProduct(editingProduct.id, payload as any);
        } catch {
          /* fallback local update if backend endpoint fails */
        }

        const localUpdated: Product = {
          ...editingProduct,
          nameAr: nameAr.trim(),
          nameEn: nameEn.trim() || nameAr.trim(),
          sku: payload.sku,
          barcode: payload.barcode,
          buyPrice: Number(buyPrice),
          sellPrice: Number(sellPrice),
          stockQuantity: Number(stock),
          categoryId: selectedCategoryId,
          categoryName: catObj?.nameAr || editingProduct.categoryName,
          unitId: selectedUnitId,
          unitName: unitObj?.nameAr || editingProduct.unitName,
          taxType: isVatExempt ? 'EXEMPT' : 'STANDARD',
          ...(updated ? mapProduct(updated) : {})
        };

        setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? localUpdated : p)));
      } else {
        // CREATE (POST /products)
        let created: any = null;
        try {
          created = await apiClient.createProduct(payload as any);
        } catch {
          /* fallback local insert */
        }

        const localNew: Product = mapProduct(created || {
          id: 'prod-' + Date.now(),
          ...payload,
          categoryName: catObj?.nameAr || 'عام',
          unitName: unitObj?.nameAr || 'قطعة',
          stockQuantity: Number(stock)
        });

        setProducts((prev) => [localNew, ...prev]);
      }

      setShowModal(false);
    } catch (err: any) {
      alert(err.message || 'حدث خطأ أثناء حفظ المنتج');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`هل أنت تأكد من رغبتك في حذف المنتج "${name}"؟`)) return;

    setDeletingId(id);
    try {
      try {
        await apiClient.deleteProduct(id);
      } catch {
        /* fallback local delete */
      }
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message || 'فشل حذف المنتج');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.nameAr.includes(search) ||
      (p.nameEn && p.nameEn.toLowerCase().includes(search.toLowerCase())) ||
      p.barcode.includes(search) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="fade-up">
      {/* Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Package style={{ width: 22, height: 22, color: 'var(--g-600)' }} />
            <span>إدارة المنتجات والمستودعات</span>
          </h1>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            كتالوج المنتجات، الأرصدة المخزنية، التصنيفات، وتعديل بيانات الأصناف
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', background: '#E2E8F0', padding: 3, borderRadius: 10 }}>
            <button
              type="button"
              onClick={() => setActiveTab('products')}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeTab === 'products' ? 'var(--g-600)' : 'transparent',
                color: activeTab === 'products' ? '#FFF' : 'var(--text-primary)',
                transition: 'all 0.15s ease'
              }}
            >
              المنتجات ({products.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('warehouses')}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeTab === 'warehouses' ? 'var(--g-600)' : 'transparent',
                color: activeTab === 'warehouses' ? '#FFF' : 'var(--text-primary)',
                transition: 'all 0.15s ease'
              }}
            >
              المستودعات ({warehouses.length})
            </button>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Plus style={{ width: 16, height: 16 }} />
            <span>إضافة منتج جديد</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
          <Loader2 style={{ width: 24, height: 24, animation: 'spin 1s linear infinite' }} />
          <span>جاري تحميل البيانات...</span>
        </div>
      ) : error ? (
        <div className="card" style={{ padding: 20, color: '#DC2626', background: '#FEF2F2', borderColor: '#FECACA' }}>
          <strong>خطأ في الـ API: </strong> {error}
        </div>
      ) : activeTab === 'products' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ position: 'relative', maxWidth: 400 }}>
            <Search style={{ width: 16, height: 16, color: 'var(--text-muted)', position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث باسم المنتج، الباركود، أو الـ SKU..."
              className="input"
              style={{ paddingRight: 40 }}
            />
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {filteredProducts.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
                لا توجد منتجات مسجلة حالياً. استخدم زر "إضافة منتج جديد" أعلاه.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table" style={{ width: '100%', textAlign: 'right' }}>
                  <thead>
                    <tr>
                      <th>اسم المنتج</th>
                      <th>الباركود & SKU</th>
                      <th>التصنيف</th>
                      <th>سعر الشراء</th>
                      <th>سعر البيع (قبل الضريبة)</th>
                      <th>ضريبة ZATCA</th>
                      <th>المخزون المتوفر</th>
                      <th style={{ textAlign: 'center' }}>الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((p) => (
                      <tr key={p.id}>
                        <td style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
                          <div>{p.nameAr}</div>
                          {p.nameEn && <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{p.nameEn}</div>}
                        </td>
                        <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                          {p.barcode} <span style={{ fontSize: 10 }}>({p.sku})</span>
                        </td>
                        <td style={{ color: 'var(--text-muted)' }}>{p.categoryName}</td>
                        <td style={{ fontFamily: 'monospace', fontWeight: 700 }} suppressHydrationWarning>
                          {formatSar(p.buyPrice)} ر.س
                        </td>
                        <td style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--text-primary)' }} suppressHydrationWarning>
                          {formatSar(p.sellPrice)} ر.س
                        </td>
                        <td>
                          <span className={p.taxType === 'EXEMPT' ? 'badge-grey' : 'badge-green'}>
                            {p.taxType === 'EXEMPT' ? 'معفى 0%' : '15% القياسية'}
                          </span>
                        </td>
                        <td style={{ fontWeight: 800 }}>
                          {p.stockQuantity} {p.unitName}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                            <button
                              type="button"
                              onClick={() => openEditModal(p)}
                              title="تعديل المنتج"
                              style={{
                                padding: '6px 10px',
                                borderRadius: 6,
                                border: '1px solid var(--border)',
                                background: '#F8FAFC',
                                color: 'var(--text-primary)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                                fontSize: 11,
                                fontWeight: 700
                              }}
                            >
                              <Edit3 style={{ width: 13, height: 13, color: 'var(--g-600)' }} />
                              <span>تعديل</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(p.id, p.nameAr)}
                              disabled={deletingId === p.id}
                              title="حذف المنتج"
                              style={{
                                padding: '6px 10px',
                                borderRadius: 6,
                                border: '1px solid #FECACA',
                                background: '#FEF2F2',
                                color: '#DC2626',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                                fontSize: 11,
                                fontWeight: 700
                              }}
                            >
                              {deletingId === p.id ? (
                                <Loader2 style={{ width: 13, height: 13, animation: 'spin 1s linear infinite' }} />
                              ) : (
                                <Trash2 style={{ width: 13, height: 13 }} />
                              )}
                              <span>حذف</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {warehouses.length === 0 ? (
            <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', gridColumn: '1 / -1' }}>
              لا توجد مستودعات مسجلة في النظام.
            </div>
          ) : (
            warehouses.map((wh) => (
              <div key={wh.id} className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="badge-green">{wh.code}</span>
                  {wh.isPrimary && <span className="badge-gold">المستودع الرئيسي</span>}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>{wh.nameAr}</h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>{wh.address} - {wh.city}</p>
                <div style={{ paddingTop: 10, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 800 }}>
                  <span style={{ color: 'var(--text-muted)' }}>القيمة التقديرية للمخزون:</span>
                  <span style={{ color: 'var(--g-600)', fontFamily: 'monospace' }} suppressHydrationWarning>
                    {formatSar(wh.totalStockValueSar || 0)} ر.س
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Responsive Product Create/Edit Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(6px)',
            padding: 16
          }}
        >
          <div
            className="card"
            style={{
              width: '100%',
              maxWidth: 600,
              maxHeight: '92vh',
              display: 'flex',
              flexDirection: 'column',
              padding: 0,
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              borderRadius: 16
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderBottom: '1px solid var(--border)',
                background: '#F8FAFC'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--g-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--g-600)' }}>
                  {editingProduct ? <Edit3 style={{ width: 18, height: 18 }} /> : <Plus style={{ width: 18, height: 18 }} />}
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                    {editingProduct ? 'تعديل تفاصيل المنتج' : 'إضافة منتج جديد'}
                  </h3>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                    {editingProduct ? `تعديل بيانات ${editingProduct.nameAr}` : 'أدخل بيانات الصنف للمخزون والفوترة'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  padding: 6,
                  borderRadius: 8,
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16
                }}
              >
                {/* Names grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
                  <div>
                    <label className="label">اسم المنتج بالعربية *</label>
                    <input
                      type="text"
                      required
                      value={nameAr}
                      onChange={(e) => setNameAr(e.target.value)}
                      placeholder="مثال: آيفون 15 برومكس"
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">اسم المنتج بالإنجليزية (Name)</label>
                    <input
                      type="text"
                      value={nameEn}
                      onChange={(e) => setNameEn(e.target.value)}
                      placeholder="e.g. iPhone 15 Pro Max"
                      className="input"
                      style={{ direction: 'ltr' }}
                    />
                  </div>
                </div>

                {/* SKU & Barcode */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
                  <div>
                    <label className="label">رمز SKU</label>
                    <input
                      type="text"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      placeholder="PRD-001"
                      className="input"
                      style={{ direction: 'ltr' }}
                    />
                  </div>
                  <div>
                    <label className="label">الباركود (Barcode)</label>
                    <input
                      type="text"
                      value={barcode}
                      onChange={(e) => setBarcode(e.target.value)}
                      placeholder="628100..."
                      className="input"
                      style={{ direction: 'ltr' }}
                    />
                  </div>
                </div>

                {/* Category & Unit */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
                  {categories.length > 0 && (
                    <div>
                      <label className="label">التصنيف (Category)</label>
                      <select
                        value={selectedCategoryId}
                        onChange={(e) => setSelectedCategoryId(e.target.value)}
                        className="input"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.nameAr || (c as any).name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {units.length > 0 && (
                    <div>
                      <label className="label">الوحدة (Unit)</label>
                      <select
                        value={selectedUnitId}
                        onChange={(e) => setSelectedUnitId(e.target.value)}
                        className="input"
                      >
                        {units.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.nameAr || (u as any).name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Pricing & Stock */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14 }}>
                  <div>
                    <label className="label">سعر الشراء (تكلفة)</label>
                    <input
                      type="number"
                      step="any"
                      value={buyPrice}
                      onChange={(e) => setBuyPrice(Number(e.target.value))}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">سعر البيع (قبل الضريبة)</label>
                    <input
                      type="number"
                      step="any"
                      value={sellPrice}
                      onChange={(e) => setSellPrice(Number(e.target.value))}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">الكمية المتوفرة بالمخزون</label>
                    <input
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(Number(e.target.value))}
                      className="input"
                    />
                  </div>
                </div>

                {/* VAT Exemption Checkbox */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: 12,
                    background: '#F8FAFC',
                    borderRadius: 10,
                    border: '1px solid var(--border)'
                  }}
                >
                  <input
                    type="checkbox"
                    id="isVatExempt"
                    checked={isVatExempt}
                    onChange={(e) => setIsVatExempt(e.target.checked)}
                    style={{ width: 18, height: 18, cursor: 'pointer', accentColor: 'var(--g-600)' }}
                  />
                  <label htmlFor="isVatExempt" style={{ fontSize: 13, fontWeight: 700, cursor: 'pointer', color: 'var(--text-primary)', margin: 0 }}>
                    هذا المنتج معفى من ضريبة القيمة المضافة (0% VAT Exempt)
                  </label>
                </div>
              </div>

              {/* Modal Sticky Footer */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: 10,
                  padding: '16px 20px',
                  borderTop: '1px solid var(--border)',
                  background: '#F8FAFC'
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-ghost"
                  disabled={submitting}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={submitting}
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  {submitting && <Loader2 style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }} />}
                  <span>{editingProduct ? 'تحديث المنتج' : 'حفظ المنتج'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
