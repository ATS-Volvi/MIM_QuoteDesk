/**
 * MIM QuoteFlow AI — High-Fidelity UI Prototype
 * Core State & Interactive Engine (Phase 1.5 Verified)
 */

// Initial Sample Drafts Database
const INITIAL_DRAFTS = {
  "DRAFT-2026-0042": {
    id: "DRAFT-2026-0042",
    status: "Draft",
    createdBy: "Alex Morgan (Sales Engineer)",
    lastSaved: "Just now",
    customerRoute: "D", // D: Debtors Ledger, G: General Ledger
    customerAccount: "Al-Futtaim Engineering Ltd [ACC-88219]",
    companyName: "Al-Futtaim Engineering Ltd",
    contactPerson: "Mr. Zaid Mansoor",
    email: "z.mansoor@alfuttaim.ae",
    phone: "+971 4 213 4400",
    enquiryText: "Please quote 25 units of the stainless steel wall-mounted dispenser, including the standard mounting kit. Kindly share your best price and expected lead time.",
    enquiryExtracted: true,
    leadTime: "2 - 3 Weeks from receipt of PO",
    deliveryNotes: "Ex-works Jebel Ali Warehouse / Delivered to site within Dubai emirate",
    internalRemarks: "Customer has volume discount tier 2 applied. Need to check stock level for SS-DISP-WM01 with procurement.",
    customerRemarks: "Prices valid for 30 calendar days. Includes 12-month manufacturer replacement warranty against defects.",
    lineItems: [
      {
        id: "line-1",
        lineNo: 1,
        description: "Stainless Steel Wall Dispenser 1000ml",
        erpCode: "MIM-SS-DISP-WM01",
        variant: "304 Grade Brushed Satin, Lockable",
        qty: 25,
        unit: "PCS",
        sellingPrice: 185.00,
        cost: 115.00,
        status: "Confirmed",
        notes: ""
      },
      {
        id: "line-2",
        lineNo: 2,
        description: "Standard Mounting Kit",
        erpCode: "MIM-ACC-MK02",
        variant: "Heavy Duty Wall Anchor & Bracket Kit",
        qty: 25,
        unit: "SET",
        sellingPrice: 35.00,
        cost: 18.00,
        status: "Confirmed",
        notes: ""
      },
      {
        id: "line-3",
        lineNo: 3,
        description: "Tamper-proof Security Key Spare",
        erpCode: null, // Unassigned catalog item
        variant: "Spare Key Set (Triangular 8mm)",
        qty: 5,
        unit: "PCS",
        sellingPrice: 15.00,
        cost: null, // Unknown cost
        status: "Awaiting",
        notes: "Cost pending catalog match"
      },
      {
        id: "line-4",
        lineNo: 4,
        description: "Replacement Dispenser Nozzle & Valve",
        erpCode: "MIM-VALVE-NZ04",
        variant: "Silicone Anti-Drip Valve Core",
        qty: 10,
        unit: "PCS",
        sellingPrice: 17.00,
        cost: 9.50,
        status: "PriceWarning",
        historicalPrice: 16.00,
        notes: "Previous quotation price: 16.00 AED"
      }
    ]
  },
  "DRAFT-2026-0039": {
    id: "DRAFT-2026-0039",
    status: "Draft",
    createdBy: "Sarah Chen (Senior Estimator)",
    lastSaved: "45 mins ago",
    customerRoute: "D",
    customerAccount: "Khansaheb Civil Engineering [ACC-44102]",
    companyName: "Khansaheb Civil Engineering LLC",
    contactPerson: "Eng. Tariq Khansaheb",
    email: "tariq@khansaheb.ae",
    phone: "+971 4 333 1200",
    enquiryText: "Urgent quote required for Dubai Creek Harbour Phase 2 package: 120 sets floor dispensers and specialty nozzles.",
    enquiryExtracted: true,
    leadTime: "3 - 4 Weeks",
    deliveryNotes: "Site delivery: Dubai Creek Harbour Sector 4",
    internalRemarks: "Requires special shipping arrangement from Europe warehouse.",
    customerRemarks: "Prices valid for 15 days.",
    lineItems: [
      {
        id: "line-39-1",
        lineNo: 1,
        description: "Floor Standing Sanitizer Dispenser SS304",
        erpCode: "MIM-SS-DISP-FR01",
        variant: "Base weighted 12kg",
        qty: 120,
        unit: "PCS",
        sellingPrice: 320.00,
        cost: 295.00,
        status: "Confirmed",
        notes: ""
      },
      {
        id: "line-39-2",
        lineNo: 2,
        description: "Custom Sensor Assembly Kit",
        erpCode: null,
        variant: "Infrared automatic trigger",
        qty: 120,
        unit: "SET",
        sellingPrice: 45.00,
        cost: null, // Unknown cost - Blocker!
        status: "Awaiting",
        notes: "Blocker: Cost unavailable"
      }
    ]
  },
  "DRAFT-2026-0035": {
    id: "DRAFT-2026-0035",
    status: "Ready for Review",
    createdBy: "Tariq Al-Hashimi (Sales Engineer)",
    lastSaved: "Yesterday 16:30",
    customerRoute: "G", // General Ledger
    customerAccount: "Sobha Realty LLC [ACC-90112]",
    companyName: "Sobha Realty LLC",
    contactPerson: "Mr. Rajiv Menon",
    email: "rajiv@sobharealty.com",
    phone: "+971 4 423 8900",
    enquiryText: "Quotation for 20 units heavy duty wall mounting kits for Sobha Hartland show villa.",
    enquiryExtracted: true,
    leadTime: "Immediate (Ex-stock)",
    deliveryNotes: "Ex-works Dubai warehouse",
    internalRemarks: "All products verified in Jebel Ali stock.",
    customerRemarks: "Prices valid for 30 calendar days.",
    lineItems: [
      {
        id: "line-35-1",
        lineNo: 1,
        description: "Standard Mounting Kit",
        erpCode: "MIM-ACC-MK02",
        variant: "Heavy Duty Wall Anchor & Bracket Kit",
        qty: 20,
        unit: "SET",
        sellingPrice: 35.00,
        cost: 18.00,
        status: "Confirmed",
        notes: ""
      },
      {
        id: "line-35-2",
        lineNo: 2,
        description: "Replacement Dispenser Nozzle & Valve",
        erpCode: "MIM-VALVE-NZ04",
        variant: "Silicone Anti-Drip Valve Core",
        qty: 20,
        unit: "PCS",
        sellingPrice: 17.00,
        cost: 9.50,
        status: "Confirmed",
        notes: ""
      }
    ]
  }
};

// ERP Master Catalog Database (Demo Mode)
const ERP_CATALOG = [
  {
    code: "MIM-SS-DISP-WM01",
    description: "Stainless Steel Wall-Mounted Liquid Soap Dispenser 1000ml",
    variant: "304 Grade Brushed Satin, Lockable",
    unit: "PCS",
    cost: 115.00,
    listPrice: 185.00,
    stock: "In Stock (142 PCS at Jebel Ali WH)",
    matchType: "exact",
    category: "Dispensers"
  },
  {
    code: "MIM-SS-DISP-WM02",
    description: "Stainless Steel Wall-Mounted Foam Dispenser 800ml Satin Finish",
    variant: "316 Marine Grade Mirror Finish",
    unit: "PCS",
    cost: 142.50,
    listPrice: 220.00,
    stock: "In Stock (38 PCS)",
    matchType: "similar",
    category: "Dispensers"
  },
  {
    code: "MIM-ACC-MK02",
    description: "Heavy Duty Standard Wall Mounting Kit",
    variant: "Series A-300 Heavy Duty Anchors & Bracket",
    unit: "SET",
    cost: 18.00,
    listPrice: 35.00,
    stock: "In Stock (520 SETS)",
    matchType: "exact",
    category: "Hardware"
  },
  {
    code: "MIM-DISP-KEY-T01",
    description: "Triangular Tamper-Proof Security Key Spare for Wall Dispensers",
    variant: "Zinc Alloy Standard Triangle 8mm",
    unit: "PCS",
    cost: 6.20,
    listPrice: 15.00,
    stock: "In Stock (84 PCS)",
    matchType: "similar",
    category: "Spares"
  },
  {
    code: "MIM-VALVE-NZ04",
    description: "Replacement Dispenser Nozzle & Valve",
    variant: "Silicone Anti-Drip Valve Core, Sanitary Grade",
    unit: "PCS",
    cost: 9.50,
    listPrice: 17.00,
    stock: "In Stock (210 PCS)",
    matchType: "exact",
    category: "Spares"
  },
  {
    code: "MIM-SS-DISP-FR01",
    description: "Floor Standing Sanitizer Dispenser SS304 Heavy Duty",
    variant: "Base weighted 12kg, Anti-topple",
    unit: "PCS",
    cost: 295.00,
    listPrice: 420.00,
    stock: "Low Stock (4 PCS)",
    matchType: "similar",
    category: "Dispensers"
  }
];

// --------------------------------------------------------------------------
// ERP Connector Foundation (Mock Mode)
// --------------------------------------------------------------------------
const erpConnector = (typeof MIM_ERP !== "undefined" && MIM_ERP.createErpConnector)
  ? MIM_ERP.createErpConnector({ simulatedLatencyMs: 60 })
  : (typeof require !== "undefined" ? require("./src/connector/erpConnector").createErpConnector({ simulatedLatencyMs: 60 }) : null);

// Asynchronous Request Sequence Tracking (Prevents stale responses)
let productSearchSeq = 0;
let customerSearchSeq = 0;

// In-Memory Drafts Storage
let draftsStore = JSON.parse(JSON.stringify(INITIAL_DRAFTS));
let currentQuote = JSON.parse(JSON.stringify(draftsStore["DRAFT-2026-0042"]));
let activeScreen = "workspace"; // 'workspace', 'dashboard', 'drafts', 'preview'

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  // Load saved drafts from localStorage if available
  const savedStore = localStorage.getItem("MIM_DRAFTS_STORE");
  if (savedStore) {
    try {
      draftsStore = JSON.parse(savedStore);
      // Restore active draft or default
      const activeId = localStorage.getItem("MIM_ACTIVE_DRAFT_ID") || "DRAFT-2026-0042";
      if (draftsStore[activeId]) {
        currentQuote = JSON.parse(JSON.stringify(draftsStore[activeId]));
      }
    } catch (e) {
      console.warn("Could not load drafts from localStorage", e);
    }
  }

  setupNavigation();
  renderScreen();
});

// Setup App Navigation
function setupNavigation() {
  document.querySelectorAll("[data-nav]").forEach(el => {
    el.addEventListener("click", () => {
      const target = el.getAttribute("data-nav");
      switchScreen(target);
    });
  });

  // Global search shortcut (Cmd+K / Ctrl+K)
  window.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      const search = document.getElementById("globalSearch");
      if (search) search.focus();
    }
  });
}

