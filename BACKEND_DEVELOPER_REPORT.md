# 📋تقرير الباك إند والتكامل مع الفرونت إند (Backend Developer Handout & Gap Analysis Report)

> **تاريخ التقرير:** 4 أكتوبر 2026  
> **المرسل:** مطوّر الفرونت إند (Frontend Development Team)  
> **الهدف:** توضيح جميع الـ Endpoints الجاهزة، الـ Endpoints الناقصة، واشتراطات الـ Schemas لربط الواجهة بالكامل وبدون أخطاء.

---

## ⚡ 1. ملاحظة هامة جداً حول الـ Base URL والـ Routing

> [!IMPORTANT]
> تم اكتشاف أن السيرفر المرفوع على Vercel يربط الـ Routes مباشرة تحت `/api/*` وليس `/api/v1/*`.
> - **الصحيح والمعمول به حالياً في الفرونت:**
>   - `/api/auth/login`
>   - `/api/categories`
>   - `/api/products`
>   - `/api/warehouses`
>   - `/api/inventory`
>   - `/api/stock-counts`
>   - `/api/sales`

---

## 🟢 2. الـ Endpoints المكتملة وتعمل بنجاح (Implemented & Verified)

| الـ Endpoint | Method | الوصف | الحالة |
|--------------|--------|-------|--------|
| `/api/auth/register` | `POST` | إنشاء حساب جديد | ✅ يعمل (يرجع `accessToken`) |
| `/api/auth/login` | `POST` | تسجيل الدخول | ✅ يعمل (يرجع `accessToken`) |
| `/api/auth/me` | `GET` | بيانات المستخدم والصلاحيات | ✅ يعمل |
| `/api/auth/google` | `POST` | تسجيل الدخول بواسطة Google | ✅ يعمل |
| `/api/categories` | `GET` | جلب التصنيفات | ✅ يعمل |
| `/api/categories` | `POST` | إضافة تصنيف جديد | ✅ يعمل |
| `/api/units` | `GET` | جلب الوحدات | ✅ يعمل |
| `/api/units` | `POST` | إضافة وحدة جديدة | ✅ يعمل |
| `/api/products` | `GET` | قائمة المنتجات مع الفلترة | ✅ يعمل |
| `/api/products` | `POST` | إضافة منتج جديد | ✅ يعمل |
| `/api/warehouses` | `GET` | قائمة المستودعات | ✅ يعمل |
| `/api/warehouses` | `POST` | إضافة مستودع جديد | ✅ يعمل |
| `/api/inventory` | `GET` | أرقام المخزون | ✅ يعمل |
| `/api/sales` | `GET` & `POST` | المبيعات وإصدار الفواتير | ✅ يعمل |
| `/api/customers` | `GET` & `POST` | العملاء | ✅ يعمل |
| `/api/suppliers` | `GET` & `POST` | الموردين | ✅ يعمل |

---

## 🔴 3. نقاط وميزات ناقصة في الباك إند (Missing Backend Features to Implement)

يرجى إكمال وتوفير الـ Endpoints التالية ليتمكن مطور الواجهة من تفعيل الإدارات الكاملة:

### أ) إدارة المنتجات والتصنيفات والمستودعات (CRUD Completeness)

1. **تعديل وحذف التصنيفات (Categories):**
   - `PUT /api/categories/:id` — تعديل اسم ووصف التصنيف.
   - `DELETE /api/categories/:id` — حذف تصنيف غير مرتبَط بمنتجات.

2. **تعديل وحذف المنتجات (Products):**
   - `PUT /api/products/:id` — تعديل تفاصيل المنتج (الاسم، السعر، الضريبة، الباركود).
   - `DELETE /api/products/:id` — حذف منتج غير مرتبَط بفواتير سابقة.

3. **تعديل وحذف المستودعات (Warehouses):**
   - `PUT /api/warehouses/:id` — تعديل اسم المستودع والموقع.
   - `DELETE /api/warehouses/:id` — حذف مستودع.

### ب) إدارة المخزون والجرد (Inventory & Stock Transfers)

1. **التحويل بين المستودعات (Warehouse Stock Transfer):**
   - `POST /api/inventory/transfer`
   - **Request Body Matrix:**
     ```json
     {
       "fromWarehouseId": "uuid",
       "toWarehouseId": "uuid",
       "productId": "uuid",
       "quantity": 25,
       "notes": "تحويل مخزون بين الفروع"
     }
     ```

2. **عرض تفاصيل جلسة الجرد (Get Single Stock Count Details):**
   - `GET /api/stock-counts/:id`
   - **السبب:** الفرونت بحاجة لعرض الأصناف المفحوصة والفروقات (Discrepancy Items) قبل الضغط على زر الاعتماد والتسوية (`POST /api/stock-counts/:id/approve`).

### ج) الفوترة الإلكترونية السعودية (ZATCA Integration Requirements)

1. **قائمة وحدات ZATCA (Get Units List):**
   - `GET /api/zatca/units`
   - **السبب:** عرض جميع الفروع/الوحدات المربوطة حالياً وحالاتها (`CONNECTED`, `COMPLIANCE`, `NOT_CONNECTED`).

2. **إرسال الإشعارات الدائنة/المدينة لـ ZATCA (Submit Credit / Debit Notes):**
   - `POST /api/returns` حالياً تُنشئ `CreditNote` بحالة `DRAFT`.
   - مطلوب إما إرسالها تلقائياً لـ ZATCA أو توفير `POST /api/returns/:id/submit`.

3. **تعديل بيانات البائع (ZATCA Business Settings API):**
   - جدول `ZatcaSettings` موجود في Prisma ولكن لا توجد APIs لقراءته أو تعديله.
   - يُقترَح إضافة `GET /api/zatca/settings` و `PUT /api/zatca/settings`.

---

## 🛠 4. مواصفات الـ Payload لـ `POST /products` (Product Schema Reference)

تم اعتماد الشفرة الرسمية التالية للمنتجات في الفرونت لضمان التوافق:

```json
{
  "sku": "PRD-001",
  "name": "iPhone 15",
  "nameAr": "آيفون 15",
  "categoryId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "unitId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "purchasePrice": 3500,
  "salePrice": 4500,
  "vatRate": 15,
  "isVatExempt": false,
  "barcode": "628100123456"
}
```

---

## ✅ 5. الحالة الحالية للفرونت إند (Frontend Readiness)

- تم ربط جميع الشاشات بـ `apiClient`.
- تم إضافة شاشة Modal تفاعلية ومستجيبة (Responsive) لإنشاء وتعديل وإلغاء وحذف المنتجات.
- عند إكمال الباك إند لهذه الـ Endpoints، سيعمل النظام بشكل كامل 100% بدون أي تعديلات إضافية في واجهة المستخدم.
