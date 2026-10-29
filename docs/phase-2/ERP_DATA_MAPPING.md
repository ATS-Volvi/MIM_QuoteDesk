# MIM QuoteFlow AI — ERP Data Field Mapping Specification

**Document Reference:** `docs/phase-2/ERP_DATA_MAPPING.md`  
**Phase:** Phase 2 — Read-Only ERP Connector Specification  
**Status:** DRAFT — Awaiting Administrator Field Verification & Schema Approval

---

## 1. Overview & Data Mapping Principles

This document establishes the bidirectional semantic mapping between:
1. **QuoteFlow AI Frontend & Calculation Engine:** The verified client-side state models used in `app.js` (`currentQuote.items`, `currentQuote.customer`, etc.).
2. **QuoteFlow Bridge Agent DTOs:** The normalized JSON schemas defined in `ERP_CONNECTOR_API_CONTRACT.md`.
3. **MIM Windows ERP Candidates:** Plausible on-premise relational schema structures (SQL Server / Oracle / Pervasive PSQL) documented as **Candidate ERP Fields** pending access to the live production database dictionary.

### Core Data Integrity Rules:
- **Verified vs. Candidate Separation:** All ERP table and column names in this document are explicitly marked `[CANDIDATE]` until confirmed against live ERP schema DDL.
- **Engine Calculation Isolation:** QuoteFlow AI's verified client calculation engine (`tests/audit_calculations_test.js`) retains strict authority over calculated mathematical derivatives (Line Subtotal, UAE 5% VAT, Margin %, Total Cost). The ERP connector provides raw authoritative baseline values only.
- **No Null Assumption:** When an ERP field is optional or missing (e.g., missing recorded cost), QuoteFlow flags the line with an explicit warning banner (`⚠ Missing Cost Baseline`) rather than coercing it to zero.

---

## 2. Product Master Mapping

### 2.1 Field Mapping Table
| QuoteFlow UI / State Field | Bridge Agent API DTO Field | Data Type | Candidate ERP Column `[UNCONFIRMED]` | Required in ERP? | Business Description & Validation Rules |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `item.code` | `product_code` | String | `tbl_ItemMaster.ItemCode` / `PartNumber` | **Yes** | Authoritative primary product code. Must be unique. Max 50 chars. |
| `item.description` | `description` | String | `tbl_ItemMaster.Description` / `ItemName` | **Yes** | Standard engineering/trade description. |
| `item.category` | `category` | String | `tbl_ItemMaster.ItemGroup` / `ProductClass` | No | Functional grouping (e.g., `CABLES`, `CONDUITS`, `CONTAINMENT`). |
| `item.uom` | `unit_of_measure` | String | `tbl_ItemMaster.BaseUOM` / `StockUnit` | **Yes** | Standard unit of measure (e.g., `MTR`, `PCS`, `SET`, `ROLL`). |
| `item.specs` | `specifications` | Object / JSON | `tbl_ItemSpecs` / `ExtendedProps` | No | Technical parameters (Cores, conductor, insulation, standards). |
| `item.status` | `is_active` | Boolean | `tbl_ItemMaster.ActiveFlag` / `IsDiscontinued` | **Yes** | Active flag. If `false`, item is marked `DISCONTINUED` in QuoteFlow. |
| `item.lead_time` | `inventory_status.lead_time_days` | Integer | `tbl_ItemStock.LeadTimeDays` | No | Typical fulfillment lead time in business days. |
| `item.is_stocked` | `inventory_status.is_stocked` | Boolean | `tbl_ItemStock.StockPolicy` | No | Flag indicating whether item is standard stock or order-to-order. |

### 2.2 Disambiguation Rules for Variants:
- When a search returns multiple similar items (e.g., `CBL-4C-016-CU` vs `CBL-4C-025-CU`), each record must return distinct `product_code` and `specifications`.
- QuoteFlow requires explicit user confirmation click on the exact row before binding the code to a draft quote.

---

## 3. Customer Master Mapping (Debtors Ledger [D] vs. General Ledger [G])

### 3.1 Debtors Ledger `[D]` Field Mapping Table
| QuoteFlow UI / State Field | Bridge Agent API DTO Field | Data Type | Candidate ERP Column `[UNCONFIRMED]` | Required in ERP? | Business Description & Validation Rules |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `quote.customer.id` | `account_id` | String | `tbl_Customer.CustCode` / `AccountNo` | **Yes** | Authoritative Debtors Ledger identifier (e.g., `ACC-88219`). |
| `quote.customer.name` | `legal_name` | String | `tbl_Customer.CustName` / `LegalName` | **Yes** | Registered commercial entity name. |
| `quote.customer.trade_name` | `trade_name` | String | `tbl_Customer.TradeName` / `Alias` | No | Doing-Business-As (DBA) commercial name. |
| `quote.customer.trn` | `tax_registration_number`| String | `tbl_Customer.VATTaxID` / `TRN` | No | 15-digit UAE Federal Tax Authority TRN. |
| `quote.customer.status` | `status` | String | `tbl_Customer.AccountStatus` | **Yes** | Account status: `ACTIVE`, `ON_HOLD`, `SUSPENDED`. |
| `quote.customer.credit_status`| `credit_status` | String | `tbl_Customer.CreditHoldFlag` | No | Approval status for credit-based orders. |
| `quote.customer.terms` | `default_payment_terms` | String | `tbl_Customer.PaymentTermsCode` | No | Approved terms (e.g., `30 Days PDC`, `Immediate Cash`). |
| `quote.customer.price_list` | `default_price_list_id` | String | `tbl_Customer.PriceListID` | No | Default commercial tariff binding. |
| `quote.customer.address` | `billing_address` | Object | `tbl_CustAddress` (Type='BILL') | No | Registered corporate address. |
| `quote.currency` | `currency` | String | `tbl_Customer.BillingCurrency` | **Yes** | Billing currency (Standard: `AED`). |