function switchScreen(screenName) {
  activeScreen = screenName;
  document.querySelectorAll(".nav-item").forEach(item => {
    item.classList.toggle("active", item.getAttribute("data-nav") === screenName);
  });
  renderScreen();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderScreen() {
  const content = document.getElementById("mainContent");
  const breadcrumb = document.getElementById("currentBreadcrumb");

  switch (activeScreen) {
    case "dashboard":
      if (breadcrumb) breadcrumb.textContent = "Dashboard";
      renderDashboard(content);
      break;
    case "drafts":
      if (breadcrumb) breadcrumb.textContent = "Pending Drafts";
      renderDrafts(content);
      break;
    case "preview":
      if (breadcrumb) breadcrumb.textContent = "Quotation Preview";
      renderPreview(content);
      break;
    case "workspace":
    default:
      if (breadcrumb) breadcrumb.textContent = "Quotation Workspace";
      renderWorkspace(content);
      break;
  }
}

// --------------------------------------------------------------------------
// SCREEN 1: QUOTATION WORKSPACE
// --------------------------------------------------------------------------
function renderWorkspace(container) {
  const totals = calculateTotals();

  container.innerHTML = `
    <!-- Top Quotation Bar -->
    <div class="workspace-top-bar">
      <div>
        <div class="workspace-title-group">
          <h1 class="workspace-title">Create Quotation</h1>
          <span class="badge badge-draft">${currentQuote.status}</span>
          <span class="draft-ref">${currentQuote.id}</span>
        </div>
        <div class="meta-subtext">
          Created by <strong>${currentQuote.createdBy}</strong> • Last saved: <span id="lastSavedText">${currentQuote.lastSaved}</span> • ERP Demo Mode
        </div>
      </div>
      <div class="top-bar-actions">
        <button class="btn btn-secondary" onclick="saveDraft()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
          Save Draft
        </button>
        <button class="btn btn-secondary" onclick="switchScreen('preview')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
          Preview Quotation
        </button>
        <button class="btn btn-teal" onclick="runValidationCheck(true)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
          Validate Quotation
        </button>
      </div>
    </div>

    <!-- Customer & AI Enquiry Grid -->
    <div class="grid-2col">
      <!-- Section B: Customer Information -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            Customer & Account Details
          </div>
          <span class="badge ${currentQuote.customerRoute === 'D' ? 'badge-info' : 'badge-draft'}">
            ${currentQuote.customerRoute === 'D' ? 'Debtors Ledger [D]' : 'General Ledger [G]'}
          </span>
        </div>
        <div class="card-body">
          <div class="route-selector-tabs">
            <div class="route-tab ${currentQuote.customerRoute === 'D' ? 'active' : ''}" onclick="setCustomerRoute('D')">
              Debtors Ledger (D) — Existing Account
            </div>
            <div class="route-tab ${currentQuote.customerRoute === 'G' ? 'active' : ''}" onclick="setCustomerRoute('G')">
              General Ledger (G) — Ad-Hoc Recipient
            </div>
          </div>

          <div class="form-grid">
            ${currentQuote.customerRoute === 'D' ? `
              <div class="form-group col-span-2">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                  <label class="form-label" style="margin-bottom: 0;">Verified Debtors Account *</label>
                  <button type="button" class="btn btn-secondary btn-sm" style="font-size: 11px; padding: 2px 8px;" onclick="openCustomerSearchModal()">
                    🔍 Search Debtors (Mock)
                  </button>
                </div>
                <select class="form-select" id="customerAccountSelect" onchange="handleAccountChange(this.value)">
                  <option value="Al-Futtaim Engineering Ltd [ACC-88219]" ${currentQuote.customerAccount && currentQuote.customerAccount.includes('ACC-88219') ? 'selected' : ''}>Al-Futtaim Engineering Ltd — ACC-88219 (Credit Active)</option>
                  <option value="Khansaheb Civil Engineering [ACC-44102]" ${currentQuote.customerAccount && currentQuote.customerAccount.includes('ACC-44102') ? 'selected' : ''}>Khansaheb Civil Engineering — ACC-44102</option>
                  <option value="Dutco Balfour Beatty [ACC-12093]" ${currentQuote.customerAccount && currentQuote.customerAccount.includes('ACC-12093') ? 'selected' : ''}>Dutco Balfour Beatty — ACC-12093</option>
                  <option value="Sobha Realty LLC [ACC-90112]" ${currentQuote.customerAccount && currentQuote.customerAccount.includes('ACC-90112') ? 'selected' : ''}>Sobha Realty LLC — ACC-90112</option>
                  <option value="Stalled Commercial Contractors LLC [ACC-HOLD-09]" ${currentQuote.customerAccount && currentQuote.customerAccount.includes('ACC-HOLD-09') ? 'selected' : ''}>Stalled Commercial Contractors — ACC-HOLD-09 (Credit Hold)</option>
                </select>
                ${(currentQuote.customerCreditStatus === 'CREDIT_HOLD' || (currentQuote.customerAccount && currentQuote.customerAccount.includes('ACC-HOLD-09'))) ? `
                  <div class="warning-banner-box" style="margin-top: 6px;">
                    ⚠️ <strong>Account on Credit Hold:</strong> Customer is marked ON_HOLD in ERP Debtors Ledger. Commercial approval required before order release.
                  </div>
                ` : ''}
                <div style="font-size: 10.5px; color: var(--slate-500); margin-top: 3px;">
                  ℹ️ Linked to Mock ERP Debtors Ledger. Selecting an account verifies approved credit terms and TRN.
                </div>
              </div>
            ` : `
              <div class="form-group col-span-2">
                <label class="form-label">Recipient / Company Name (General Ledger Ad-Hoc) *</label>
                <input type="text" class="form-input" id="companyNameInput" value="${escapeHtml(currentQuote.companyName)}" oninput="currentQuote.companyName = this.value" placeholder="Enter recipient organization">
                <div style="font-size: 10.5px; color: var(--slate-500); margin-top: 3px;">
                  ℹ️ General Ledger routing: Quoting directly to recipient. Does not search or create an ERP customer record.
                </div>
              </div>
            `}

            <div class="form-group">
              <label class="form-label">Contact Person</label>
              <input type="text" class="form-input" value="${escapeHtml(currentQuote.contactPerson)}" oninput="currentQuote.contactPerson = this.value">
            </div>

            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input type="email" class="form-input" value="${escapeHtml(currentQuote.email)}" oninput="currentQuote.email = this.value">
            </div>

            <div class="form-group">
              <label class="form-label">Phone</label>
              <input type="text" class="form-input" value="${escapeHtml(currentQuote.phone)}" oninput="currentQuote.phone = this.value">
            </div>

            <div class="form-group">
              <label class="form-label">Payment Terms</label>
              <input type="text" class="form-input" value="30 Days Net (Standard Credit)" readonly style="background-color: var(--slate-100);">
            </div>

            <div class="form-group col-span-2">
              <label class="form-label">Original Customer Enquiry (RFQ Text)</label>
              <textarea class="form-textarea" id="enquiryTextInput" oninput="currentQuote.enquiryText = this.value">${escapeHtml(currentQuote.enquiryText)}</textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Section C: AI Enquiry Assistant -->
      <div class="card ai-assistant-card">
        <div class="card-header" style="background: transparent;">
          <div class="card-title">
            <span class="ai-header-badge">AI Assistant</span>
            AI Enquiry Assistant
          </div>
          <button class="btn btn-primary btn-sm" onclick="extractEnquiry()">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
            Extract Enquiry
          </button>
        </div>
        <div class="card-body">
          <div class="enquiry-quote-box" id="enquiryQuoteDisplay">
            "${escapeHtml(currentQuote.enquiryText)}"
          </div>

          <div class="ai-chips-grid">
            <div class="ai-chip">
              <div class="ai-chip-label">Product Requested</div>
              <div class="ai-chip-val" id="chipProduct">Stainless steel wall-mounted dispenser</div>
            </div>
            <div class="ai-chip">
              <div class="ai-chip-label">Extracted Quantity</div>
              <div class="ai-chip-val" id="chipQty">25 units</div>
            </div>
            <div class="ai-chip">
              <div class="ai-chip-label">Additional Requirement</div>
              <div class="ai-chip-val" id="chipAddon">Standard mounting kit</div>
            </div>
            <div class="ai-chip">
              <div class="ai-chip-label">Lead Time Req.</div>
              <div class="ai-chip-val" id="chipLead">Not specified (Standard)</div>
            </div>
          </div>

          <!-- Suggested ERP Product Matches -->
          <div class="ai-match-box">
            <div class="ai-match-top">
              <div style="font-weight: 600; font-size: 12px; color: var(--navy-900);">
                Suggested Match: <code>MIM-SS-DISP-WM01</code>
              </div>
              <span class="confidence-pill">94% Confidence Match</span>
            </div>
            <div style="font-size: 11.5px; color: var(--slate-700);">
              Stainless Steel Wall Dispenser 1000ml (304 Grade Brushed Satin)
            </div>

            <div class="ai-policy-notice">
              ⚠️ <strong>AI suggestion — confirmation required:</strong> AI suggestions must be confirmed against the ERP product master before quotation finalisation.
            </div>

            <div style="display: flex; gap: 8px; margin-top: 10px;">
              <button class="btn btn-teal btn-sm" onclick="confirmAIMatch()">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Confirm Product
              </button>
              <button class="btn btn-secondary btn-sm" onclick="openCatalogModal('dispenser')">
                View Alternatives
              </button>
              <button class="btn btn-ghost btn-sm" onclick="markAIMatchUnmatched()">
                Mark as Unmatched
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section D: Live Quotation Line-Item Table -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>
          Quotation Line Items (${currentQuote.lineItems.length} lines)
        </div>
        <div style="font-size: 11px; color: var(--slate-500);">
          All values in AED • UAE VAT at 5% applies
        </div>
      </div>
      <div class="card-body" style="padding: 0;">
        <div class="table-container" style="border: none; margin-bottom: 0;">
          <table class="quote-table">
            <thead>
              <tr>
                <th style="width: 40px; text-align: center;">#</th>
                <th style="min-width: 220px;">Product / Description</th>
                <th style="width: 140px;">ERP Code</th>
                <th style="width: 180px;">Variant / Spec</th>
                <th style="width: 80px; text-align: right;">Qty</th>
                <th style="width: 60px;">Unit</th>
                <th style="width: 110px; text-align: right;">Selling Price</th>
                <th style="width: 100px; text-align: right;">Cost</th>
                <th style="width: 110px; text-align: right;">Line Total</th>
                <th style="width: 140px;">Status</th>
                <th style="width: 90px; text-align: center;">Actions</th>
              </tr>
            </thead>
            <tbody id="lineItemsTableBody">
              ${renderTableRows()}
            </tbody>
          </table>
        </div>
        <div class="table-footer-bar" style="padding: 12px 16px; border-top: 1px solid var(--slate-200); background-color: var(--slate-50);">
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-primary btn-sm" onclick="openCatalogModal()">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              + Add Product (Catalog Search)
            </button>
            <button class="btn btn-secondary btn-sm" onclick="addUnmatchedItem()">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              + Add Unmatched Item
            </button>
          </div>
          <div style="font-size: 11.5px; color: var(--slate-600);">
            Total Units: <strong>${totals.totalUnits}</strong> across <strong>${currentQuote.lineItems.length}</strong> items
          </div>
        </div>
      </div>
    </div>

    <!-- Section E & F: Pricing Summary & Commercial Terms -->
    <div class="summary-terms-grid">
      <!-- Section F: Commercial Terms -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            Lead Time & Commercial Terms
          </div>
        </div>
        <div class="card-body">
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Quotation-Level Lead Time *</label>
              <input type="text" class="form-input" value="${escapeHtml(currentQuote.leadTime)}" oninput="currentQuote.leadTime = this.value">
            </div>
            <div class="form-group">
              <label class="form-label">Delivery / Fulfilment Terms</label>
              <input type="text" class="form-input" value="${escapeHtml(currentQuote.deliveryNotes)}" oninput="currentQuote.deliveryNotes = this.value">
            </div>
            <div class="form-group col-span-2">
              <label class="form-label">Internal Remarks (Private to sales & management)</label>
              <textarea class="form-textarea" oninput="currentQuote.internalRemarks = this.value">${escapeHtml(currentQuote.internalRemarks)}</textarea>
            </div>
            <div class="form-group col-span-2">
              <label class="form-label">Customer-Facing Remarks (Printed on formal quotation)</label>
              <textarea class="form-textarea" oninput="currentQuote.customerRemarks = this.value">${escapeHtml(currentQuote.customerRemarks)}</textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Section E: Pricing Summary Panel -->
      <div class="financial-summary-card">
        <div class="card-title" style="margin-bottom: 12px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          Pricing Summary
        </div>

        <div class="summary-row">
          <span class="text-muted">Subtotal (Excl. VAT)</span>
          <span class="font-mono" style="font-weight: 600;">AED ${formatMoney(totals.subtotal)}</span>
        </div>

        <div class="summary-row">
          <span class="text-muted">VAT at 5%</span>
          <span class="font-mono">AED ${formatMoney(totals.vat)}</span>
        </div>

        <div class="summary-row grand-total">
          <span>Grand Total</span>
          <span class="font-mono" style="color: var(--primary);">AED ${formatMoney(totals.grandTotal)}</span>
        </div>

        <div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--slate-200);">
          <div style="font-size: 11px; font-weight: 700; color: var(--slate-500); text-transform: uppercase; margin-bottom: 8px;">
            Commercial Margin Analysis
          </div>

          <div class="summary-row">
            <span class="text-muted">Total Cost</span>
            <span class="font-mono">
              ${totals.hasUnknownCost ? '<span class="text-warning">Unknown (1+ missing)</span>' : `AED ${formatMoney(totals.totalCost)}`}
            </span>
          </div>

          <div class="summary-row">
            <span class="text-muted">Gross Profit</span>
            <span class="font-mono">
              ${totals.hasUnknownCost ? '<span class="text-warning">Unknown</span>' : `AED ${formatMoney(totals.grossProfit)}`}
            </span>
          </div>

          <div class="summary-row" style="border-bottom: none;">
            <span class="text-muted">Gross Margin %</span>
            <span>
              ${totals.hasUnknownCost 
                ? '<span class="badge badge-warning">Unknown</span>' 
                : `<span class="margin-chip">${totals.grossMargin.toFixed(1)}%</span>`}
            </span>
          </div>

          ${totals.hasPriceBelowCost ? `
            <div style="margin-top: 10px; padding: 6px 8px; background-color: var(--danger-bg); border: 1px solid var(--danger-border); border-radius: var(--radius-sm); font-size: 11px; color: var(--danger);">
              ⚠️ <strong>Margin Violation:</strong> One or more items are priced below cost. Quotation finalisation is blocked.
            </div>
          ` : ''}

          ${totals.hasUnknownCost ? `
            <div style="margin-top: 8px; font-size: 10.5px; color: var(--warning);">
              ⚠️ Costs must be resolved in catalog before ERP submission.
            </div>
          ` : ''}
        </div>
      </div>
    </div>

    <!-- Section G: Validation Panel -->
    <div class="validation-strip">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-weight: 700; font-size: 12px; color: var(--navy-900);">Quotation Validation:</span>
      </div>
      <div class="validation-items">
        <div class="check-item">
          <span class="check-icon-ready">✓</span>
          <span>Customer Route</span>
        </div>
        <div class="check-item">
          <span class="check-icon-ready">✓</span>
          <span>Customer Details</span>
        </div>
        <div class="check-item">
          ${totals.hasUnmatchedItems ? '<span class="check-icon-warning">⚠️</span>' : '<span class="check-icon-ready">✓</span>'}
          <span>Products Confirmed (${totals.hasUnmatchedItems ? 'Unmatched Items Present' : 'All Confirmed'})</span>
        </div>
        <div class="check-item">
          ${totals.hasUnknownCost ? '<span class="check-icon-warning">⚠️</span>' : '<span class="check-icon-ready">✓</span>'}
          <span>Costs Available (${totals.hasUnknownCost ? 'Cost Missing' : 'Complete'})</span>
        </div>
        <div class="check-item">
          ${totals.hasPriceBelowCost ? '<span class="check-icon-blocked">✕</span>' : '<span class="check-icon-ready">✓</span>'}
          <span>Price Above Cost</span>
        </div>
        <div class="check-item">
          <span class="check-icon-ready">✓</span>
          <span>Lead Time</span>
        </div>
      </div>
    </div>

    <!-- Section G Bottom Sticky Action Bar -->
    <div class="bottom-action-bar">
      <div style="display: flex; align-items: center; gap: 12px; font-size: 11.5px; color: var(--slate-500);">
        <span>Auto-save: <strong style="color: var(--success);">Active</strong></span>
        <span>•</span>
        <span>Status: <strong style="color: var(--navy-900);">Workspace Draft</strong></span>
      </div>
      <div style="display: flex; gap: 10px;">
        <button class="btn btn-secondary" onclick="saveDraft()">Save Draft</button>
        <button class="btn btn-secondary" onclick="runValidationCheck(true)">Validate Quotation</button>
        <button class="btn btn-secondary" onclick="switchScreen('preview')">Preview Quotation</button>
        <button class="btn btn-primary" onclick="openErpConfirmModal()">
          Prepare for ERP Confirmation →
        </button>
      </div>
    </div>
  `;
}

// Render dynamic rows in Line-Item Table
function renderTableRows() {
  return currentQuote.lineItems.map((item, index) => {
    const qty = Math.max(1, Math.floor(Number(item.qty) || 1));
    const sellingPrice = Math.max(0, Number(item.sellingPrice) || 0);
    const lineTotal = Math.round(qty * sellingPrice * 100) / 100;
    
    const isBelowCost = item.cost !== null && sellingPrice < item.cost;
    const isCostUnknown = item.cost === null || item.cost === undefined;

    let rowClass = "row-confirmed";
    let statusBadge = '<span class="badge badge-confirmed">Confirmed</span>';

    if (item.status === "Awaiting" || !item.erpCode) {
      rowClass = "row-awaiting";
      statusBadge = '<span class="badge badge-warning">Awaiting ERP</span>';
    } else if (item.status === "PriceWarning") {
      rowClass = "row-warning";
      statusBadge = '<span class="badge badge-danger">Price Review</span>';
    }

    if (isBelowCost) {
      rowClass = "row-danger";
      statusBadge = '<span class="badge badge-danger">Below Cost</span>';
    }

    return `
      <tr class="${rowClass}" id="row-${item.id}">
        <td style="text-align: center; font-weight: 600; color: var(--slate-500);">${index + 1}</td>
        <td>
          <input type="text" class="form-input" style="padding: 3px 6px; font-size: 12px;" 
                 value="${escapeHtml(item.description)}" 
                 onchange="updateRowField('${item.id}', 'description', this.value)">
        </td>
        <td>
          ${item.erpCode 
            ? `<span class="erp-code-tag">${item.erpCode}</span>` 
            : `<button class="btn btn-secondary btn-sm" style="font-size: 10.5px; padding: 2px 6px;" onclick="openCatalogModalForLine('${item.id}')">
                🔍 Match SKU
              </button>`}
        </td>
        <td>
          <input type="text" class="form-input" style="padding: 3px 6px; font-size: 11.5px; color: var(--slate-600);" 
                 value="${escapeHtml(item.variant)}" 
                 onchange="updateRowField('${item.id}', 'variant', this.value)">
        </td>
        <td style="text-align: right;">
          <input type="number" class="inline-num-input" min="1" 
                 value="${qty}" 
                 onchange="updateRowField('${item.id}', 'qty', this.value)">
        </td>
        <td>
          <select class="form-select" style="padding: 2px 4px; font-size: 11px; width: 55px;" 
                  onchange="updateRowField('${item.id}', 'unit', this.value)">
            <option value="PCS" ${item.unit === 'PCS' ? 'selected' : ''}>PCS</option>
            <option value="SET" ${item.unit === 'SET' ? 'selected' : ''}>SET</option>
            <option value="MTR" ${item.unit === 'MTR' ? 'selected' : ''}>MTR</option>
            <option value="BOX" ${item.unit === 'BOX' ? 'selected' : ''}>BOX</option>
          </select>
        </td>
        <td style="text-align: right;">
          <input type="number" class="inline-num-input" step="0.5" 
                 value="${sellingPrice.toFixed(2)}" 
                 onchange="updateRowField('${item.id}', 'sellingPrice', this.value)">
          ${item.historicalPrice ? `
            <div style="font-size: 9.5px; color: var(--danger); margin-top: 2px; white-space: nowrap;">
              Prev: ${item.historicalPrice.toFixed(2)}
            </div>
            ${item.status === 'PriceWarning' ? `
              <div style="display: flex; gap: 4px; margin-top: 2px;">
                <button class="btn btn-sm btn-ghost" style="padding: 1px 4px; font-size: 9px;" onclick="resolvePriceWarning('${item.id}', 'accept')">Accept</button>
                <button class="btn btn-sm btn-ghost" style="padding: 1px 4px; font-size: 9px;" onclick="resolvePriceWarning('${item.id}', 'revert')">Revert</button>
              </div>
            ` : ''}
          ` : ''}
        </td>
        <td style="text-align: right; font-family: var(--font-mono);">
          ${isCostUnknown 
            ? '<span class="text-warning" title="Cost pending ERP master link">Unknown</span>' 
            : `AED ${Number(item.cost).toFixed(2)}`}
          ${item.costMetadata ? `<div class="provisional-cost-pill" title="Valuation basis is provisional demo data.">${item.costMetadata.costType === 'WEIGHTED_AVERAGE_COST' ? 'WAC (Demo)' : (item.costMetadata.costType || 'Provisional')}</div>` : ''}
        </td>
        <td style="text-align: right; font-family: var(--font-mono); font-weight: 600;">
          AED ${formatMoney(lineTotal)}
        </td>
        <td>
          ${statusBadge}
        </td>
        <td style="text-align: center;">
          <button class="icon-btn" title="Remove line item" onclick="removeLineItem('${item.id}')">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </td>
      </tr>
    `;
  }).join("");
}

// Calculations Engine with Strict Decimal Precision
function calculateTotals() {
  let subtotal = 0;
  let totalCost = 0;
  let hasUnknownCost = false;
  let hasPriceBelowCost = false;
  let hasUnmatchedItems = false;
  let totalUnits = 0;

  currentQuote.lineItems.forEach(item => {
    const qty = Math.max(1, Math.floor(Number(item.qty) || 1));
    const sellingPrice = Math.max(0, Number(item.sellingPrice) || 0);
    const lineTotal = Math.round(qty * sellingPrice * 100) / 100;
    
    subtotal += lineTotal;
    totalUnits += qty;

    if (item.cost === null || item.cost === undefined || isNaN(item.cost)) {
      hasUnknownCost = true;
    } else {
      const cost = Number(item.cost);
      totalCost += Math.round(qty * cost * 100) / 100;
      if (sellingPrice < cost) {
        hasPriceBelowCost = true;
      }
    }

    if (!item.erpCode) {
      hasUnmatchedItems = true;
    }
  });

  subtotal = Math.round(subtotal * 100) / 100;
  totalCost = Math.round(totalCost * 100) / 100;

  const vat = Math.round(subtotal * 0.05 * 100) / 100;
  const grandTotal = Math.round((subtotal + vat) * 100) / 100;
  const grossProfit = hasUnknownCost ? null : Math.round((subtotal - totalCost) * 100) / 100;
  const grossMargin = (hasUnknownCost || subtotal === 0) ? (hasUnknownCost ? null : 0) : Math.round(((grossProfit / subtotal) * 100) * 10) / 10;

  return {
    subtotal,
    vat,
    grandTotal,
    totalCost: hasUnknownCost ? null : totalCost,
    grossProfit,
    grossMargin,
    hasUnknownCost,
    hasPriceBelowCost,
    hasUnmatchedItems,
    totalUnits
  };
}

function updateRowField(id, field, value) {
  const item = currentQuote.lineItems.find(i => i.id === id);
  if (!item) return;

  if (field === "qty") {
    item.qty = Math.max(1, Math.floor(parseFloat(value) || 1));
  } else if (field === "sellingPrice") {
    item.sellingPrice = Math.max(0, Math.round((parseFloat(value) || 0) * 100) / 100);
  } else {
    item[field] = value;
  }

  renderWorkspace(document.getElementById("mainContent"));
}

function resolvePriceWarning(id, action) {
  const item = currentQuote.lineItems.find(i => i.id === id);
  if (!item) return;

  if (action === "accept") {
    item.status = "Confirmed";
    showToast("Price override accepted.");
  } else if (action === "revert") {
    item.sellingPrice = item.historicalPrice;
    item.status = "Confirmed";
    showToast(`Price reverted to historical rate: AED ${item.historicalPrice.toFixed(2)}.`);
  }

  renderWorkspace(document.getElementById("mainContent"));
}

function removeLineItem(id) {
  if (currentQuote.lineItems.length <= 1) {
    showToast("A quotation requires at least one product line.");
    return;
  }
  currentQuote.lineItems = currentQuote.lineItems.filter(i => i.id !== id);
  renderWorkspace(document.getElementById("mainContent"));
  showToast("Line item removed.");
}

function addUnmatchedItem() {
  const nextNo = currentQuote.lineItems.length + 1;
  currentQuote.lineItems.push({
    id: "line-" + Date.now(),
    lineNo: nextNo,
    description: "New Custom / Unmatched Item",
    erpCode: null,
    variant: "Specification required",
    qty: 1,
    unit: "PCS",
    sellingPrice: 100.00,
    cost: null,
    status: "Awaiting",
    notes: "Requires ERP product master lookup"
  });
  renderWorkspace(document.getElementById("mainContent"));
  showToast("Unmatched item row added. Cost & ERP code required.");
}

function setCustomerRoute(route) {
  currentQuote.customerRoute = route;
  if (route === "G") {
    currentQuote.customerAccount = null;
    currentQuote.customerCreditStatus = null;
  } else if (!currentQuote.customerAccount) {
    currentQuote.customerAccount = "Al-Futtaim Engineering Ltd [ACC-88219]";
    currentQuote.customerCreditStatus = "APPROVED";
  }
  renderWorkspace(document.getElementById("mainContent"));
  saveDraft();
}

function handleAccountChange(accountName) {
  currentQuote.customerAccount = accountName;
  if (accountName.includes("ACC-88219") || accountName.includes("Al-Futtaim")) {
    currentQuote.companyName = "Al-Futtaim Engineering & Technologies LLC";
    currentQuote.contactPerson = "Mr. Zaid Mansoor";
    currentQuote.email = "z.mansoor@alfuttaim.ae";
    currentQuote.phone = "+971 4 213 4400";
    currentQuote.customerCreditStatus = "APPROVED";
    currentQuote.trn = "100293847200003";
  } else if (accountName.includes("ACC-44102") || accountName.includes("Khansaheb")) {
    currentQuote.companyName = "Khansaheb Civil Engineering LLC";
    currentQuote.contactPerson = "Eng. Tariq Khansaheb";
    currentQuote.email = "tariq@khansaheb.ae";
    currentQuote.phone = "+971 4 333 1200";
    currentQuote.customerCreditStatus = "APPROVED";
    currentQuote.trn = "100348291000003";
  } else if (accountName.includes("ACC-90112") || accountName.includes("Sobha")) {
    currentQuote.companyName = "Sobha Realty LLC";
    currentQuote.contactPerson = "Mr. Rajiv Menon";
    currentQuote.email = "rajiv@sobharealty.com";
    currentQuote.phone = "+971 4 423 8900";
    currentQuote.customerCreditStatus = "APPROVED";
    currentQuote.trn = "100492817300003";
  } else if (accountName.includes("ACC-12093") || accountName.includes("Dutco")) {
    currentQuote.companyName = "Dutco Balfour Beatty LLC";
    currentQuote.contactPerson = "Mr. Kevin Clark";
    currentQuote.email = "k.clark@dutco.ae";
    currentQuote.phone = "+971 4 885 1100";
    currentQuote.customerCreditStatus = "APPROVED";
    currentQuote.trn = "100582910400003";
  } else if (accountName.includes("ACC-HOLD-09") || accountName.includes("Stalled")) {
    currentQuote.companyName = "Stalled Commercial Contractors LLC";
    currentQuote.contactPerson = "Mr. Nabil Dawood";
    currentQuote.email = "nabil@stalledcontractors.ae";
    currentQuote.phone = "+971 4 991 2233";
    currentQuote.customerCreditStatus = "CREDIT_HOLD";
    currentQuote.trn = "100998877600003";
  }
  renderWorkspace(document.getElementById("mainContent"));
  saveDraft();
}

// --------------------------------------------------------------------------
// DEBTORS CUSTOMER SEARCH MODAL (MOCK ERP CONNECTOR)
// --------------------------------------------------------------------------
function openCustomerSearchModal() {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.id = "customerModalOverlay";

  overlay.innerHTML = `
    <div class="modal-dialog" style="max-width: 680px;">
      <div class="modal-header">
        <div>
          <div class="modal-title">ERP Debtors Ledger Customer Search</div>
          <div style="font-size: 11px; color: var(--slate-500); margin-top: 2px;">
            Search verified Debtors accounts in the on-premise ERP. (Connected via Mock Adapter)
          </div>
        </div>
        <button class="icon-btn" onclick="closeCustomerModal()">✕</button>
      </div>

      <div class="modal-body">
        <div style="display: flex; gap: 10px; margin-bottom: 12px;">
          <input type="text" class="form-input" id="debtorsSearchInput"
                 placeholder="Search by Account Code, Legal Name, or TRN (e.g. Al-Futtaim, ACC-44102, 10029)..."
                 oninput="filterDebtorsCustomers(this.value)">
          <button class="btn btn-primary" onclick="filterDebtorsCustomers(document.getElementById('debtorsSearchInput').value)">
            Search
          </button>
        </div>

        <div id="debtorsStatusContainer"></div>

        <div class="table-container" style="max-height: 320px;">
          <table class="quote-table">
            <thead>
              <tr>
                <th style="width: 110px;">Account Code</th>
                <th>Legal Name / Trade Name</th>
                <th style="width: 140px;">TRN</th>
                <th style="width: 90px;">Credit Status</th>
                <th style="width: 90px; text-align: center;">Action</th>
              </tr>
            </thead>
            <tbody id="debtorsTableBody">
              <tr><td colspan="5" style="text-align: center; padding: 20px; color: var(--slate-500);">Type at least 2 characters to search Debtors accounts...</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="modal-footer">
        <div style="flex: 1; font-size: 11px; color: var(--slate-500);">
          Data Source: <strong>Mock Demo Data (Unverified)</strong> • Selecting binds verified account to draft.
        </div>
        <button class="btn btn-secondary" onclick="closeCustomerModal()">Cancel</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  overlay.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeCustomerModal();
  });

  filterDebtorsCustomers("ACC");
}

function closeCustomerModal() {
  const modal = document.getElementById("customerModalOverlay");
  if (modal) modal.remove();
}

async function filterDebtorsCustomers(query) {
  const q = (query || "").trim();
  const statusContainer = document.getElementById("debtorsStatusContainer");
  const tbody = document.getElementById("debtorsTableBody");
  if (!statusContainer || !tbody) return;

  if (q.length < 2) {
    statusContainer.innerHTML = "";
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 20px; color: var(--slate-500);">Type at least 2 characters to search Debtors accounts...</td></tr>`;
    return;
  }

  const currentSeq = ++customerSearchSeq;
  statusContainer.innerHTML = `<div style="padding: 8px 0; color: var(--slate-500); font-size: 11.5px;"><span class="spinner"></span> Querying Mock ERP Debtors Ledger...</div>`;

  if (!erpConnector) {
    statusContainer.innerHTML = `<div class="error-banner-box">ERP Connector is not loaded.</div>`;
    return;
  }

  const res = await erpConnector.searchDebtorsCustomers({ search: q, limit: 15 });
  if (currentSeq !== customerSearchSeq) return; // Prevent stale responses

  if (!res.success) {
    statusContainer.innerHTML = `
      <div class="error-banner-box">
        <strong>${escapeHtml(res.error.code)}:</strong> ${escapeHtml(res.error.detail)}
        <div style="font-size: 10.5px; margin-top: 3px;">${escapeHtml(res.error.user_action || '')}</div>
      </div>
    `;
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 20px; color: var(--slate-500);">No matching Debtors accounts.</td></tr>`;
    return;
  }

  statusContainer.innerHTML = "";
  const items = res.data.items || [];
  if (items.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 20px; color: var(--slate-500);">No accounts found matching "${escapeHtml(q)}".</td></tr>`;
    return;
  }

  tbody.innerHTML = items.map(c => `
    <tr>
      <td><span class="erp-code-tag">${escapeHtml(c.account_id)}</span></td>
      <td>
        <strong>${escapeHtml(c.legal_name)}</strong>
        <div style="font-size: 10.5px; color: var(--slate-500);">${escapeHtml(c.trade_name || '')}</div>
      </td>
      <td class="font-mono" style="font-size: 11px;">${escapeHtml(c.tax_registration_number || 'N/A')}</td>
      <td>
        <span class="badge ${c.credit_status === 'APPROVED' ? 'badge-confirmed' : 'badge-danger'}">
          ${escapeHtml(c.credit_status || 'UNKNOWN')}
        </span>
      </td>
      <td style="text-align: center;">
        <button class="btn btn-primary btn-sm" onclick="selectCustomerFromSearch('${escapeHtml(c.account_id)}')">
          + Select
        </button>
      </td>
    </tr>
  `).join("");
}

