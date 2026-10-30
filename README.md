# MIM QuoteFlow AI — Phase 1: UI Design & Prototype

> **Tagline:** From customer enquiry to accurate quotation.  
> **Status:** Phase 1 Complete (UI Prototype & Google Stitch Screens)  
> **ERP Mode:** Demo Mode (Visual prototype only; no live database or ERP writes)

---

## 1. Overview & Purpose

**MIM QuoteFlow AI** is an enterprise-grade AI-assisted quotation workspace that operates alongside an existing MIM Windows ERP system. Its core mission is to help commercial sales engineers and estimators convert raw customer enquiries (RFQs) into accurate, validated quotations by:
- Selecting customer ledger routes (**General Ledger [G]** vs. **Debtors Ledger [D]**).
- Utilizing an **AI Enquiry Assistant** to parse unstructured customer emails and extract requested products, quantities, and lead times.
- Matching items against the **ERP Product Master** with explicit human confirmation boundaries.
- Editing quantities and selling prices in a high-density, spreadsheet-grade table with live VAT (5%), gross profit, and margin calculations.
- Enforcing validation checks (warning on below-cost lines or unconfirmed items).
- Reviewing printable A4 draft quotation previews with UAE TRN compliance.
- Initiating an explicit **Prepare for ERP Confirmation** workflow before any future ERP save.

---

## 2. Google Stitch Project & Screen Deliverables

The UI designs were created and generated in Google Stitch under project:
- **Stitch Project:** `MIM QuoteFlow AI` (`projects/4751228588731176143`)
- **Design System:** `Precision Industrial Commerce` (`assets/a661f08673a64736b34a253f74c53c65`)

### Generated Screens (In Prioritized Order)
1. **Screen One: Quotation Workspace (Highest Priority)**  
   - Screen ID: `37287fe97f2d423bbd69d10985aec3f1`
   - Complete quotation editor featuring customer ledger routing, AI assistant, spreadsheet table with confirmed/awaiting/historical price warning states, financial summary, and bottom action bar.
2. **Screen Two: Quotation Dashboard**  
   - Screen ID: `a6f13ba0274d43c5b8020ab689aec6f7`
   - Operational landing page with compact metric strip (Active Drafts, Awaiting Confirmation, Ready for Review, MTD Quoted Value), searchable quotation data table, activity timeline, and immediate attention alerts.
3. **Screen Three: Pending Drafts**  
   - Screen ID: `3cb4d729f75344169e4ddb4e40d4640d`
   - Resume workspace with status/creator/date filters, unresolved product count pills, resume action with state preservation, delete confirmation dialog, and filter empty state.
4. **Screen Four: Product Catalogue Search**  
   - Screen ID: `973393f2329f4577b04917e11905138c`
   - Modal drawer overlay for searching the live ERP product master by code or description, distinguishing exact vs. similar matches, displaying recorded costs and stock, with "+ Select Product" insertion into quotation lines.
5. **Screen Five: Quotation Preview**  
   - Screen ID: `d147aa54cb9b477a8080a6204f10e49f`
   - Client-ready, printable A4 commercial draft layout with MIM branding, UAE TRN (100293847500003), draft watermark banner, itemized 5% VAT calculations, legal terms, and dual signatory blocks.

---

## 3. Interactive Web Prototype Features

The codebase in this repository provides a standalone, fully interactive implementation of the entire quoting workflow:
- **Spreadsheet-Grade Live Table:**
  - Dynamic line total calculation: `Quantity × Selling Price`
  - Subtotal and 5% UAE VAT calculation
  - Real-time Total Cost, Gross Profit, and Margin % tracking
  - Visual status flags for **Confirmed Product**, **Awaiting ERP Product**, and **Price Warning** (historical quotation alerts)
  - Blocker warnings for selling prices below cost
- **AI Enquiry Assistant Simulation:**
  - "Extract Enquiry" parses email snippets into structured product, quantity, and lead-time chips
  - 94% confidence match banner requiring explicit user confirmation
