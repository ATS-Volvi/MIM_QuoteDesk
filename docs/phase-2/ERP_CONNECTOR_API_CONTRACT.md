# MIM QuoteFlow AI — Read-Only ERP Connector API Contract

**Document Reference:** `docs/phase-2/ERP_CONNECTOR_API_CONTRACT.md`  
**API Specification Version:** `v1.0.0-draft`  
**Base Path:** `/api/v1/erp`  
**Protocol:** HTTPS / TLS 1.3  
**Status:** DRAFT — Read-Only Specification (Pending On-Premise ERP Discovery Approval)

---

## 1. Architectural Scope & Core Principles

This specification defines the versioned HTTP REST interface exposed by the **QuoteFlow Bridge Agent** (Windows Service) to the MIM QuoteFlow AI quotation workspace.

### Core Contract Tenets:
1. **Strictly Read-Only:** All endpoints use HTTP `GET` with idempotent, read-only behavior. No state mutations, inserts, updates, or deletes occur on the on-premise ERP.
2. **Authoritative Verification Gate:** AI-extracted or suggested product codes and customer names are classified as unverified suggestions. They are **never** treated as authoritative until confirmed against an exact record returned by this contract.
3. **Ledger Boundary Enforcement:** 
   - Debtors Ledger `[D]` queries query verified ERP Debtors accounts (`/customers/debtors`).
   - General Ledger `[G]` recipient strings are handled strictly in the quotation workspace draft store and are **never** dispatched to the ERP customer master or used to fabricate customer records.
4. **Data Minimization:** Endpoints return exclusively the fields required for quotation preparation. Database metadata, internal row versions, and ERP system tables are strictly suppressed.
5. **Deterministic Errors:** All failures return standardized RFC 7807 problem payloads with actionable error codes, human-readable UI guidance, and clear retry semantics.

---

## 2. Global Headers & Common Query Parameters

### 2.1 Request Headers
| Header Name | Type | Required | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| `Authorization` | String | Yes | Bearer JWT issued by trusted QuoteFlow auth provider | `Bearer eyJhbGciOi...` |
| `X-QuoteFlow-Request-ID` | UUID | Yes | Client-generated request correlation identifier | `c8b4b7a1-893e-4d82-bf76-92135678abcd` |
| `X-QuoteFlow-User-ID` | String | Yes | Authenticated corporate user ID for audit logging | `usr_karim_alshami` |
| `Accept` | String | Yes | Content negotiation | `application/json` |

### 2.2 Response Headers
| Header Name | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `Content-Type` | String | MIME type and character encoding | `application/json; charset=utf-8` |
| `X-QuoteFlow-Request-ID` | UUID | Echoed correlation ID | `c8b4b7a1-893e-4d82-bf76-92135678abcd` |
| `X-ERP-Response-Time-MS` | Integer | Internal latency between bridge agent and ERP | `42` |
| `X-Connector-Version` | String | Bridge Agent runtime version | `1.0.0` |

---

## 3. Endpoints Specification

### 3.1 Product Master Search
Retrieves product master records matching exact codes, descriptions, variants, or categories.

- **Method:** `GET`
- **Path:** `/api/v1/erp/products/search`
- **Purpose:** Provide authoritative product identification for quotation line items.

#### Query Parameters:
| Parameter | Type | Required | Default | Validation / Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `query` | String | Conditional | — | Min 2 chars, max 100 chars, regex: `^[a-zA-Z0-9\s\.\-_\/]+$` | Free-text search matching code or description. |
| `code` | String | Conditional | — | Exact code match, max 50 chars | Direct product code lookup. |
| `category` | String | No | `ALL` | Enum: `CABLES`, `CONDUITS`, `CONTAINMENT`, `DISTRIBUTION`, `WIRING_DEVICES`, `ALL` | Filters by functional product category. |
| `include_inactive`| Boolean | No | `false` | `true` or `false` | When false, suppresses obsolete/discontinued ERP codes. |
| `page` | Integer | No | `1` | Min: 1 | Result page index. |
| `limit` | Integer | No | `20` | Min: 1, Max: 50 | Bounded pagination page size. |

*(Note: At least one of `query` or `code` must be provided).*