async function selectCustomerFromSearch(accountId) {
  if (!erpConnector) return;
  const res = await erpConnector.searchDebtorsCustomers({ search: accountId, limit: 1 });
  if (!res.success || !res.data.items.length) {
    showToast("Could not retrieve customer details from connector.");
    return;
  }

  const c = res.data.items[0];
  currentQuote.customerAccount = `${c.legal_name} [${c.account_id}]`;
  currentQuote.companyName = c.legal_name;
  currentQuote.contactPerson = c.contact_person || currentQuote.contactPerson || "Commercial Contact";
  currentQuote.email = c.email || currentQuote.email || "";
  currentQuote.phone = c.phone || currentQuote.phone || "";
  currentQuote.customerCreditStatus = c.credit_status;
  currentQuote.trn = c.tax_registration_number;

  closeCustomerModal();
  renderWorkspace(document.getElementById("mainContent"));
  saveDraft();

  if (c.credit_status === "CREDIT_HOLD" || c.status === "ON_HOLD") {
    showToast("⚠️ Notice: Customer is on CREDIT HOLD. Commercial approval required.");
  } else {
    showToast(`Debtors customer linked: ${c.account_id}`);
  }
}

// --------------------------------------------------------------------------
// AI ASSISTANT ACTIONS
// --------------------------------------------------------------------------
function extractEnquiry() {
  const enquiryText = document.getElementById("enquiryTextInput")?.value || currentQuote.enquiryText;
  showToast("AI Enquiry Assistant: Extracting requirements...");

  setTimeout(() => {
    const chipP = document.getElementById("chipProduct");
    const chipQ = document.getElementById("chipQty");
    const chipA = document.getElementById("chipAddon");
    const chipL = document.getElementById("chipLead");

    if (chipP) chipP.textContent = "Stainless steel wall-mounted dispenser";
    if (chipQ) chipQ.textContent = "25 units";
    if (chipA) chipA.textContent = "Standard mounting kit";
    if (chipL) chipL.textContent = "Standard Lead Time";

    showToast("Extraction complete. Suggested ERP match ready.");
  }, 400);
}