- **ERP Product Catalogue Search Modal:**
  - Real-time search across sample SKUs (`MIM-SS-DISP-WM01`, `MIM-ACC-MK02`, `MIM-VALVE-NZ04`, etc.)
  - Filter by category and match type
  - Direct insertion into draft line items
- **Draft Persistence Engine:**
  - LocalStorage autosave and draft restoration
  - Preserves enquiry text, line order, pricing overrides, and remarks
- **ERP Confirmation Handshake Modal:**
  - 4-point verification checklist enforcing that draft data is verified prior to ERP transmission

---

## 4. Running the Prototype Locally

Open `index.html` directly in any modern desktop web browser:
```bash
# Windows PowerShell
Start-Process index.html
```
Or serve via any static file server (e.g. VS Code Live Server, python http.server, or npx serve):
```bash
npx serve .
```

---

## 5. Technology Stack & Design Tokens
- **Markup & Layout:** Semantic HTML5, CSS3 Fluid Grid, Flexbox
- **Typography:** Inter (Primary body & UI), JetBrains Mono (ERP codes & financials)
- **Palette:**
  - Navigation & Headers: Industrial Slate Navy (`#0F172A`, `#1E293B`)
  - Accent / Primary CTA: Technical Sky Blue (`#0284C7`)
  - Secondary Action / Verified: Deep Teal (`#0D9488`)
  - Surfaces: Cool Slate Canvas (`#F8FAFC`, `#FFFFFF`)
  - Semantic Status: Emerald (`#059669`), Amber (`#D97706`), Crimson (`#E11D48`)

---

## 6. Phase 2: Read-Only ERP Connector Specification

Phase 2 establishes the architectural blueprint, data mappings, security guardrails, and API contracts for safely integrating QuoteFlow AI with the on-premise MIM Windows ERP in a strictly read-only mode.

