# ZATCA (Fatoora) E-Invoicing — API Reference for Developers

Compiled 2026-10-04 from ZATCA's Detailed Technical Guideline, the Fatoora Portal user manual, the ZATCA developer community, and open-source clients.
Items marked **[verify]** come from community sources or memory and should be checked against ZATCA's Swagger files in the Developer Portal before you rely on them.

---

## 1. The three environments

| Environment | Purpose | Base URL |
|---|---|---|
| **Sandbox** (Developer Portal) | First-pass dev testing. Mock certificates. Not a full end-to-end test (onboarding can't be fully tested). | `https://gw-fatoora.zatca.gov.sa/e-invoicing/developer-portal` |
| **Simulation** | Realistic testing against ZATCA. Documents are validated but not recorded as legal filings. Needs a real taxpayer Fatoora account and OTP. | `https://gw-fatoora.zatca.gov.sa/e-invoicing/simulation` |
| **Production** (Core) | Live. Invoices are legally binding. | `https://gw-fatoora.zatca.gov.sa/e-invoicing/core` |

Important notes:
- The legacy host `gw-apic-gov.gazt.gov.sa` was **decommissioned on 14 Sep 2025**. Use `gw-fatoora.zatca.gov.sa` only. Older tutorials and libraries may still point at the dead host.
- **Credentials do not cross environments.** A CSID / token / secret from one environment is rejected by the others (you will get `unauthorized`).
- The production Fatoora portal requires taxpayer (ERAD) credentials. The Developer Portal / sandbox is open to anyone and accessible from outside KSA.

---

## 2. Endpoint map

Append the path to the environment base URL above.

### Onboarding APIs

| Step | Method | Path | Auth | Purpose |
|---|---|---|---|---|
| 1 | `POST` | `/compliance` | None (OTP header) | Exchange CSR + OTP for a **Compliance CSID** |
| 2 | `POST` | `/compliance/invoices` | Compliance CSID | Submit test documents for compliance checks |
| 3 | `POST` | `/production/csids` | Compliance CSID | Exchange `compliance_request_id` for a **Production CSID** |
| Renewal | `PATCH` | `/production/csids` | Production CSID (+ OTP header) | Renew an existing Production CSID (revokes the old one, issues a new one) |

### Core solution APIs (need a Production CSID)

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/invoices/reporting/single` | **Reporting** — simplified invoices/notes (B2C), within 24 h of the transaction |
| `POST` | `/invoices/clearance/single` | **Clearance** — standard invoices/notes (B2B), before giving them to the buyer |

### Full URLs

**Sandbox**
```
POST https://gw-fatoora.zatca.gov.sa/e-invoicing/developer-portal/compliance
POST https://gw-fatoora.zatca.gov.sa/e-invoicing/developer-portal/compliance/invoices
POST https://gw-fatoora.zatca.gov.sa/e-invoicing/developer-portal/production/csids
PATCH https://gw-fatoora.zatca.gov.sa/e-invoicing/developer-portal/production/csids
POST https://gw-fatoora.zatca.gov.sa/e-invoicing/developer-portal/invoices/reporting/single
POST https://gw-fatoora.zatca.gov.sa/e-invoicing/developer-portal/invoices/clearance/single
```

**Simulation**
```
POST https://gw-fatoora.zatca.gov.sa/e-invoicing/simulation/compliance
POST https://gw-fatoora.zatca.gov.sa/e-invoicing/simulation/compliance/invoices
POST https://gw-fatoora.zatca.gov.sa/e-invoicing/simulation/production/csids
PATCH https://gw-fatoora.zatca.gov.sa/e-invoicing/simulation/production/csids
POST https://gw-fatoora.zatca.gov.sa/e-invoicing/simulation/invoices/reporting/single
POST https://gw-fatoora.zatca.gov.sa/e-invoicing/simulation/invoices/clearance/single
```

**Production**
```
POST https://gw-fatoora.zatca.gov.sa/e-invoicing/core/compliance
POST https://gw-fatoora.zatca.gov.sa/e-invoicing/core/compliance/invoices
POST https://gw-fatoora.zatca.gov.sa/e-invoicing/core/production/csids
PATCH https://gw-fatoora.zatca.gov.sa/e-invoicing/core/production/csids
POST https://gw-fatoora.zatca.gov.sa/e-invoicing/core/invoices/reporting/single
POST https://gw-fatoora.zatca.gov.sa/e-invoicing/core/invoices/clearance/single
```

Sandbox/simulation/production paths for the reporting and clearance APIs follow the same pattern. The sandbox paths above are inferred from the base URL and the way open-source clients build URLs **[verify against the Swagger files]**.

> There is **no API to get an OTP**. OTPs are generated only in the Fatoora portal (up to 100 per request, 6 digits, valid for 1 hour).

---

## 3. Common request headers

| Header | Value | Used on |
|---|---|---|
| `Accept-Version` | `V2` | All calls |
| `Accept-Language` | `en` or `ar` | All calls |
| `Content-Type` | `application/json` | All calls |
| `OTP` | 6-digit code from the Fatoora portal | `POST /compliance`, `PATCH /production/csids` |
| `Authorization` | `Basic base64(<username>:<password>)` — see below | All except `POST /compliance` |
| `Clearance-Status` | `1` = clearance on (standard invoices), `0` = off | Reporting and clearance calls |

**Auth detail [verify]:** Per community implementations, `POST /compliance` returns a `binarySecurityToken` and a `secret`. Use the token as the Basic-auth *username* and the secret as the *password*. The Production CSID call returns a new token + secret pair that you use the same way for reporting/clearance.

---

## 4. Request and response shapes

### 4.1 `POST /compliance` — get Compliance CSID
Headers: `OTP`, `Accept-Version`, `Accept-Language`
```json
{ "csr": "<base64-encoded CSR>" }
```
Response (200):
```json
{
  "requestID": "...",              // use as compliance_request_id in step 3
  "dispositionMessage": "ISSUED",
  "binarySecurityToken": "...",    // Basic-auth username for steps 2 and 3
  "secret": "...",                 // Basic-auth password for steps 2 and 3
  "errors": null
}
```
The Ruby client calls the request ID `responseID` in its docs; check the exact field name in the Swagger response **[verify]**.

### 4.2 `POST /compliance/invoices` — compliance checks
Auth: Compliance CSID.
```json
{
  "invoiceHash": "<base64 SHA-256 of canonicalized invoice>",
  "uuid": "<invoice UUID>",
  "invoice": "<base64-encoded signed UBL 2.1 XML>"
}
```
Required test documents depend on the `Invoice Type` bitmap in your CSR:
- `1000` (standard only): standard invoice + standard debit note + standard credit note
- `0100` (simplified only): simplified invoice + simplified debit note + simplified credit note
- `1100` (both): all six

Skipping a required type causes a "Missing Compliance Steps" error at the next step.

### 4.3 `POST /production/csids` — get Production CSID
Auth: Compliance CSID.
```json
{ "compliance_request_id": "<requestID from step 1>" }
```
Response: a new `binarySecurityToken` (Base64 certificate), `secret`, and request ID.

### 4.4 `PATCH /production/csids` — renew
Headers: `OTP`, auth with the existing Production CSID.
```json
{ "csr": "<base64 CSR>" }
```

### 4.5 `POST /invoices/reporting/single` and `/invoices/clearance/single`
Auth: Production CSID. Header `Clearance-Status`.
```json
{
  "invoiceHash": "<base64>",
  "uuid": "<invoice UUID>",
  "invoice": "<base64 signed XML>"
}
```
Notes:
- Submit **XML**, not PDF/A-3.
- **Reporting (B2C):** you sign and stamp and add the QR yourself. ZATCA doesn't stamp simplified documents.
- **Clearance (B2B):** ZATCA validates, adds its own stamp, and updates the QR. The response returns the cleared XML.
- If ZATCA has switched clearance off, standard documents sent to the clearance endpoint get a **303** and must go to the reporting endpoint.

### 4.6 Response codes seen in the docs
| Code | Meaning |
|---|---|
| `200` | Valid (PASS / REPORTED / CLEARED) |
| `202` | Accepted **with warnings**. Don't resubmit; fix the cause |
| `303` | Clearance disabled — use the Reporting API |
| `400` | Rejected with errors. Fix and send as a **new** document |
| `401` | Unauthorized (wrong credentials, wrong environment, expired/revoked CSID) |

Other codes (429/5xx etc.) and rate limits are not documented in the sources I found. Check the Swagger.

---

## 5. Full onboarding flow (per EGS unit)

1. **Taxpayer** logs into the Fatoora portal (ERAD SSO) → *Onboard new solution unit/device* → generate OTP(s).
2. **Generate keys + CSR** on the unit (secp256k1; fields below).
3. `POST /compliance` with CSR + OTP header → Compliance CSID (token + secret + request ID). Community sources say the Compliance CSID is valid for ~24 h **[verify]**.
4. `POST /compliance/invoices` for each required document type (3 or 6 docs).
5. `POST /production/csids` with `compliance_request_id` → Production CSID.
6. Store the private key, certificate, secret securely. Start calling reporting/clearance.
7. Renew with `PATCH /production/csids` before the certificate expires.

Notes:
- A Production CSID is valid for multiple years, and it is created once per device, not per invoice.
- Newly VAT-registered taxpayers must wait **2 business days** before onboarding.
- If any compliance test fails, restart from a new OTP + CSR.
- Revocation is done from the portal's *View List of Solutions and Devices*; ZATCA auto-revokes on VAT deregistration/suspension or joining a VAT group.

### CSR fields (all mandatory)
| Field | Meaning |
|---|---|
| Common Name | Unique unit name / asset number |
| EGS Serial Number | `1-<Manufacturer>\|2-<Model/Version>\|3-<Serial>` |
| Organization Identifier | 15-digit VAT number (starts and ends with 3); group VAT number for groups |
| Organization Unit Name | Branch name; for VAT groups, the 10-digit TIN of the member |
| Organization Name | Taxpayer name |
| Country Name | `SA` (ISO 3166 alpha-2) |
| Invoice Type | `TSXY` bitmap: `1000`, `0100`, `1100` (X and Y reserved = 0) |
| Location | Short address of the branch/unit |
| Industry | Business sector |

**CSR certificate template name differs by environment [verify]:** community sources report `TSTZATCA-Code-Signing` (sandbox), `PREZATCA-Code-Signing` (simulation) and `ZATCA-Code-Signing` (production), set via `certificateTemplateName = ASN1:PRINTABLESTRING:<name>` in the OpenSSL config. Simulation is an independent environment, so a CSR built for one environment won't work in another.

### OpenSSL commands (from ZATCA's guideline)
```bash
# private key (secp256k1)
openssl ecparam -name secp256k1 -genkey -noout -out PrivateKey.pem
# public key
openssl ec -in PrivateKey.pem -pubout -conv_form compressed -out PublicKey.pem
# CSR (config.cnf holds the fields above)
openssl req -new -sha256 -key PrivateKey.pem -extensions v3_req -config config.cnf -out taxpayer.csr
# hash
openssl dgst -sha256 invoice.xml
```

---

## 6. Invoice signing and QR (what you must build)

Signing steps (guideline section 5):
1. Take the invoice XML. Remove `UBLExtensions`, the QR `AdditionalDocumentReference`, and `Signature`, and remove the XML declaration.
2. Canonicalize with **C14N 1.1**, hash with **SHA-256**, Base64-encode → the **invoice hash**.
3. Sign the hash with **ECDSA** using the private key → signature value.
4. Hash the certificate (SHA-256, Base64) → certificate digest.
5. Fill in the Signed Properties (cert digest, signing time, issuer name, serial number), hash them, Base64-encode.
6. Fill the UBL Extensions (signature value, certificate, both digest values).
7. Build the QR (below) and embed it.

**QR code:** Base64 of TLV, one-byte tag, one-byte length, UTF-8 value, max 700 characters.

| Tag | Content |
|---|---|
| 1 | Seller name |
| 2 | Seller VAT number |
| 3 | Invoice timestamp (`yyyy-MM-ddTHH:mm:ssZ`) |
| 4 | Total with VAT |
| 5 | VAT total |
| 6 | Invoice XML hash |
| 7 | ECDSA signature |
| 8 | ECDSA public key |
| 9 | (Simplified only) ZATCA CA's signature over the stamp's public key |

Invoice chaining: every document has a unique **UUID**, an incrementing **ICV** (counter), and a **PIH** (previous invoice hash). Each device keeps its own chain. Rejected documents still count in the chain; never reuse a UUID or ICV after a rejection.

---

## 7. Official resources

| Resource | URL |
|---|---|
| ZATCA e-invoicing home | https://zatca.gov.sa/en/e-invoicing |
| Developer Portal (sandbox, SDK, validator, Swagger) | https://sandbox.zatca.gov.sa/ |
| Integration Sandbox docs | https://sandbox.zatca.gov.sa/IntegrationSandbox |
| Compliance & Enablement Toolbox (SDK) download | https://zatca.gov.sa/en/E-Invoicing/SystemsDevelopers/ComplianceEnablementToolbox/Pages/DownloadSDK.aspx |
| Fatoora Portal (simulation / production onboarding, OTP) | https://fatoora.zatca.gov.sa/ |
| Detailed Technical Guideline (PDF) | https://zatca.gov.sa/en/E-Invoicing/Introduction/Guidelines/Documents/E-invoicing-Detailed-Technical-Guideline.pdf |
| Fatoora Portal User Manual (PDF, lists API URLs) | https://zatca.gov.sa/en/E-Invoicing/Introduction/Guidelines/Documents/Fatoora_Portal_User_Manual_English.pdf |
| Developer Portal Manual (PDF) | https://zatca.gov.sa/en/E-Invoicing/Introduction/Guidelines/Documents/DEVELOPER-PORTAL-MANUAL.pdf |
| Solution Providers Directory | https://zatca.gov.sa/en/E-Invoicing/SolutionProviders/Pages/SolutionProvidersDirectory.aspx |
| System failure notification service | https://zatca.gov.sa/en/E-Invoicing/FailureNotifications/Pages/VerifyTaxpayer.aspx |
| Developer community forum | https://zatca1.discourse.group/ |
| Solution-provider support | sp_support@zatca.gov.sa |

Also download from the Developer Portal: **XML Implementation Standards**, **Data Dictionary**, **Security Features Implementation Standards**, and the **Swagger files** (the authoritative request/response schemas).

SDK CLI quick reference (offline validator):
```
fatoorah validateqr -qr <qr>          # validate QR structure
fatoorah generate -f invoice.xml -q   # generate a compliant QR
```
(Command name and flags as printed in the guideline; run `-h` on your SDK version to confirm.)

### Open-source clients you can read for reference
- Ruby: `zatca` gem (https://rubydoc.info/gems/zatca/ZATCA/Client), good map of every endpoint. Its sandbox URL constant is outdated (old host).
- PHP: `corecave/laravel-zatca`, `aghfatehi/laravel-zatca`, `khaledhajsalem/laravel-zatca-phase2` (all on Packagist)
- Docker: `keytouse/ubl_zatca` (JSON → UBL XML → sign → submit)

---

## 8. Practical gotchas

- **Simulation instability:** developers reported random 400 and "not authorized" errors on simulation onboarding endpoints around Oct 2025. If a flow that worked fails, retry later or email sp_support@zatca.gov.sa.
- **Sandbox is not end-to-end:** use it for payload and signing validation. Do real onboarding in simulation.
- **Whitelisting:** one source says ZATCA requires your server IPs whitelisted before integration testing **[verify]**.
- **Warnings (202):** accepted but non-compliant. Repeated warnings can draw penalties.
- **Failures in your own system:** report outages through ZATCA's failure-notification service, and report/clear the backlog afterwards.
- **No bulk reporting:** each document goes through the single-document endpoints.
- **Arabic:** all human-readable invoice fields must be in Arabic (bilingual is OK).

---

## 9. Sources

- ZATCA developer community: "E-Invoicing API endpoints" — https://zatca1.discourse.group/t/e-invoicing-api-endpoints/487
- ZATCA developer community: "What are the integration API endpoints for production and simulation?" — https://zatca1.discourse.group/t/what-are-the-integration-api-endpoints-for-production-and-simulation/350
- ZATCA developer community: legacy URL decommission notice and portal topics — https://zatca1.discourse.group/c/portal/17
- ZATCA developer community: endpoint clarification, compliance steps, credentials per environment — https://zatca1.discourse.group/t/need-clarification-about-end-points/4415 , https://zatca1.discourse.group/t/completed-compliance-invoice-but-getting-on-production-csid/4357 , https://zatca1.discourse.group/t/test-invoices-to-testing-environment-to-zatca/6713 , https://zatca1.discourse.group/t/frequent-issues-in-simulation-onboarding/8817
- ZATCA Fatoora Portal User Manual — https://zatca.gov.sa/en/E-Invoicing/Introduction/Guidelines/Documents/Fatoora_Portal_User_Manual_English.pdf
- ZATCA E-invoicing Detailed Technical Guideline v2 — https://zatca.gov.sa/en/E-Invoicing/Introduction/Guidelines/Documents/E-invoicing-Detailed-Technical-Guideline.pdf
- ZATCA Developer Portal Manual — https://zatca.gov.sa/en/E-Invoicing/Introduction/Guidelines/Documents/DEVELOPER-PORTAL-MANUAL.pdf
- Ruby `zatca` gem client docs — https://rubydoc.info/gems/zatca/ZATCA/Client
- Packagist: corecave/laravel-zatca, aghfatehi/laravel-zatca, khaledhajsalem/laravel-zatca-phase2
- Qoyod sandbox guide — https://www.qoyod.com/en/learn/sandbox-guide/
- Docker Hub: keytouse/ubl_zatca — https://hub.docker.com/r/keytouse/ubl_zatca
