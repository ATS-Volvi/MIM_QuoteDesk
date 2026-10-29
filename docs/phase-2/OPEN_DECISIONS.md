# MIM QuoteFlow AI — Open Architecture & Integration Decisions

**Document Reference:** `docs/phase-2/OPEN_DECISIONS.md`  
**Phase:** Phase 2 — Read-Only ERP Connector Specification  
**Status:** ACTIVE — Pending Stakeholder & ERP Administrator Review

---

## 1. Overview

This document formalizes all open architectural questions, dependencies, and decisions required before proceeding with Phase 3 (Connector Implementation). Each decision is structured with:
- **Decision ID & Title**
- **The Exact Question**
- **Why It Matters (Impact & Risk)**
- **Who Should Confirm (Decision Owner)**
- **Dependent Implementation Decision**
- **Recommended Default / Interim Assumption**

---

## 2. Decision Log

### DEC-01: ERP Vendor Integration Surface & Mechanism
- **The Exact Question:**  
  What is the exact product name, version, and vendor-supported integration mechanism for the on-premise MIM Windows ERP (e.g., Epicor, Microsoft Dynamics NAV/Business Central, Sage, SAP Business One, Focus Softnet, or proprietary Windows desktop software)?
- **Why It Matters:**  
  Direct database queries risk violating software warranty and support agreements if the vendor provides a supported .NET SDK, Web API, or COM component. Conversely, building for an SDK that does not exist wastes engineering effort.
- **Who Should Confirm:**  
  MIM Head of IT / Lead ERP System Administrator.
- **Dependent Implementation Decision:**  
  Determines whether the **QuoteFlow Bridge Agent** is implemented as a thin REST facade over the vendor's native SDK or as a read-only ADO.NET service querying controlled SQL views.
- **Recommended Default:**  
  Implement the Bridge Agent with an abstracted repository interface (`IERPProductRepository`, `IERPCustomerRepository`). Default to read-only database views (`quoteflow_ro.*`) on a database read replica, subject to vendor licensing confirmation.

---

### DEC-02: Authoritative Cost Basis Definition (WAC vs. Last Cost vs. Standard)
- **The Exact Question:**  
  What is the authoritative business definition of "Recorded Cost" displayed in QuoteFlow AI and used to calculate gross margin? Is it Weighted Average Cost (WAC), Last Goods Receipt Cost, or Standard Inventory Cost?
- **Why It Matters:**  
  Industrial electrical materials (cables, copper conductors, conduits) experience commodity price volatility. Quoting based on an outdated "Last Purchase Cost" from 6 months ago can result in catastrophic negative margins on large contractor orders.
- **Who Should Confirm:**  
  MIM Financial Controller / Commercial Director.
- **Dependent Implementation Decision:**  
  Determines the SQL calculation / field mapping in `ERP_DATA_MAPPING.md` (`costing.recorded_cost`) and configures the freshness threshold for flagging stale cost warnings.
- **Recommended Default:**  
  Bind to **Weighted Average Cost (WAC)** as the primary baseline. If WAC valuation is older than 30 days, trigger a mandatory visual badge in the workspace: `⚠ Stale Valuation (>30d) — Review Cost Before Approval`.

---

### DEC-03: Product Hierarchy, SKU Uniqueness & Variant Granularity
- **The Exact Question:**  
  Are cable and conduit variants modeled in the ERP as distinct, independent product codes (e.g., `CBL-4C-016-CU` and `CBL-4C-025-CU` each having separate master records), or as parent items with child matrix attributes?
- **Why It Matters:**  
  If the ERP uses matrix items, QuoteFlow's product search must support multi-tier attribute cascading (e.g., Select Base Cable ➔ Select Core Count ➔ Select Gauge) rather than flat SKU search.
- **Why It Matters:**  
  MIM Inventory Master Administrator / Warehouse Operations Lead.
- **Dependent Implementation Decision:**  
  Structure of `GET /api/v1/erp/products/search` response payload and UI search autocomplete logic.
- **Recommended Default:**  
  Assume flat, unique SKU codes at the transactional line level, as demonstrated by the verified sample dataset (`CBL-4C-016-CU`, `EMT-CON-020-GI`).

---

### DEC-04: Customer Credit Status & Quoting Constraints
- **The Exact Question:**  
  Should an ERP Debtors Ledger customer with status `ON_HOLD` or `OVER_CREDIT_LIMIT` prevent the estimator from generating a quotation in QuoteFlow AI, or should it issue a warning banner?
- **Why It Matters:**  
  Commercial policies vary: some enterprises allow sales teams to prepare draft quotes for stalled accounts (pending credit committee clearance), while others enforce a strict quotation stop.
- **Who Should Confirm:**  
  MIM Credit Control Manager / Commercial Sales Manager.
- **Dependent Implementation Decision:**  
  Determines validation severity in `app.js` (`ERR_CUSTOMER_ON_HOLD`) — advisory warning vs. blocking action.
- **Recommended Default:**  
  Advisory warning banner with managerial signoff requirement. Allow estimators to draft and prepare quotations, but display an unmissable amber alert: `⚠ Customer Account is on Credit Hold. Approval required before dispatch.`

---

### DEC-05: Customer Pricing Hierarchy & Quantity Breaks
- **The Exact Question:**  
  Does the ERP calculate complex tiered pricing (volume price breaks, contracted discounts per customer group) that must be calculated in real time, or does QuoteFlow AI receive standard price lists and apply discretionary sales discounts?
- **Why It Matters:**  
  Replicating proprietary ERP pricing calculation algorithms in JavaScript introduces synchronization drift. If the ERP has complex pricing logic, QuoteFlow must delegate pricing lookup to the ERP for each line item quantity change.
- **Who Should Confirm:**  
  MIM Commercial Director / ERP Business Analyst.
- **Dependent Implementation Decision:**  
  Whether `/api/v1/erp/pricing/lookup` is queried once per product selection or reactively upon every quantity input adjustment.
- **Recommended Default:**  
  QuoteFlow queries standard catalog list price and customer-specific price list baseline once upon item selection. Quantity tier adjustments are retrieved if supported, but QuoteFlow calculation engine handles manual discount adjustments transparently.

---

### DEC-06: Availability of Staging / Sandbox ERP Environment
- **The Exact Question:**  
  Is an isolated development or staging ERP environment available for connector integration testing, or must testing initially rely entirely on synthetic mock fixtures?
- **Why It Matters:**  
  Executing live integration tests against a production ERP database — even with read-only permissions — violates change-management policy and risks performance interference with daily warehouse and invoicing operations.
- **Who Should Confirm:**  
  MIM IT Infrastructure & Security Director.
- **Dependent Implementation Decision:**  
  Phase 3 testing environment provisioning and CI/CD automated contract test pipeline.
- **Recommended Default:**  
  Build and certify Phase 3 against the automated in-memory mock adapter (`tests/contract_erp_mock_test.js`). No on-premise connection will be established until an authorized, sanitized staging environment is provisioned with signed approval.
