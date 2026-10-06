'use client';

import { useState, useEffect, useCallback } from 'react';
import { Product, Warehouse, Category, Unit } from '../types/zatcaErp';
import { apiClient } from '../services/apiClient';

export function mapProduct(p: any): Product {
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

export function mapWarehouse(w: any): Warehouse {
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

export function useProductsInventory() {
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

  // Form State
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

  const loadData = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openCreateModal = useCallback(() => {
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
  }, [categories, units]);

  const openEditModal = useCallback((product: Product) => {
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
  }, []);

  const handleSaveProduct = useCallback(async (e: React.FormEvent) => {
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
        let updated: any = null;
        try {
          updated = await apiClient.updateProduct(editingProduct.id, payload as any);
        } catch {
          /* fallback local update */
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
  }, [nameAr, nameEn, sku, barcode, buyPrice, sellPrice, stock, selectedCategoryId, selectedUnitId, isVatExempt, categories, units, editingProduct]);

  const handleDeleteProduct = useCallback(async (id: string, name: string) => {
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
  }, []);

  return {
    products,
    warehouses,
    categories,
    units,
    loading,
    error,
    activeTab,
    setActiveTab,
    search,
    setSearch,
    showModal,
    setShowModal,
    editingProduct,
    submitting,
    deletingId,
    formState: {
      nameAr,
      setNameAr,
      nameEn,
      setNameEn,
      sku,
      setSku,
      barcode,
      setBarcode,
      buyPrice,
      setBuyPrice,
      sellPrice,
      setSellPrice,
      stock,
      setStock,
      selectedCategoryId,
      setSelectedCategoryId,
      selectedUnitId,
      setSelectedUnitId,
      isVatExempt,
      setIsVatExempt
    },
    openCreateModal,
    openEditModal,
    handleSaveProduct,
    handleDeleteProduct
  };
}