function confirmAIMatch() {
  const row = currentQuote.lineItems.find(i => i.id === "line-1");
  if (row) {
    row.status = "Confirmed";
    row.erpCode = "MIM-SS-DISP-WM01";
    row.cost = 115.00;
  }
  renderWorkspace(document.getElementById("mainContent"));
  showToast("Product confirmed against ERP Product Master: MIM-SS-DISP-WM01.");
}

function markAIMatchUnmatched() {
  const row = currentQuote.lineItems.find(i => i.id === "line-1");
  if (row) {
    row.status = "Awaiting";
    row.erpCode = null;
    row.cost = null;
  }
  renderWorkspace(document.getElementById("mainContent"));
  showToast("Marked as Unmatched. ERP code cleared.");
}

// --------------------------------------------------------------------------
// SCREEN 4: PRODUCT CATALOG SEARCH MODAL (MOCK ERP CONNECTOR)
// --------------------------------------------------------------------------
let targetLineForCatalog = null;

function openCatalogModal(initialQuery = "") {
  targetLineForCatalog = null;
  showCatalogModal(initialQuery);
}

function openCatalogModalForLine(lineId) {
  targetLineForCatalog = lineId;
  showCatalogModal("");
}

function showCatalogModal(initialQuery = "") {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.id = "catalogModalOverlay";

  overlay.innerHTML = `
    <div class="modal-dialog">
      <div class="modal-header">
        <div>
          <div class="modal-title">ERP Product Catalogue Search (Mock Connector)</div>
          <div style="font-size: 11px; color: var(--slate-500); margin-top: 2px;">
            Connected to MIM Windows ERP Read-Only Mock Adapter. Selecting links verified SKU and baseline cost to draft.
          </div>
        </div>
        <button class="icon-btn" onclick="closeCatalogModal()">✕</button>
      </div>

      <div class="modal-body">
        <div style="display: flex; gap: 10px; margin-bottom: 12px;">
          <div style="flex: 1; position: relative;">
            <input type="text" class="form-input" id="catalogSearchQuery" 
                   value="${escapeHtml(initialQuery)}" placeholder="Search by SKU, Description, Variant (e.g. MIM-SS, Dispenser, 304, Nozzle, CBL)..." 
                   oninput="filterCatalogResults()">
          </div>
          <select class="form-select" style="width: 160px;" id="catalogCategorySelect" onchange="filterCatalogResults()">
            <option value="All">All Categories</option>
            <option value="Dispensers">Dispensers</option>
            <option value="Hardware">Hardware</option>
            <option value="Spares">Spares</option>
            <option value="Cables">Cables</option>
            <option value="Conduits">Conduits</option>
          </select>
          <button class="btn btn-secondary" onclick="filterCatalogResults()">Search</button>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; font-size: 11.5px;">
          <div style="display: flex; gap: 8px; align-items: center;">
            <span class="badge badge-info" id="matchCountBadge">Searching...</span>
            <span class="badge-mock">Mock Demo Data</span>
          </div>
          <span style="color: var(--slate-500);">Warehouse: Jebel Ali Free Zone (Active)</span>
        </div>

        <div id="catalogStatusContainer"></div>

        <div class="table-container" style="max-height: 380px;">
          <table class="quote-table">
            <thead>
              <tr>
                <th style="width: 100px;">Match</th>
                <th style="width: 140px;">ERP Code</th>
                <th>Description</th>
                <th>Variant / Spec</th>
                <th style="width: 60px;">Unit</th>
                <th style="width: 100px; text-align: right;">List Price</th>
                <th style="width: 130px;">Stock</th>
                <th style="width: 100px; text-align: center;">Action</th>
              </tr>
            </thead>
            <tbody id="catalogTableBody">
              <tr><td colspan="8" style="text-align: center; padding: 24px; color: var(--slate-500);"><span class="spinner"></span> Loading ERP Product Master...</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="modal-footer">
        <div style="flex: 1; font-size: 11px; color: var(--slate-500);">
          Press <kbd>ESC</kbd> to exit. Explicit employee confirmation required before quotation assembly.
        </div>
        <button class="btn btn-secondary" onclick="closeCatalogModal()">Cancel</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeCatalogModal();
  });

  filterCatalogResults();
}

async function filterCatalogResults() {
  const query = (document.getElementById("catalogSearchQuery")?.value || "").trim();
  const category = document.getElementById("catalogCategorySelect")?.value || "All";
  const statusContainer = document.getElementById("catalogStatusContainer");
  const tbody = document.getElementById("catalogTableBody");
  const countBadge = document.getElementById("matchCountBadge");

  if (!tbody) return;

  const currentSeq = ++productSearchSeq;
  if (statusContainer) {
    statusContainer.innerHTML = `<div style="padding: 6px 0; color: var(--slate-500); font-size: 11px;"><span class="spinner"></span> Querying Mock ERP Catalog...</div>`;
  }

  if (!erpConnector) {
    if (statusContainer) statusContainer.innerHTML = `<div class="error-banner-box">ERP Connector abstraction unavailable.</div>`;
    return;
  }

  const res = await erpConnector.searchProducts({
    query: query || undefined,
    category: category !== "All" ? category : undefined,
    limit: 30
  });

  if (currentSeq !== productSearchSeq) return; // Prevent race conditions

  if (!res.success) {
    if (statusContainer) {
      statusContainer.innerHTML = `
        <div class="error-banner-box">
          <strong>${escapeHtml(res.error.code)}:</strong> ${escapeHtml(res.error.detail)}
          <div style="font-size: 10.5px; margin-top: 3px;">${escapeHtml(res.error.user_action || '')}</div>
          <button class="btn btn-secondary btn-sm" style="margin-top: 6px;" onclick="filterCatalogResults()">Retry Search</button>
        </div>
      `;
    }
    if (countBadge) countBadge.textContent = "0 Items Found";
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 24px; color: var(--slate-500);">No items available for this search.</td></tr>`;
    return;
  }

  if (statusContainer) statusContainer.innerHTML = "";
  const items = res.data.items || [];
  if (countBadge) countBadge.textContent = `${items.length} Items Found (Mock)`;

  tbody.innerHTML = renderCatalogRows(items);
}