### Specification Documents:
- [Discovery Checklist & Questionnaire](file:///docs/phase-2/ERP_DISCOVERY_CHECKLIST.md): Technical discovery audit and questionnaire for the ERP administrator.
- [Connector Architecture](file:///docs/phase-2/ERP_CONNECTOR_ARCHITECTURE.md): Integration topology, evaluation of options, and the Windows Service Bridge Agent pattern.
- [API Contract](file:///docs/phase-2/ERP_CONNECTOR_API_CONTRACT.md): Versioned REST contract (`/api/v1/erp/...`) for products, customers, pricing, and health.
- [Data Mapping Specification](file:///docs/phase-2/ERP_DATA_MAPPING.md): Semantic mappings between QuoteFlow state, Bridge Agent DTOs, and candidate ERP database columns.
- [Security Model](file:///docs/phase-2/ERP_SECURITY_MODEL.md): Least-privilege permissions, Windows DPAPI secret storage, network boundaries, and read-only enforcement.
- [Test Plan](file:///docs/phase-2/ERP_CONNECTOR_TEST_PLAN.md): 13 mandatory test scenarios covering normal operation, fault injection, and mutation prohibition.
- [Open Decisions](file:///docs/phase-2/OPEN_DECISIONS.md): Structured decision log tracking unresolved questions and recommended defaults.

---

## 7. Phase 3: Read-Only Connector Foundation & Verification

Phase 3 establishes the technology-neutral connector interface, in-memory mock adapter, and security boundaries to prepare for safe ERP integration without risking production systems.

- **Readiness Report & Checklist:** [Phase 3 Readiness Report](file:///docs/phase-3/PHASE_3_READINESS_REPORT.md)
- **Connector Foundation Code:** [`src/connector/erpConnector.js`](file:///src/connector/erpConnector.js)
- **Automated Contract Test Suite:** [`tests/erp_connector_contract_test.js`](file:///tests/erp_connector_contract_test.js)

### Running All Automated Test Suites:
```bash
# 1. Calculation & Financial Logic Tests (8/8 passed)
node tests/audit_calculations_test.js

# 2. Workflow & Multi-Draft State Tests (All passed)
node tests/workflow_integration_test.js

# 3. ERP Read-Only Connector Contract Tests (13/13 passed)
node tests/erp_connector_contract_test.js

# 4. Mock-Connected Workspace Integration Tests (12/12 passed)
node tests/workspace_mock_integration_test.js
```

---

## 8. Phase 3.5: Mock-Connected Workspace Integration

In Phase 3.5, the interactive quotation workspace UI was integrated end-to-end with the verified mock ERP connector:
- **Product Search:** Live querying via `erpConnector.searchProducts()` with loading, empty, and RFC 7807 error states.
- **Customer Lookup:** Debtors Ledger search via `erpConnector.searchDebtorsCustomers()` with automatic credit-hold detection (`ACC-HOLD-09`).
- **General Ledger Isolation:** `[G]` recipient entry remains document-local with zero calls to the customer master.
- **Pricing & Cost Lookup:** Authoritative pricing retrieved via `erpConnector.lookupPricingAndCost()` with provisional WAC metadata and missing-cost handling.
- **Race Condition Protection:** Asynchronous sequence ID tracking prevents slower older queries from overwriting newer selections.
- **Strict Mock Boundary:** UI explicitly displays `Mock Demo Data` with zero claims of live ERP connectivity or record creation.

---

## 9. Phase 4: Business Rules & Workflow Hardening

Phase 4 evolves the workspace from a mock-connected visual prototype into a rule-governed quotation management system with explicit lifecycle controls, commercial approvals, audit trails, and customer-facing document formatting.

- **Phase 4 Specification & Architecture Report:** [`docs/phase-4/BUSINESS_RULES_AND_WORKFLOW.md`](file:///docs/phase-4/BUSINESS_RULES_AND_WORKFLOW.md)
- **Centralized Pricing Policy Engine:** [`src/rules/pricingPolicy.js`](file:///src/rules/pricingPolicy.js)
- **Quotation Lifecycle & Workflow Rules:** [`src/rules/workflowLifecycle.js`](file:///src/rules/workflowLifecycle.js)
- **Phase 4 Automated Test Suite:** [`tests/phase4_business_rules_test.js`](file:///tests/phase4_business_rules_test.js)

### Key Capabilities Introduced in Phase 4:
1. **Explicit Quotation Lifecycle:** Centralized 6-state machine (`DRAFT`, `IN_REVIEW`, `CHANGES_REQUESTED`, `APPROVED`, `READY_FOR_ERP`, `ERP_CONFIRMED`). UI actions cannot jump states without passing pre-condition validation.
2. **Strict Mock Security Boundary:** The `ERP_CONFIRMED` state is strictly unreachable in mock mode (`ERR_ERP_CONFIRMATION_NOT_PERMITTED_IN_MOCK`), eliminating false claims of ERP synchronization.
3. **Centralized Pricing Policy:** All commercial parameters (provisional 5% UAE VAT, provisional WAC costing, 15% discount limit, 15% minimum margin, AED currency, 2 decimal places) are managed centrally.
4. **Commercial Approval Framework:** Automatically flags discount threshold violations, low margins, and below-cost sales for review by authorized demo manager personas (`DEMO_COMMERCIAL_MANAGER`, `DEMO_FINANCE_MANAGER`). Supports `Approve`, `Reject`, and `Request Changes` workflows.
5. **Append-Only Audit Trail:** In-memory, session-persistent chronological ledger recording every lifecycle mutation, pricing override, customer route modification, and approval decision.
6. **Customer-Facing Quotation Document:** Professional A4 printable quotation featuring company letterhead, draft watermark, itemized line discounts, provisional VAT notices, and commercial validity terms.

### Running All Automated Test Suites (All 5 Pass 100%):
```bash
# 1. Calculation & Financial Logic Tests (8/8 passed)
node tests/audit_calculations_test.js

# 2. Workflow & Multi-Draft State Tests (5/5 passed)
node tests/workflow_integration_test.js

# 3. ERP Read-Only Connector Contract Tests (13/13 passed)
node tests/erp_connector_contract_test.js

# 4. Mock-Connected Workspace Integration Tests (12/12 passed)
node tests/workspace_mock_integration_test.js

# 5. Phase 4 Business Rules & Workflow Tests (88 assertions passed)
node tests/phase4_business_rules_test.js
```




