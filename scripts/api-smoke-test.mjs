/**
 * Backend smoke test — follows https://e-commerce-system-six.vercel.app/api/docs/
 *
 * Usage (PowerShell):
 *   $env:API_EMAIL="admin@..."; $env:API_PASSWORD="..."; node scripts/api-smoke-test.mjs
 *   or:  $env:API_TOKEN="<jwt>"; node scripts/api-smoke-test.mjs
 * Optional: API_HOST (default https://e-commerce-system-six.vercel.app)
 *           WRITE=0 to skip all POST/PUT/PATCH (read-only run)
 *
 * NOTE: auth routes are probed at BOTH /api/v1/auth/* and /api/auth/* because the
 * deployed server currently rejects /api/v1/auth/login with "No token provided".
 */
const HOST = process.env.API_HOST || 'https://e-commerce-system-six.vercel.app';
const V1 = `${HOST}/api/v1`;
const WRITE = process.env.WRITE !== '0';
const stamp = Date.now();
const results = [];
let token = process.env.API_TOKEN || null;
let refreshToken = null;
const ctx = {};

async function call(name, method, url, { body, auth = true, expect = [200, 201] } = {}) {
  const headers = { 'Content-Type': 'application/json', Accept: 'application/json' };
  if (auth && token) headers.Authorization = `Bearer ${token}`;
  let status = 0, json = null, text = '';
  try {
    const res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined });
    status = res.status;
    text = await res.text();
    try { json = JSON.parse(text); } catch { /* non-json */ }
  } catch (e) { text = String(e); }
  const ok = expect.includes(status);
  const keys = json && typeof json === 'object' ? Object.keys(json).join(',') : '';
  const msg = !ok ? (json?.message || text).toString().slice(0, 140) : '';
  results.push({ name, method, status, ok, keys, msg });
  console.log(`${ok ? '✅' : '❌'} ${method.padEnd(6)} ${name.padEnd(34)} ${status} ${ok ? `{${keys}}` : msg}`);
  return { ok, status, json };
}
const d = (r) => r.json?.data;

// ---------- AUTH ----------
async function auth() {
  if (token) return;
  const creds = { email: process.env.API_EMAIL, password: process.env.API_PASSWORD };
  if (!creds.email) { console.log('⚠️  No API_TOKEN / API_EMAIL provided — only unauthenticated checks possible.'); return; }
  let r = await call('login (/api/v1)', 'POST', `${V1}/auth/login`, { body: creds, auth: false });
  if (!r.ok) r = await call('login (/api/ fallback)', 'POST', `${HOST}/api/auth/login`, { body: creds, auth: false });
  if (r.ok) {
    token = d(r)?.token || r.json?.token;
    refreshToken = d(r)?.refreshToken || r.json?.refreshToken;
    console.log(`   token=${!!token} refreshToken=${!!refreshToken} shape=${d(r) ? 'wrapped {data}' : 'flat'}`);
  }
}