function renderCatalogRows(items) {
  if (items.length === 0) {
    return `<tr><td colspan="8" style="text-align: center; padding: 24px; color: var(--slate-500);">No catalog items match your search.</td></tr>`;
  }

  return items.map(p => {
    const listPrice = (p.pricing_summary && p.pricing_summary.list_price) ? p.pricing_summary.list_price : 0;
    const stockInfo = (p.inventory_status && p.inventory_status.stock_text) ? p.inventory_status.stock_text : (p.inventory_status?.is_stocked ? 'In Stock' : 'Order to Order');
    const variantText = p.variant || (p.specifications?.standard ? `Std: ${p.specifications.standard}` : 'Standard Specification');

    return `
      <tr>
        <td>
          <span class="badge ${p.match_type === 'EXACT_CODE' ? 'badge-confirmed' : 'badge-draft'}">
            ${p.match_type === 'EXACT_CODE' ? 'EXACT CODE' : 'SIMILAR'}
          </span>
        </td>
        <td><span class="erp-code-tag">${escapeHtml(p.product_code)}</span></td>
        <td>
          <strong>${escapeHtml(p.description)}</strong>
          <div style="font-size: 10px; color: var(--slate-500);"><span class="badge-mock">Mock Demo SKU</span></div>
        </td>
        <td style="color: var(--slate-600);">${escapeHtml(variantText)}</td>
        <td>${escapeHtml(p.unit_of_measure || 'PCS')}</td>
        <td style="text-align: right; font-family: var(--font-mono);">
          AED ${listPrice.toFixed(2)}
          <div class="provisional-cost-pill">Baseline Price</div>
        </td>
        <td style="font-size: 11px; color: var(--success);">${escapeHtml(stockInfo)}</td>
        <td style="text-align: center;">
          <button class="btn btn-primary btn-sm" onclick="selectProductFromCatalog('${escapeHtml(p.product_code)}')">
            + Select
          </button>
        </td>
      </tr>
    `;
  }).join("");
}