### 3.2 General Ledger `[G]` Recipient Rules
When the estimator toggles `Ledger: [G] General Ledger (One-off / Cash Recipient)`:
- `quote.customer.id` is explicitly set to `null` or `"GL-RECIPIENT-LOCAL"`.
- `quote.customer.name` is entered by estimator as plain text (e.g., `"Al-Baraha Electricals LLC"`).
- **ERP Boundary Enforcement:** The connector is **never invoked**. No candidate records are searched or written to `tbl_Customer`. The recipient string exists solely on the generated PDF and QuoteFlow draft store.

---

## 4. Pricing and Costing Mapping

### 4.1 Field Mapping Table
| QuoteFlow Calculation Field | Bridge Agent API DTO Field | Data Type | Candidate ERP Column `[UNCONFIRMED]` | Source Authority | Business Description & Rules |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `item.price` (Target Unit Price) | `pricing.standard_list_price` | Decimal(12,2) | `tbl_PriceListDetail.UnitPrice` | ERP Master | Baseline catalog selling price before discount. |
| Special Contract Price | `pricing.customer_special_price` | Decimal(12,2) | `tbl_ContractPrice.SpecialPrice`| ERP Master | Customer-specific negotiated price (if applicable). |
| `item.cost` (Unit Cost Baseline) | `costing.recorded_cost` | Decimal(12,2) | `tbl_ItemCost.RecordedCost` | ERP Master | Authorized cost basis for margin calculations. |
| Cost Valuation Basis | `costing.cost_type` | String | `tbl_ItemCost.CostMethod` | ERP Master | `WEIGHTED_AVERAGE_COST`, `LAST_PURCHASE_COST`, or `STANDARD_COST`. |
| Cost Timestamp | `costing.cost_timestamp` | ISO8601 | `tbl_ItemCost.LastValuationDate` | ERP Master | Timestamp of when the cost was calculated/posted. |
| Stale Cost Indicator | `costing.is_cost_stale` | Boolean | Computed by Bridge Agent | Bridge Agent | Flagged `true` if `cost_timestamp` > 30 days old. |
| Historical Price Benchmark | `historical_benchmarks.last_quoted_price` | Decimal(12,2) | `tbl_QuoteHistory.UnitPrice` | ERP History | Price quoted on previous approved quotation. |
| Historical Quote Date | `historical_benchmarks.last_quoted_date` | Date | `tbl_QuoteHistory.QuoteDate` | ERP History | Date of most recent quotation comparison. |

### 4.2 Cost Basis Resolution Matrix:
To avoid dangerous margin miscalculations, the connector mandates strict classification of the ERP cost basis:

| Cost Basis Category | Description | QuoteFlow Calculation Impact |
| :--- | :--- | :--- |
| **Weighted Average Cost (WAC)** | Current moving average cost of stock on hand. | **Recommended Primary Basis.** Provides realistic gross margin reflection. |
| **Last Purchase Cost** | Unit price paid on most recent Purchase Order / Goods Receipt. | **Volatile.** Subject to spot market fluctuations (e.g., copper surges). |
| **Standard / Target Cost** | Centrally budgeted annual standard cost. | **Stable.** Useful for enterprise budgeting, but may lag market reality. |

> **MANDATORY POLICY RULE:**  
> If the ERP cost source cannot be verified during discovery, QuoteFlow AI must display the cost as `AED 115.00 (Unverified Cost Basis)` and require managerial signoff on margin calculations.

---

## 5. QuoteFlow Calculation Engine Authority

The following fields are strictly **calculated by QuoteFlow's client engine** and are **never overwritten** by the ERP connector:

```
Line Item Calculations:
  Line Total Cost = Quantity × Recorded Unit Cost
  Line Subtotal   = Quantity × Quoted Unit Price
  Line Margin AED = Line Subtotal - Line Total Cost
  Line Margin %   = ((Quoted Unit Price - Recorded Unit Cost) / Quoted Unit Price) × 100

Quotation Summary Calculations:
  Total Cost      = Sum of all Line Total Costs
  Subtotal        = Sum of all Line Subtotals
  Total Margin AED= Subtotal - Total Cost
  Total Margin %  = ((Subtotal - Total Cost) / Subtotal) × 100
  VAT (5.00%)     = Subtotal × 0.05
  Grand Total AED = Subtotal + VAT
```

*Formula audited and verified via `tests/audit_calculations_test.js`.*