async function run() {
  await auth();
  if (!token) return;
  await call('auth/me', 'GET', `${V1}/auth/me`);
  if (refreshToken) {
    const r = await call('auth/refresh', 'POST', `${V1}/auth/refresh`, { body: { refreshToken }, auth: false });
    if (r.ok && d(r)?.token) token = d(r).token;
  }

  // ---------- RBAC ----------
  await call('roles', 'GET', `${V1}/roles`);
  await call('permissions', 'GET', `${V1}/permissions`);
  await call('users', 'GET', `${V1}/users`);

  // ---------- MASTER DATA ----------
  const lists = {};
  for (const e of ['units', 'categories', 'warehouses', 'suppliers', 'customers', 'products']) {
    const r = await call(`list ${e}`, 'GET', `${V1}/${e}`);
    lists[e] = d(r) || [];
  }
  const first = (k) => (Array.isArray(lists[k]) ? lists[k][0] : lists[k]?.items?.[0]);

  if (WRITE) {
    let r = await call('create unit', 'POST', `${V1}/units`, { body: { name: `Piece ${stamp}`, symbol: `P${stamp % 1000}` } });
    ctx.unitId = d(r)?.id || first('units')?.id;
    r = await call('create category', 'POST', `${V1}/categories`, { body: { name: `Cat ${stamp}`, description: 'smoke' } });
    ctx.categoryId = d(r)?.id || first('categories')?.id;
    r = await call('create warehouse', 'POST', `${V1}/warehouses`, { body: { name: `WH ${stamp}`, location: 'Riyadh' } });
    ctx.warehouseId = d(r)?.id || first('warehouses')?.id;
    r = await call('create supplier', 'POST', `${V1}/suppliers`, { body: { name: `Supplier ${stamp}`, phone: '0112345678', city: 'Jeddah' } });
    ctx.supplierId = d(r)?.id || first('suppliers')?.id;
    r = await call('create customer B2C', 'POST', `${V1}/customers`, { body: { name: `Cust B2C ${stamp}`, phone: '+966501234567', city: 'Riyadh' } });
    ctx.customerB2C = d(r)?.id;
    r = await call('create customer B2B', 'POST', `${V1}/customers`, { body: { name: `Cust B2B ${stamp}`, vatNumber: '300000000000003', city: 'Riyadh' } });
    ctx.customerB2B = d(r)?.id;
    r = await call('create product', 'POST', `${V1}/products`, {
      body: { sku: `SKU-${stamp}`, name: `Product ${stamp}`, categoryId: ctx.categoryId, unitId: ctx.unitId, purchasePrice: 80, salePrice: 100, vatRate: 15, isVatExempt: false, barcode: String(stamp) },
    });
    ctx.productId = d(r)?.id;
  }
  if (ctx.productId) {
    await call('get product', 'GET', `${V1}/products/${ctx.productId}`);
    if (WRITE) await call('update product', 'PUT', `${V1}/products/${ctx.productId}`, { body: { salePrice: 110 } });
  }
  if (ctx.customerB2B) await call('get customer', 'GET', `${V1}/customers/${ctx.customerB2B}`);
  // Endpoints the guide lists but swagger does NOT define — expect 404 (confirms missing):
  await call('[guide-only] PUT category', 'PUT', `${V1}/categories/${ctx.categoryId}`, { body: { name: 'x' }, expect: [404] });
  await call('[guide-only] DELETE customer', 'DELETE', `${V1}/customers/${ctx.customerB2B}`, { expect: [404] });

  // ---------- INVENTORY / PURCHASES ----------
  if (WRITE && ctx.productId && ctx.supplierId && ctx.warehouseId) {
    await call('create purchase', 'POST', `${V1}/purchases`, {
      body: { supplierId: ctx.supplierId, warehouseId: ctx.warehouseId, notes: 'smoke', items: [{ productId: ctx.productId, quantity: 20, unitCost: 80 }] },
    }).then((r) => (ctx.purchaseId = d(r)?.id));
    await call('inventory adjustment', 'POST', `${V1}/inventory/adjustment`, { body: { productId: ctx.productId, warehouseId: ctx.warehouseId, quantity: 5, notes: 'smoke' } });
  }
  await call('list purchases', 'GET', `${V1}/purchases?page=1&limit=5`);
  if (ctx.purchaseId) await call('get purchase', 'GET', `${V1}/purchases/${ctx.purchaseId}`);
  await call('inventory', 'GET', `${V1}/inventory${ctx.warehouseId ? `?warehouseId=${ctx.warehouseId}` : ''}`);
  await call('inventory movements', 'GET', `${V1}/inventory/movements`);

  // ---------- SALES / INVOICES ----------
  if (WRITE && ctx.productId) {
    const mk = (customerId) => ({ customerId, warehouseId: ctx.warehouseId, paymentMethod: 'CASH', discountAmount: 0, items: [{ productId: ctx.productId, quantity: 2, discount: 0 }] });
    let r = await call('create sale B2C (simplified)', 'POST', `${V1}/sales`, { body: mk(ctx.customerB2C) });
    ctx.saleB2C = d(r)?.id; ctx.saleB2CBody = d(r);
    r = await call('create sale B2B (standard)', 'POST', `${V1}/sales`, { body: mk(ctx.customerB2B) });
    ctx.saleB2B = d(r)?.id;
    if (ctx.saleB2C) console.log('   sale response keys:', Object.keys(ctx.saleB2CBody || {}).join(','));
  }
  await call('list sales', 'GET', `${V1}/sales?page=1&limit=5`);
  if (ctx.saleB2C) await call('get sale', 'GET', `${V1}/sales/${ctx.saleB2C}`);
  const inv = await call('list invoices', 'GET', `${V1}/invoices?page=1&limit=5`);
  const invList = d(inv);
  ctx.invoiceId = (Array.isArray(invList) ? invList : invList?.items)?.[0]?.id;
  if (ctx.invoiceId) {
    const g = await call('get invoice', 'GET', `${V1}/invoices/${ctx.invoiceId}`);
    console.log('   invoice keys:', Object.keys(d(g) || {}).join(','));
    await call('invoice status', 'GET', `${V1}/invoices/${ctx.invoiceId}/status`);
  }

  // ---------- RETURNS / STOCK COUNT ----------
  if (WRITE && ctx.saleB2C) {
    await call('create return', 'POST', `${V1}/returns`, { body: { saleId: ctx.saleB2C, reason: 'smoke', items: [{ productId: ctx.productId, quantity: 1 }] } });
  }
  await call('list returns', 'GET', `${V1}/returns`);
  if (WRITE && ctx.warehouseId && ctx.productId) {
    const r = await call('create stock count', 'POST', `${V1}/stock-counts`, { body: { warehouseId: ctx.warehouseId, notes: 'smoke', productIds: [ctx.productId] } });
    const id = d(r)?.id;
    if (id) {
      await call('stock count items', 'PUT', `${V1}/stock-counts/${id}/items`, { body: { items: [{ productId: ctx.productId, actualQuantity: 20 }] } });
      await call('stock count approve', 'POST', `${V1}/stock-counts/${id}/approve`);
    }
  }
  await call('list stock counts', 'GET', `${V1}/stock-counts`);

  // ---------- REPORTS ----------
  for (const rep of ['sales', 'purchases', 'inventory', 'profit']) await call(`report ${rep}`, 'GET', `${V1}/reports/${rep}?from=2026-01-01&to=2026-12-31`);

  // ---------- ZATCA (read-only here; onboarding flow tested separately) ----------
  await call('zatca status', 'GET', `${V1}/zatca/status`);
  await call('zatca logs', 'GET', `${V1}/zatca/logs?page=1&limit=5`);
  await call('[guide-only] GET zatca/units', 'GET', `${V1}/zatca/units`, { expect: [404] });

  await call('logout', 'POST', `${V1}/auth/logout`, { body: refreshToken ? { refreshToken } : {} });
}

await run();
const bad = results.filter((r) => !r.ok);
console.log(`\n==== ${results.length - bad.length}/${results.length} passed ====`);
bad.forEach((r) => console.log(`❌ ${r.method} ${r.name} -> ${r.status} ${r.msg}`));