async function selectProductFromCatalog(code) {
  if (!erpConnector) return;

  // Retrieve authoritative pricing and cost through connector
  const pricingRes = await erpConnector.lookupPricingAndCost({ product_code: code });
  const productRes = await erpConnector.searchProducts({ code: code });

  const product = (productRes.success && productRes.data.items.length) ? productRes.data.items[0] : null;
  const pricingData = pricingRes.success ? pricingRes.data : null;

  const description = product ? product.description : "Catalog Product";
  const variant = product ? (product.variant || (product.specifications?.standard || "Standard")) : "";
  const unit = product ? product.unit_of_measure : "PCS";
  const listPrice = (pricingData && pricingData.pricing) ? pricingData.pricing.standard_list_price : 100.00;
  const recordedCost = (pricingData && pricingData.costing) ? pricingData.costing.recorded_cost : null;
  const costMetadata = (pricingData && pricingData.costing) ? {
    costType: pricingData.costing.cost_type,
    isProvisional: true,
    timestamp: pricingData.costing.cost_timestamp,
    status: pricingData.costing.cost_approval_status
  } : null;

  if (targetLineForCatalog) {
    const line = currentQuote.lineItems.find(l => l.id === targetLineForCatalog);
    if (line) {
      line.erpCode = code;
      line.description = description;
      line.variant = variant;
      line.unit = unit;
      line.cost = recordedCost;
      line.costMetadata = costMetadata;
      line.sellingPrice = listPrice;
      line.status = "Confirmed";
    }
  } else {
    const nextNo = currentQuote.lineItems.length + 1;
    currentQuote.lineItems.push({
      id: "line-" + Date.now(),
      lineNo: nextNo,
      description: description,
      erpCode: code,
      variant: variant,
      qty: 1,
      unit: unit,
      sellingPrice: listPrice,
      cost: recordedCost,
      costMetadata: costMetadata,
      status: "Confirmed",
      notes: ""
    });
  }

  closeCatalogModal();
  renderWorkspace(document.getElementById("mainContent"));
  saveDraft();

  if (recordedCost === null) {
    showToast(`⚠️ Linked ${code}: Warning — Cost is unknown in ERP. Margin calculation pending.`);
  } else {
    showToast(`Product linked via ERP Mock Connector: ${code} (Provisional Valuation)`);
  }
}

function closeCatalogModal() {
  const modal = document.getElementById("catalogModalOverlay");
  if (modal) modal.remove();
}

// --------------------------------------------------------------------------
// SCREEN 2: QUOTATION DASHBOARD
// --------------------------------------------------------------------------
function renderDashboard(container) {
  const activeTotals = calculateTotals();

  container.innerHTML = `
    <!-- Dashboard Header -->
    <div class="workspace-top-bar">
      <div>
        <h1 class="workspace-title">Quotation Dashboard</h1>
        <div class="meta-subtext">
          Good morning, Alex. You have <strong>3 quotations</strong> requiring attention. ERP demo sync active.
        </div>
      </div>
      <div class="top-bar-actions">
        <button class="btn btn-primary" onclick="createNewDraft()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          + Create New Quotation
        </button>
      </div>
    </div>

    <!-- Section 2: Compact Summary Metric Strip -->
    <div class="metrics-strip">
      <div class="metric-pill-card">
        <div class="metric-label">Active Drafts</div>
        <div class="metric-val">14</div>
        <div class="metric-sub text-warning">3 need attention</div>
      </div>
      <div class="metric-pill-card">
        <div class="metric-label">Awaiting Confirmation</div>
        <div class="metric-val">4</div>
        <div class="metric-sub text-muted">2 unmatched SKUs</div>
      </div>
      <div class="metric-pill-card">
        <div class="metric-label">Ready for Review</div>
        <div class="metric-val">5</div>
        <div class="metric-sub text-info">Avg AED 48,200</div>
      </div>
      <div class="metric-pill-card">
        <div class="metric-label">ERP Confirmed (MTD)</div>
        <div class="metric-val">38</div>
        <div class="metric-sub text-success">+12% vs last month</div>
      </div>
      <div class="metric-pill-card">
        <div class="metric-label">Total Quoted (MTD)</div>
        <div class="metric-val font-mono">AED 842.5K</div>
        <div class="metric-sub text-muted">Target: AED 1.2M (70%)</div>
      </div>
    </div>

    <!-- Section 4: Primary Quotations Table -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">Recent Quotation Workflows</div>
        <div style="display: flex; gap: 8px;">
          <input type="text" class="form-input" style="width: 240px; padding: 4px 8px;" placeholder="Filter quotations...">
          <select class="form-select" style="width: 140px; padding: 4px 8px;">
            <option>All Statuses</option>
            <option>In Progress</option>
            <option>Ready for Review</option>
            <option>ERP Confirmed</option>
          </select>
        </div>
      </div>
      <div class="card-body" style="padding: 0;">
        <div class="table-container" style="border: none; margin-bottom: 0;">
          <table class="quote-table">
            <thead>
              <tr>
                <th>Quotation Ref</th>
                <th>Customer & Project</th>
                <th>Created By</th>
                <th>Last Updated</th>
                <th style="text-align: right;">Total Value (AED)</th>
                <th>Status</th>
                <th style="text-align: center;">Next Action</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: #f0fdf4;">
                <td><strong class="draft-ref">${currentQuote.id}</strong></td>
                <td>
                  <strong>${escapeHtml(currentQuote.companyName)}</strong>
                  <div style="font-size: 11px; color: var(--slate-500);">Current Active Workspace</div>
                </td>
                <td>${currentQuote.createdBy}</td>
                <td>${currentQuote.lastSaved}</td>
                <td style="text-align: right; font-family: var(--font-mono); font-weight: 600;">
                  AED ${formatMoney(activeTotals.grandTotal)}
                </td>
                <td><span class="badge ${activeTotals.hasPriceBelowCost ? 'badge-danger' : (activeTotals.hasUnmatchedItems ? 'badge-warning' : 'badge-info')}">${currentQuote.status}</span></td>
                <td style="text-align: center;">
                  <button class="btn btn-primary btn-sm" onclick="switchScreen('workspace')">Resume</button>
                </td>
              </tr>
              <tr>
                <td><span class="draft-ref">DRAFT-2026-0039</span></td>
                <td>
                  <strong>Khansaheb Civil Engineering</strong>
                  <div style="font-size: 11px; color: var(--slate-500);">Dubai Creek Harbour Phase 2</div>
                </td>
                <td>Sarah Chen</td>
                <td>45 mins ago</td>
                <td style="text-align: right; font-family: var(--font-mono);">AED 42,100.00</td>
                <td><span class="badge badge-danger">1 Blocker (Cost)</span></td>
                <td style="text-align: center;">
                  <button class="btn btn-secondary btn-sm" onclick="resumeDraft('DRAFT-2026-0039')">Resume</button>
                </td>
              </tr>
              <tr>
                <td><span class="draft-ref">DRAFT-2026-0035</span></td>
                <td>
                  <strong>Sobha Realty LLC</strong>
                  <div style="font-size: 11px; color: var(--slate-500);">Sobha Hartland Villa Sanitary</div>
                </td>
                <td>Tariq Al-Hashimi</td>
                <td>Yesterday 16:30</td>
                <td style="text-align: right; font-family: var(--font-mono);">AED 1,450.00</td>
                <td><span class="badge badge-info">Ready for Review</span></td>
                <td style="text-align: center;">
                  <button class="btn btn-secondary btn-sm" onclick="resumeDraft('DRAFT-2026-0035')">Resume</button>
                </td>
              </tr>
              <tr>
                <td><span class="draft-ref">QUOTE-ERP-9182</span></td>
                <td>
                  <strong>Dutco Balfour Beatty</strong>
                  <div style="font-size: 11px; color: var(--slate-500);">Al Maktoum Airport Terminal Package</div>
                </td>
                <td>Alex Morgan</td>
                <td>24 Oct 2026</td>
                <td style="text-align: right; font-family: var(--font-mono);">AED 128,400.00</td>
                <td><span class="badge badge-confirmed">ERP Confirmed (Demo)</span></td>
                <td style="text-align: center;">
                  <button class="btn btn-ghost btn-sm" onclick="showToast('Viewing historical ERP record...')">View</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Section 5: Recent Activity & Attention List Split -->
    <div class="grid-2col">
      <div class="card">
        <div class="card-header">
          <div class="card-title">Activity Audit Trail</div>
        </div>
        <div class="card-body" style="font-size: 11.5px; line-height: 1.6;">
          <div style="padding-bottom: 8px; border-bottom: 1px dashed var(--slate-200);">
            <strong>Quotation ${currentQuote.id}</strong> modified by <em>Alex Morgan</em> (${currentQuote.lastSaved})
          </div>
          <div style="padding: 8px 0; border-bottom: 1px dashed var(--slate-200);">
            <strong>Product match confirmed</strong> for <code>MIM-SS-DISP-WM01</code> on DRAFT-2026-0041 by <em>Sarah Chen</em> (45 mins ago)
          </div>
          <div style="padding: 8px 0; border-bottom: 1px dashed var(--slate-200);">
            <strong>QUOTE-ERP-9182</strong> confirmed to ERP General Ledger by <em>Tariq Al-Hashimi</em> (Historical)
          </div>
          <div style="padding-top: 8px;">
            <strong>Credit check passed</strong> for Al-Futtaim Engineering Ltd (Verified Debtors Account)
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">Drafts Requiring Immediate Action</div>
        </div>
        <div class="card-body">
          <div style="background-color: var(--warning-bg); border: 1px solid var(--warning-border); padding: 10px; border-radius: var(--radius-sm); margin-bottom: 8px; font-size: 11.5px;">
            <strong>DRAFT-2026-0039:</strong> Custom Sensor Assembly Kit has unknown cost. ERP transmission blocked.
          </div>
          <div style="background-color: var(--danger-bg); border: 1px solid var(--danger-border); padding: 10px; border-radius: var(--radius-sm); font-size: 11.5px;">
            <strong>DRAFT-2026-0042 (Active):</strong> Line 3 requires catalog matching. Cannot submit to ERP with unmatched items.
          </div>
        </div>
      </div>
    </div>
  `;
}