#### Success Response (`200 OK`):
```json
{
  "status": "success",
  "data": {
    "total_records": 2,
    "page": 1,
    "limit": 20,
    "has_more": false,
    "items": [
      {
        "product_code": "CBL-4C-016-CU",
        "description": "XLPE/SWA/PVC 4-Core 16mm² Cu 0.6/1kV",
        "category": "CABLES",
        "unit_of_measure": "MTR",
        "is_active": true,
        "match_type": "EXACT_CODE",
        "specifications": {
          "conductor": "Copper",
          "cores": 4,
          "cross_section_mm2": 16.0,
          "insulation": "XLPE",
          "armour": "SWA",
          "sheath": "PVC",
          "standard": "BS 5467 / IEC 60502-1"
        },
        "inventory_status": {
          "is_stocked": true,
          "lead_time_days": 3
        },
        "pricing_summary": {
          "currency": "AED",
          "list_price": 145.00,
          "unit": "MTR"
        }
      },
      {
        "product_code": "CBL-4C-025-CU",
        "description": "XLPE/SWA/PVC 4-Core 25mm² Cu 0.6/1kV",
        "category": "CABLES",
        "unit_of_measure": "MTR",
        "is_active": true,
        "match_type": "SIMILAR_DESCRIPTION",
        "specifications": {
          "conductor": "Copper",
          "cores": 4,
          "cross_section_mm2": 25.0,
          "insulation": "XLPE",
          "armour": "SWA",
          "sheath": "PVC",
          "standard": "BS 5467 / IEC 60502-1"
        },
        "inventory_status": {
          "is_stocked": true,
          "lead_time_days": 5
        },
        "pricing_summary": {
          "currency": "AED",
          "list_price": 210.00,
          "unit": "MTR"
        }
      }
    ]
  },
  "metadata": {
    "data_source": "ERP_READ_REPLICA",
    "as_of": "2026-10-29T10:45:00Z"
  }
}
```

---

### 3.2 Customer Master Search (Debtors Ledger [D] Only)
Retrieves verified Debtors Ledger accounts from the ERP accounts receivable subsystem.

- **Method:** `GET`
- **Path:** `/api/v1/erp/customers/debtors`
- **Purpose:** Ensure corporate quotations route to approved legal entities with verified tax and credit terms.

#### Query Parameters:
| Parameter | Type | Required | Default | Validation / Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `search` | String | Yes | — | Min 2 chars, max 80 chars | Substring match against account code, trade name, or TRN. |
| `status` | String | No | `ACTIVE` | Enum: `ACTIVE`, `ON_HOLD`, `SUSPENDED`, `ALL` | Account operating status. |
| `limit` | Integer | No | `15` | Min: 1, Max: 30 | Bounded result limit. |

#### General Ledger `[G]` Isolation Rule:
> **CRITICAL ARCHITECTURAL SAFEGUARD:**  
> The quotation workspace allows the estimator to select `Ledger Type: [G] General Ledger (One-off / Cash Recipient)`. When `[G]` is active:
> 1. The workspace **does not call** this endpoint.
> 2. The recipient name entered by the user is stored locally in the quotation document JSON only.
> 3. No ERP customer code is bound, and no ERP customer record is provisioned or searched.

#### Success Response (`200 OK`):
```json
{
  "status": "success",
  "data": {
    "total_records": 1,
    "items": [
      {
        "account_id": "ACC-88219",
        "account_type": "DEBTORS_LEDGER",
        "legal_name": "Al-Futtaim Engineering & Technologies LLC",
        "trade_name": "Al-Futtaim Engineering",
        "tax_registration_number": "100293847200003",
        "status": "ACTIVE",
        "credit_status": "APPROVED",
        "default_payment_terms": "30 Days PDC",
        "default_price_list_id": "PL-CONTRACTOR-2026",
        "billing_address": {
          "street": "Airport Road, Um Ramool",
          "city": "Dubai",
          "country": "United Arab Emirates",
          "po_box": "159"
        },
        "currency": "AED"
      }
    ]
  },
  "metadata": {
    "data_source": "ERP_READ_REPLICA",
    "as_of": "2026-10-29T10:45:00Z"
  }
}
```

---

### 3.3 Authoritative Pricing & Cost Lookup
Retrieves verified commercial price lists, cost baselines, and historical quote comparisons for a specific product and optional customer context.

- **Method:** `GET`
- **Path:** `/api/v1/erp/pricing/lookup`
- **Purpose:** Populate baseline cost, target price, and historical benchmarks to drive QuoteFlow's margin calculations.

#### Query Parameters:
| Parameter | Type | Required | Default | Validation / Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `product_code` | String | Yes | — | Exact product code | Authoritative product code. |
| `account_id` | String | No | — | Valid Debtors account ID | Optional customer ID for contract price lists. |
| `quantity` | Number | No | `1` | Float > 0 | Quantity to evaluate tiered price breaks. |
| `unit_of_measure` | String | No | Standard UOM | 3-char code | Target unit of measure (e.g., `MTR`, `PCS`). |

#### Success Response (`200 OK`):
```json
{
  "status": "success",
  "data": {
    "product_code": "CBL-4C-016-CU",
    "currency": "AED",
    "unit_of_measure": "MTR",
    "pricing": {
      "standard_list_price": 145.00,
      "customer_special_price": 138.00,
      "price_list_id": "PL-CONTRACTOR-2026",
      "price_list_name": "General MEP Contractors 2026",
      "effective_from": "2026-01-01",
      "tier_applied": {
        "min_qty": 1.0,
        "max_qty": 500.0,
        "discount_percent": 4.83
      }
    },
    "costing": {
      "recorded_cost": 115.00,
      "cost_type": "WEIGHTED_AVERAGE_COST",
      "cost_timestamp": "2026-10-28T18:00:00Z",
      "is_cost_stale": false,
      "cost_approval_status": "APPROVED",
      "audit_notes": "Nightly inventory valuation run."
    },
    "historical_benchmarks": {
      "last_quoted_price": 135.00,
      "last_quoted_date": "2026-09-15",
      "last_quoted_recipient": "Al-Futtaim Engineering",
      "variance_indicator": "HIGHER_THAN_LAST_QUOTE",
      "variance_percent": 2.22
    }
  },
  "metadata": {
    "calculation_engine_note": "QuoteFlow calculation engine must compute margin = ((Price - Cost) / Price) * 100 locally."
  }
}
```

> **IMPORTANT COSTING DISTINCTION:**  
> The connector clearly labels the returned cost type (`WEIGHTED_AVERAGE_COST`, `LAST_PURCHASE_COST`, or `STANDARD_COST`). QuoteFlow AI **never** treats an ambiguous "Last Cost" as an approved valuation without explicit metadata approval.

---

### 3.4 Connector Health & Version
Provides non-sensitive liveness and readiness diagnostic checks.

- **Method:** `GET`
- **Path:** `/api/v1/erp/health`
- **Purpose:** Used by QuoteFlow UI and monitoring systems to verify connectivity without leaking credentials or infrastructure topology.

#### Success Response (`200 OK`):
```json
{
  "status": "healthy",
  "service": "mim-quoteflow-bridge-agent",
  "version": "1.0.0",
  "contract_version": "v1.0.0-draft",
  "timestamp": "2026-10-29T10:45:00Z",
  "dependencies": {
    "erp_connection": {
      "status": "connected",
      "mode": "READ_ONLY",
      "latency_ms": 14
    },
    "token_service": {
      "status": "reachable"
    }
  }
}
```

*(Note: Under no circumstances does this endpoint return database connection strings, usernames, hostnames, or raw error stack traces).*

---

## 4. Standardized Error Handling Contract

Every non-2xx response must return a standardized JSON problem document conforming to RFC 7807:

```json
{
  "type": "https://quoteflow.mim.ae/errors/ERR_ERP_UNAVAILABLE",
  "title": "ERP System Unavailable",
  "status": 503,
  "code": "ERR_ERP_UNAVAILABLE",
  "detail": "The on-premise ERP database did not respond within the 5000ms timeout threshold.",
  "instance": "/api/v1/erp/products/search?query=CBL",
  "request_id": "c8b4b7a1-893e-4d82-bf76-92135678abcd",
  "timestamp": "2026-10-29T10:45:05Z",
  "retryable": true,
  "user_action": "Your current quotation draft is safely preserved in browser storage. Please retry in a few moments or proceed in offline draft mode."
}
```

### Complete Error Classification Matrix:
| HTTP Status | Error Code (`code`) | Category | Description & Cause | Client/UI Behavior |
| :--- | :--- | :--- | :--- | :--- |
| `400 Bad Request` | `ERR_INVALID_REQUEST` | Validation | Missing required parameter or invalid characters. | Highlight form field; prevent network spam. |
| `401 Unauthorized` | `ERR_UNAUTHORIZED` | Security | Bearer token missing, expired, or signature invalid. | Redirect user to SSO login; keep draft intact. |
| `403 Forbidden` | `ERR_FORBIDDEN` | Security | User role lacks permission for pricing/cost lookup. | Mask cost fields in UI with tooltip explanation. |
| `404 Not Found` | `ERR_NO_MATCH` | Data | No product or customer matches query criteria. | Display "No ERP records found"; offer catalogue browse. |
| `409 Conflict` | `ERR_AMBIGUOUS_MATCH` | Data | Multiple conflicting records for what was expected to be an exact code. | Show disambiguation table; force user to click exact row. |
| `429 Too Many Requests` | `ERR_RATE_LIMIT` | Operational | Request rate exceeds 10 req/sec per user. | Show throttling banner with cooldown timer. |
| `501 Not Implemented`| `ERR_UNSUPPORTED_CAPABILITY` | Capability | Requested filter or ERP pricing tier not enabled in ERP. | Disable unsupported UI control gracefully. |
| `502 Bad Gateway` | `ERR_INVALID_ERP_RESPONSE` | Integration | ERP returned malformed payload or corrupt data types. | Flag item for IT administrator review. |
| `503 Service Unavailable` | `ERR_ERP_UNAVAILABLE` | Operational | On-premise bridge agent cannot reach ERP server. | Switch UI to "ERP Offline Mode"; preserve draft. |
| `504 Gateway Timeout` | `ERR_TIMEOUT` | Operational | ERP query exceeded maximum 5000ms SLA limit. | Prompt user: "ERP is taking longer than usual to respond." |

---

## 5. UI Draft Preservation & Fallback Rules

1. **Zero Data Loss on Connector Outage:**  
   If any call returns `502`, `503`, or `504`, the QuoteFlow application MUST NOT reset or clear any fields in `currentQuote` or `localStorage`.
2. **Clear Visual Data Pedigree:**  
   - Records retrieved from this API display an authoritative badge: `✓ ERP Verified`.
   - Records loaded from static demo data or offline local storage display: `⚠ Unverified Draft Data`.
3. **Graceful Degraded Mode:**  
   Estimators can continue editing line items, entering custom descriptions, and saving client-side drafts even when the ERP bridge is completely offline.