// --------------------------------------------------------------------------
// SCREEN 3: PENDING DRAFTS
// --------------------------------------------------------------------------
function renderDrafts(container) {
  const draftKeys = Object.keys(draftsStore);

  container.innerHTML = `
    <div class="workspace-top-bar">
      <div>
        <h1 class="workspace-title">Pending Quotation Drafts</h1>
        <div class="meta-subtext">
          Resume unfinished quotations with preserved enquiry text, product line ordering, prices, and notes.
        </div>
      </div>
      <div class="top-bar-actions">
        <button class="btn btn-primary" onclick="createNewDraft()">+ New Quotation</button>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="card" style="margin-bottom: 16px;">
      <div class="card-body" style="padding: 12px;">
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <input type="text" class="form-input" id="draftSearchInput" style="flex: 1; min-width: 220px;" 
                 placeholder="Search drafts by reference ID, customer name, contact person..."
                 oninput="filterDraftsTable()">
          <select class="form-select" id="draftStatusFilter" style="width: 170px;" onchange="filterDraftsTable()">
            <option value="All">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="Ready for Review">Ready for Review</option>
          </select>
          <button class="btn btn-secondary" onclick="resetDraftFilters()">Clear Filters</button>
        </div>
      </div>
    </div>

    <!-- Drafts Table -->
    <div class="card">
      <div class="card-body" style="padding: 0;">
        <div class="table-container" style="border: none; margin-bottom: 0;">
          <table class="quote-table">
            <thead>
              <tr>
                <th style="width: 30px;"><input type="checkbox"></th>
                <th>Draft Reference</th>
                <th>Customer & Account Code</th>
                <th>Route</th>
                <th>Last Saved</th>
                <th>Lines & Value</th>
                <th>Unresolved Items</th>
                <th>Last Edited By</th>
                <th style="text-align: center;">Actions</th>
              </tr>
            </thead>
            <tbody id="draftsTableBody">
              ${renderDraftsRows(draftKeys)}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Preservation Engine Callout Note -->
    <div style="background-color: var(--slate-100); border: 1px solid var(--slate-200); border-radius: var(--radius-sm); padding: 12px 16px; font-size: 12px; color: var(--slate-600); margin-top: 14px;">
      ℹ️ <strong>State Preservation Engine:</strong> Resuming any draft immediately restores all customer records, pasted enquiry text, confirmed & unconfirmed product rows, quantities, selling prices, costs, line ordering, and commercial remarks exactly as last saved.
    </div>
  `;
}

function renderDraftsRows(keys) {
  if (keys.length === 0) {
    return `<tr><td colspan="9" style="text-align: center; padding: 24px; color: var(--slate-500);">No drafts match the selected filters.</td></tr>`;
  }

  return keys.map(k => {
    const draft = draftsStore[k];
    const isCurrent = (draft.id === currentQuote.id);

    // Compute metrics for draft
    let unmatchedCount = 0;
    let unknownCostCount = 0;
    let grandTotal = 0;

    draft.lineItems.forEach(i => {
      grandTotal += (i.qty * i.sellingPrice) * 1.05;
      if (!i.erpCode) unmatchedCount++;
      if (i.cost === null) unknownCostCount++;
    });

    let unresolvedBadge = `<span class="badge badge-confirmed">0 Unresolved</span>`;
    if (unknownCostCount > 0) {
      unresolvedBadge = `<span class="badge badge-danger">${unknownCostCount} Cost Blocker</span>`;
    } else if (unmatchedCount > 0) {
      unresolvedBadge = `<span class="badge badge-warning">${unmatchedCount} Unmatched</span>`;
    }

    return `
      <tr style="${isCurrent ? 'background-color: #f8fafc;' : ''}">
        <td><input type="checkbox" ${isCurrent ? 'checked' : ''}></td>
        <td>
          <strong class="draft-ref">${draft.id}</strong>
          ${isCurrent ? '<span style="font-size: 10px; color: var(--primary); font-weight: 700; margin-left: 4px;">[ACTIVE]</span>' : ''}
        </td>
        <td>${escapeHtml(draft.customerAccount || draft.companyName)}</td>
        <td>
          <span class="badge ${draft.customerRoute === 'D' ? 'badge-info' : 'badge-draft'}">
            ${draft.customerRoute === 'D' ? 'Debtors [D]' : 'General [G]'}
          </span>
        </td>
        <td>${draft.lastSaved}</td>
        <td class="font-mono">${draft.lineItems.length} lines (AED ${formatMoney(grandTotal)})</td>
        <td>${unresolvedBadge}</td>
        <td>${draft.createdBy.split(' ')[0]} ${draft.createdBy.split(' ')[1] || ''}</td>
        <td style="text-align: center; white-space: nowrap;">
          <button class="btn ${isCurrent ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="resumeDraft('${draft.id}')">Resume</button>
          <button class="icon-btn" title="Delete draft" onclick="confirmDeleteDraft('${draft.id}')" style="display: inline-flex; vertical-align: middle;">✕</button>
        </td>
      </tr>
    `;
  }).join("");
}

function filterDraftsTable() {
  const query = (document.getElementById("draftSearchInput")?.value || "").toLowerCase().trim();
  const status = document.getElementById("draftStatusFilter")?.value || "All";

  const matched = Object.keys(draftsStore).filter(k => {
    const draft = draftsStore[k];
    const matchesQ = !query || 
      draft.id.toLowerCase().includes(query) || 
      draft.companyName.toLowerCase().includes(query) || 
      draft.contactPerson.toLowerCase().includes(query);
    const matchesS = (status === "All") || (draft.status === status);
    return matchesQ && matchesS;
  });

  const tbody = document.getElementById("draftsTableBody");
  if (tbody) tbody.innerHTML = renderDraftsRows(matched);
}

function resetDraftFilters() {
  const search = document.getElementById("draftSearchInput");
  const select = document.getElementById("draftStatusFilter");
  if (search) search.value = "";
  if (select) select.value = "All";
  filterDraftsTable();
}

function resumeDraft(id) {
  // Save current active draft first
  draftsStore[currentQuote.id] = JSON.parse(JSON.stringify(currentQuote));

  if (draftsStore[id]) {
    currentQuote = JSON.parse(JSON.stringify(draftsStore[id]));
    localStorage.setItem("MIM_ACTIVE_DRAFT_ID", id);
    localStorage.setItem("MIM_DRAFTS_STORE", JSON.stringify(draftsStore));
    showToast(`Draft ${id} resumed. All customer details and lines restored.`);
    switchScreen("workspace");
  }
}

function createNewDraft() {
  const newId = "DRAFT-2026-" + String(Math.floor(Math.random() * 9000) + 1000);
  const newDraft = {
    id: newId,
    status: "Draft",
    createdBy: "Alex Morgan (Sales Engineer)",
    lastSaved: "Just now",
    customerRoute: "D",
    customerAccount: "Al-Futtaim Engineering Ltd [ACC-88219]",
    companyName: "Al-Futtaim Engineering Ltd",
    contactPerson: "Mr. Zaid Mansoor",
    email: "z.mansoor@alfuttaim.ae",
    phone: "+971 4 213 4400",
    enquiryText: "",
    enquiryExtracted: false,
    leadTime: "2 - 3 Weeks from receipt of PO",
    deliveryNotes: "Ex-works Jebel Ali Warehouse",
    internalRemarks: "",
    customerRemarks: "Prices valid for 30 calendar days.",
    lineItems: [
      {
        id: "line-" + Date.now(),
        lineNo: 1,
        description: "New Product Item",
        erpCode: null,
        variant: "Standard specification",
        qty: 1,
        unit: "PCS",
        sellingPrice: 100.00,
        cost: null,
        status: "Awaiting",
        notes: "Catalog search required"
      }
    ]
  };

  draftsStore[newId] = newDraft;
  currentQuote = newDraft;
  localStorage.setItem("MIM_ACTIVE_DRAFT_ID", newId);
  localStorage.setItem("MIM_DRAFTS_STORE", JSON.stringify(draftsStore));
  showToast(`Created new draft: ${newId}`);
  switchScreen("workspace");
}

function confirmDeleteDraft(id) {
  if (Object.keys(draftsStore).length <= 1) {
    showToast("Cannot delete the only remaining draft.");
    return;
  }

  if (confirm(`Are you sure you want to delete ${id}? This action will remove all line items and customer notes and cannot be undone.`)) {
    delete draftsStore[id];
    
    // If deleted the current active draft, switch to another
    if (currentQuote.id === id) {
      const remainingId = Object.keys(draftsStore)[0];
      currentQuote = JSON.parse(JSON.stringify(draftsStore[remainingId]));
      localStorage.setItem("MIM_ACTIVE_DRAFT_ID", remainingId);
    }

    localStorage.setItem("MIM_DRAFTS_STORE", JSON.stringify(draftsStore));
    showToast(`Draft ${id} deleted.`);
    renderDrafts(document.getElementById("mainContent"));
  }
}

// --------------------------------------------------------------------------
// SCREEN 5: QUOTATION PREVIEW (PRINTABLE A4 SHEET)
// --------------------------------------------------------------------------
function renderPreview(container) {
  const totals = calculateTotals();

  container.innerHTML = `
    <div class="workspace-top-bar">
      <div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <button class="btn btn-secondary btn-sm" onclick="switchScreen('workspace')">← Return to Workspace</button>
          <h1 class="workspace-title" style="font-size: 18px;">Commercial Quotation Preview</h1>
        </div>
        <div class="meta-subtext">Previewing document as it appears before official ERP confirmation.</div>
      </div>
      <div class="top-bar-actions">
        <button class="btn btn-secondary" onclick="window.print()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
          Print Document
        </button>
        <button class="btn btn-primary" onclick="openErpConfirmModal()">
          Prepare for ERP Confirmation →
        </button>
      </div>
    </div>

    <div class="preview-container">
      <!-- Watermark Banner -->
      <div class="watermark-banner">
        <div>
          ⚠️ <strong>DRAFT — NOT AN OFFICIAL ERP QUOTATION:</strong> Preliminary workspace estimate.
          Official quotation number is issued only upon ERP confirmation.
        </div>
        <span class="badge badge-warning">Demo Mode</span>
      </div>

      <!-- Printable A4 Sheet -->
      <div class="a4-sheet" id="printSheet">
        <div class="draft-watermark">DRAFT</div>

        <!-- A4 Header -->
        <div class="a4-header">
          <div>
            <div class="company-name">MIM INDUSTRIAL SOLUTIONS LLC</div>
            <div class="company-sub">Commercial & Industrial Systems Supply</div>
            <div class="company-meta">
              Plot 598-1021, Jebel Ali Industrial Area 1, P.O. Box 48201, Dubai, UAE<br>
              <strong>TRN (VAT Reg):</strong> 100293847500003<br>
              Tel: +971 4 880 1200 | Email: quotes@mimsolutions.ae
            </div>
          </div>
          <div>
            <div class="doc-meta-title">COMMERCIAL QUOTATION</div>
            <div style="font-size: 11px; color: var(--danger); font-weight: 700; text-align: right;">(DRAFT ESTIMATE)</div>
            <table class="doc-meta-table">
              <tr>
                <td style="color: var(--slate-500);">Quotation Ref:</td>
                <td><strong>${currentQuote.id}</strong></td>
              </tr>
              <tr>
                <td style="color: var(--slate-500);">Quotation Date:</td>
                <td>29 October 2026</td>
              </tr>
              <tr>
                <td style="color: var(--slate-500);">Validity:</td>
                <td>30 Days</td>
              </tr>
              <tr>
                <td style="color: var(--slate-500);">Prepared By:</td>
                <td>${currentQuote.createdBy}</td>
              </tr>
            </table>
          </div>
        </div>

        <!-- Customer Address Box -->
        <div class="customer-address-box">
          <div>
            <div style="font-weight: 700; text-transform: uppercase; margin-bottom: 4px; color: var(--navy-900);">
              Quotation Issued To:
            </div>
            <strong>${escapeHtml(currentQuote.companyName)}</strong><br>
            Account: ${escapeHtml(currentQuote.customerAccount || 'General Ledger Recipient')}<br>
            Attention: ${escapeHtml(currentQuote.contactPerson)}<br>
            Email: ${escapeHtml(currentQuote.email)} | Tel: ${escapeHtml(currentQuote.phone)}
          </div>
          <div>
            <div style="font-weight: 700; text-transform: uppercase; margin-bottom: 4px; color: var(--navy-900);">
              Project & Delivery Site:
            </div>
            ${escapeHtml(currentQuote.deliveryNotes)}<br>
            Payment Terms: 30 Days Net (Standard Credit)
          </div>
        </div>

        <!-- Line Items Table -->
        <table class="print-table">
          <thead>
            <tr>
              <th style="width: 30px;">#</th>
              <th style="width: 120px;">ERP Code</th>
              <th>Description & Specification</th>
              <th style="width: 50px; text-align: right;">Qty</th>
              <th style="width: 50px;">Unit</th>
              <th style="width: 90px; text-align: right;">Rate (AED)</th>
              <th style="width: 100px; text-align: right;">Total (AED)</th>
            </tr>
          </thead>
          <tbody>
            ${currentQuote.lineItems.map((item, idx) => `
              <tr>
                <td>${idx + 1}</td>
                <td class="font-mono">${item.erpCode || '<span style="color: var(--warning);">[MATCH PENDING]</span>'}</td>
                <td>
                  <strong>${escapeHtml(item.description)}</strong>
                  <div style="font-size: 10.5px; color: var(--slate-600);">${escapeHtml(item.variant)}</div>
                </td>
                <td style="text-align: right;">${item.qty}</td>
                <td>${item.unit}</td>
                <td style="text-align: right; font-family: var(--font-mono);">${item.sellingPrice.toFixed(2)}</td>
                <td style="text-align: right; font-family: var(--font-mono); font-weight: 600;">
                  ${formatMoney(item.qty * item.sellingPrice)}
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <!-- Financial Summary -->
        <div style="display: flex; justify-content: flex-end; margin-bottom: 16px;">
          <div style="width: 320px;">
            <div class="summary-row">
              <span class="text-muted">Subtotal (Excl. VAT):</span>
              <span class="font-mono">AED ${formatMoney(totals.subtotal)}</span>
            </div>
            <div class="summary-row">
              <span class="text-muted">UAE VAT at 5.0%:</span>
              <span class="font-mono">AED ${formatMoney(totals.vat)}</span>
            </div>
            <div class="summary-row grand-total" style="font-size: 15px; border-top: 2px solid var(--navy-900);">
              <span>Grand Total:</span>
              <span class="font-mono" style="color: var(--navy-900);">AED ${formatMoney(totals.grandTotal)}</span>
            </div>
          </div>
        </div>

        <div class="amount-words-box">
          <strong>Currency:</strong> United Arab Emirates Dirham (AED) • Applicable UAE VAT: 5.0%
        </div>

        <!-- Commercial Terms -->
        <div class="terms-section">
          <div style="font-weight: 700; color: var(--navy-900); margin-bottom: 6px;">Commercial Terms & Delivery:</div>
          <div>• <strong>Lead Time:</strong> ${escapeHtml(currentQuote.leadTime)}</div>
          <div>• <strong>Delivery Terms:</strong> ${escapeHtml(currentQuote.deliveryNotes)}</div>
          <div>• <strong>Warranty:</strong> ${escapeHtml(currentQuote.customerRemarks)}</div>
          <div style="margin-top: 6px; font-size: 10px; color: var(--slate-500);">
            1. Prices valid for 30 calendar days. 2. This draft quotation is subject to final ERP booking and stock confirmation. 3. UAE VAT Registration TRN: 100293847500003.
          </div>
        </div>

        <!-- Signatory Block -->
        <div class="signatory-row">
          <div class="sign-box">
            Prepared By:<br>
            <strong>${escapeHtml(currentQuote.createdBy)}</strong><br>
            MIM Industrial Solutions LLC
          </div>
          <div class="sign-box" style="text-align: right;">
            Client Acceptance Signature & Seal:<br><br>
            _______________________________
          </div>
        </div>
      </div>
    </div>
  `;
}

// --------------------------------------------------------------------------
// MODAL: PREPARE FOR ERP CONFIRMATION (SAFETY GUARDED)
// --------------------------------------------------------------------------
function openErpConfirmModal() {
  const totals = calculateTotals();
  const isBlocked = totals.hasPriceBelowCost || totals.hasUnknownCost || totals.hasUnmatchedItems;

  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.id = "erpModalOverlay";

  overlay.innerHTML = `
    <div class="modal-dialog" style="max-width: 640px;">
      <div class="modal-header">
        <div class="modal-title">Prepare Quotation for ERP Confirmation</div>
        <button class="icon-btn" onclick="closeErpModal()">✕</button>
      </div>

      <div class="modal-body">
        <div style="background-color: var(--warning-bg); border: 1px solid var(--warning-border); padding: 12px; border-radius: var(--radius-sm); margin-bottom: 16px; font-size: 12px;">
          ⚠️ <strong>UI Prototype Demo Mode:</strong> This application assists in quotation assembly and validation.
          Official ERP quotation records are generated only upon explicit submission to the live Windows ERP service.
        </div>

        <div style="font-weight: 700; margin-bottom: 10px; font-size: 12.5px;">Pre-Confirmation Verification Checklist:</div>

        <div style="display: flex; flex-direction: column; gap: 8px; font-size: 12px;">
          <label style="display: flex; align-items: center; gap: 8px;">
            <input type="checkbox" checked disabled>
            <span>Customer route verified: <strong>${currentQuote.customerRoute === 'D' ? 'Debtors Ledger [D]' : 'General Ledger [G]'}</strong></span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px;">
            <input type="checkbox" ${totals.hasUnmatchedItems ? '' : 'checked'} disabled>
            <span>All ${currentQuote.lineItems.length} line items confirmed against ERP product master</span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px;">
            <input type="checkbox" ${totals.hasUnknownCost ? '' : 'checked'} disabled>
            <span>Cost basis available and recorded in catalog</span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px;">
            <input type="checkbox" ${totals.hasPriceBelowCost ? '' : 'checked'} disabled>
            <span>No line item priced below recorded cost</span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px;">
            <input type="checkbox" checked disabled>
            <span>Commercial lead time reviewed (${escapeHtml(currentQuote.leadTime)})</span>
          </label>
        </div>

        ${isBlocked ? `
          <div style="margin-top: 14px; padding: 10px 14px; background-color: var(--danger-bg); border: 1px solid var(--danger-border); border-radius: var(--radius-sm); font-size: 11.5px; color: var(--danger);">
            ✕ <strong>Action Blocked:</strong> Cannot proceed to ERP confirmation due to the following issues:
            <ul style="margin: 6px 0 0 16px;">
              ${totals.hasPriceBelowCost ? '<li>One or more items are priced below cost.</li>' : ''}
              ${totals.hasUnknownCost ? '<li>One or more items have unknown cost.</li>' : ''}
              ${totals.hasUnmatchedItems ? '<li>One or more items are awaiting ERP catalog matching.</li>' : ''}
            </ul>
          </div>
        ` : `
          <div style="margin-top: 14px; padding: 10px 14px; background-color: var(--success-bg); border: 1px solid var(--success-border); border-radius: var(--radius-sm); font-size: 11.5px; color: var(--success);">
            ✓ All checks passed! Ready for live ERP connector handshake.
          </div>
        `}
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="closeErpModal()">Return to Workspace</button>
        <button class="btn btn-primary" ${isBlocked ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''} onclick="${isBlocked ? '' : 'simulateErpHandshake()'}">
          Simulate ERP Confirmation Handshake
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
}

function simulateErpHandshake() {
  closeErpModal();
  showToast("Transmitting quotation payload to MIM ERP Connector (Simulation)...");
  setTimeout(() => {
    alert("Simulated Pre-Flight Validation Complete!\n\nIn Phase 2, this payload connects to the Windows ERP desktop connector service.\n\nNotice: This is a UI prototype. No ERP records have been committed or official quotation numbers generated.");
  }, 500);
}

function closeErpModal() {
  const modal = document.getElementById("erpModalOverlay");
  if (modal) modal.remove();
}

// --------------------------------------------------------------------------
// PERSISTENCE & TOAST HELPERS
// --------------------------------------------------------------------------
function saveDraft() {
  currentQuote.lastSaved = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  draftsStore[currentQuote.id] = JSON.parse(JSON.stringify(currentQuote));
  localStorage.setItem("MIM_DRAFTS_STORE", JSON.stringify(draftsStore));
  localStorage.setItem("MIM_ACTIVE_DRAFT_ID", currentQuote.id);

  const el = document.getElementById("lastSavedText");
  if (el) el.textContent = currentQuote.lastSaved;
  showToast(`Draft ${currentQuote.id} saved to local storage.`);
}

function runValidationCheck(showAlert = false) {
  const totals = calculateTotals();
  if (totals.hasPriceBelowCost) {
    if (showAlert) alert("Validation Blocked: One or more line items are priced below cost. Adjust prices before finalizing.");
    return false;
  }
  if (totals.hasUnknownCost || totals.hasUnmatchedItems) {
    if (showAlert) alert("Validation Warning: 1 or more items require ERP product master matching or cost confirmation.");
    return false;
  }
  if (showAlert) alert("Quotation Validated: All calculations, customer details, and ERP lines are ready for review!");
  return true;
}

function showToast(msg) {
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<span>${escapeHtml(msg)}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3200);
}

function formatMoney(num) {
  if (num === null || num === undefined || isNaN(num)) return "0.00";
  return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    calculateTotals,
    updateRowField,
    setCustomerRoute,
    handleAccountChange,
    selectCustomerFromSearch,
    selectProductFromCatalog,
    ERP_CATALOG,
    INITIAL_DRAFTS
  };
}
