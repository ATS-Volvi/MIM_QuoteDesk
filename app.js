/**
 * MIM QuoteFlow AI — High-Fidelity UI Prototype
 * Core State & Interactive Engine
 */

// Initial Dummy Data
const DEFAULT_QUOTE = {
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
      status: "Confirmed", // Confirmed, Awaiting, PriceWarning
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
      erpCode: null, // Unassigned
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

// Active State
let currentQuote = JSON.parse(JSON.stringify(DEFAULT_QUOTE));
let activeScreen = "workspace"; // 'workspace', 'dashboard', 'drafts', 'preview'

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  // Load saved draft from localStorage if available
  const saved = localStorage.getItem("MIM_CURRENT_DRAFT");
  if (saved) {
    try {
      currentQuote = JSON.parse(saved);
    } catch (e) {
      console.warn("Could not load draft from storage", e);
    }
  }

  setupNavigation();
  renderScreen();
});

// Setup App Navigation
function setupNavigation() {
  document.querySelectorAll("[data-nav]").forEach(el => {
    el.addEventListener("click", (e) => {
      const target = el.getAttribute("data-nav");
      switchScreen(target);
    });
  });

  // Global search shortcut
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
                <label class="form-label">Searchable Customer Account *</label>
                <select class="form-select" id="customerAccountSelect" onchange="handleAccountChange(this.value)">
                  <option value="Al-Futtaim Engineering Ltd [ACC-88219]" selected>Al-Futtaim Engineering Ltd — ACC-88219 (Credit Active)</option>
                  <option value="Khansaheb Civil Engineering [ACC-44102]">Khansaheb Civil Engineering — ACC-44102</option>
                  <option value="Dutco Balfour Beatty [ACC-12093]">Dutco Balfour Beatty — ACC-12093</option>
                  <option value="Sobha Realty LLC [ACC-90112]">Sobha Realty LLC — ACC-90112</option>
                </select>
                <div style="font-size: 10.5px; color: var(--slate-500); margin-top: 3px;">
                  ℹ️ Linked to ERP Debtors Ledger. Note: Selecting an account verifies approved credit terms.
                </div>
              </div>
            ` : `
              <div class="form-group col-span-2">
                <label class="form-label">Recipient / Company Name *</label>
                <input type="text" class="form-input" id="companyNameInput" value="${currentQuote.companyName}" oninput="currentQuote.companyName = this.value" placeholder="Enter recipient organization">
                <div style="font-size: 10.5px; color: var(--slate-500); margin-top: 3px;">
                  ℹ️ General Ledger routing: Quoting directly to recipient. Does not create a new ERP customer record.
                </div>
              </div>
            `}

            <div class="form-group">
              <label class="form-label">Contact Person</label>
              <input type="text" class="form-input" value="${currentQuote.contactPerson}" oninput="currentQuote.contactPerson = this.value">
            </div>

            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input type="email" class="form-input" value="${currentQuote.email}" oninput="currentQuote.email = this.value">
            </div>

            <div class="form-group">
              <label class="form-label">Phone</label>
              <input type="text" class="form-input" value="${currentQuote.phone}" oninput="currentQuote.phone = this.value">
            </div>

            <div class="form-group">
              <label class="form-label">Payment Terms</label>
              <input type="text" class="form-input" value="30 Days Net (Standard Credit)" readonly style="background-color: var(--slate-100);">
            </div>

            <div class="form-group col-span-2">
              <label class="form-label">Original Customer Enquiry (RFQ Text)</label>
              <textarea class="form-textarea" id="enquiryTextInput" oninput="currentQuote.enquiryText = this.value">${currentQuote.enquiryText}</textarea>
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
            "${currentQuote.enquiryText}"
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
              <input type="text" class="form-input" value="${currentQuote.leadTime}" oninput="currentQuote.leadTime = this.value">
            </div>
            <div class="form-group">
              <label class="form-label">Delivery / Fulfilment Terms</label>
              <input type="text" class="form-input" value="${currentQuote.deliveryNotes}" oninput="currentQuote.deliveryNotes = this.value">
            </div>
            <div class="form-group col-span-2">
              <label class="form-label">Internal Remarks (Private to sales & management)</label>
              <textarea class="form-textarea" oninput="currentQuote.internalRemarks = this.value">${currentQuote.internalRemarks}</textarea>
            </div>
            <div class="form-group col-span-2">
              <label class="form-label">Customer-Facing Remarks (Printed on formal quotation)</label>
              <textarea class="form-textarea" oninput="currentQuote.customerRemarks = this.value">${currentQuote.customerRemarks}</textarea>
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
          <span>Products Confirmed (${totals.hasUnmatchedItems ? '1 Unmatched' : 'All Confirmed'})</span>
        </div>
        <div class="check-item">
          ${totals.hasUnknownCost ? '<span class="check-icon-warning">⚠️</span>' : '<span class="check-icon-ready">✓</span>'}
          <span>Costs Available (${totals.hasUnknownCost ? '1 Unknown' : 'Complete'})</span>
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
    const lineTotal = item.qty * item.sellingPrice;
    const isBelowCost = item.cost !== null && item.sellingPrice < item.cost;
    const isCostUnknown = item.cost === null;

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
                 value="${item.qty}" 
                 onchange="updateRowField('${item.id}', 'qty', parseFloat(this.value) || 1)">
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
                 value="${item.sellingPrice.toFixed(2)}" 
                 onchange="updateRowField('${item.id}', 'sellingPrice', parseFloat(this.value) || 0)">
          ${item.historicalPrice ? `
            <div style="font-size: 9.5px; color: var(--danger); margin-top: 2px; white-space: nowrap;">
              Prev: ${item.historicalPrice.toFixed(2)}
            </div>
          ` : ''}
        </td>
        <td style="text-align: right; font-family: var(--font-mono);">
          ${isCostUnknown 
            ? '<span class="text-warning" title="Cost pending ERP master link">Unknown</span>' 
            : `AED ${item.cost.toFixed(2)}`}
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

// Calculations Engine
function calculateTotals() {
  let subtotal = 0;
  let totalCost = 0;
  let hasUnknownCost = false;
  let hasPriceBelowCost = false;
  let hasUnmatchedItems = false;
  let totalUnits = 0;

  currentQuote.lineItems.forEach(item => {
    const lineTotal = item.qty * item.sellingPrice;
    subtotal += lineTotal;
    totalUnits += item.qty;

    if (item.cost === null) {
      hasUnknownCost = true;
    } else {
      totalCost += (item.qty * item.cost);
      if (item.sellingPrice < item.cost) {
        hasPriceBelowCost = true;
      }
    }

    if (!item.erpCode) {
      hasUnmatchedItems = true;
    }
  });

  const vat = subtotal * 0.05;
  const grandTotal = subtotal + vat;
  const grossProfit = hasUnknownCost ? 0 : (subtotal - totalCost);
  const grossMargin = (hasUnknownCost || subtotal === 0) ? 0 : (grossProfit / subtotal) * 100;

  return {
    subtotal,
    vat,
    grandTotal,
    totalCost,
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

  item[field] = value;
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
  renderWorkspace(document.getElementById("mainContent"));
}

function handleAccountChange(accountName) {
  currentQuote.customerAccount = accountName;
  if (accountName.includes("Al-Futtaim")) {
    currentQuote.companyName = "Al-Futtaim Engineering Ltd";
    currentQuote.contactPerson = "Mr. Zaid Mansoor";
    currentQuote.email = "z.mansoor@alfuttaim.ae";
    currentQuote.phone = "+971 4 213 4400";
  } else if (accountName.includes("Khansaheb")) {
    currentQuote.companyName = "Khansaheb Civil Engineering LLC";
    currentQuote.contactPerson = "Eng. Tariq Khansaheb";
    currentQuote.email = "tariq@khansaheb.ae";
    currentQuote.phone = "+971 4 333 1200";
  }
  renderWorkspace(document.getElementById("mainContent"));
}

// --------------------------------------------------------------------------
// AI ASSISTANT ACTIONS
// --------------------------------------------------------------------------
function extractEnquiry() {
  const enquiryText = document.getElementById("enquiryTextInput")?.value || currentQuote.enquiryText;
  showToast("AI Enquiry Assistant: Extracting requirements...");

  setTimeout(() => {
    document.getElementById("chipProduct").textContent = "Stainless steel wall-mounted dispenser";
    document.getElementById("chipQty").textContent = "25 units";
    document.getElementById("chipAddon").textContent = "Standard mounting kit";
    document.getElementById("chipLead").textContent = "Standard Lead Time";
    showToast("Extraction complete. Suggested ERP match ready.");
  }, 500);
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
// SCREEN 4: PRODUCT CATALOG SEARCH MODAL
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

function showCatalogModal(initialQuery) {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.id = "catalogModalOverlay";

  overlay.innerHTML = `
    <div class="modal-dialog">
      <div class="modal-header">
        <div>
          <div class="modal-title">ERP Product Catalogue Search</div>
          <div style="font-size: 11px; color: var(--slate-500); margin-top: 2px;">
            Search live MIM ERP product master. Note: Selecting links catalog data to quotation without editing master records.
          </div>
        </div>
        <button class="icon-btn" onclick="closeCatalogModal()">✕</button>
      </div>

      <div class="modal-body">
        <div style="display: flex; gap: 10px; margin-bottom: 14px;">
          <div style="flex: 1; position: relative;">
            <input type="text" class="form-input" id="catalogSearchQuery" 
                   value="${initialQuery}" placeholder="Search by SKU, Description, Variant (e.g. MIM-SS, Dispenser, 304, Nozzle)..." 
                   oninput="filterCatalogResults(this.value)">
          </div>
          <select class="form-select" style="width: 160px;" id="catalogCategorySelect" onchange="filterCatalogResults()">
            <option value="All">All Categories</option>
            <option value="Dispensers">Dispensers</option>
            <option value="Hardware">Hardware</option>
            <option value="Spares">Spares</option>
          </select>
        </div>

        <div style="display: flex; gap: 8px; margin-bottom: 12px; font-size: 11.5px;">
          <span class="badge badge-info" id="matchCountBadge">6 Items Available</span>
          <span style="color: var(--slate-500);">Warehouse: Jebel Ali Free Zone (Active)</span>
        </div>

        <div class="table-container" style="max-height: 380px;">
          <table class="quote-table">
            <thead>
              <tr>
                <th style="width: 100px;">Match</th>
                <th style="width: 140px;">ERP Code</th>
                <th>Description</th>
                <th>Variant / Spec</th>
                <th style="width: 60px;">Unit</th>
                <th style="width: 90px; text-align: right;">Cost (AED)</th>
                <th style="width: 130px;">Stock</th>
                <th style="width: 100px; text-align: center;">Action</th>
              </tr>
            </thead>
            <tbody id="catalogTableBody">
              ${renderCatalogRows(ERP_CATALOG)}
            </tbody>
          </table>
        </div>
      </div>

      <div class="modal-footer">
        <div style="flex: 1; font-size: 11px; color: var(--slate-500);">
          Press <kbd>ESC</kbd> to exit. Selecting a product populates description, ERP code, and cost baseline.
        </div>
        <button class="btn btn-secondary" onclick="closeCatalogModal()">Cancel</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Esc listener
  overlay.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeCatalogModal();
  });
}

function renderCatalogRows(items) {
  if (items.length === 0) {
    return `<tr><td colspan="8" style="text-align: center; padding: 24px; color: var(--slate-500);">No catalog items match your search.</td></tr>`;
  }

  return items.map(p => `
    <tr>
      <td>
        <span class="badge ${p.matchType === 'exact' ? 'badge-confirmed' : 'badge-draft'}">
          ${p.matchType === 'exact' ? 'EXACT CODE' : 'SIMILAR'}
        </span>
      </td>
      <td><span class="erp-code-tag">${p.code}</span></td>
      <td><strong>${escapeHtml(p.description)}</strong></td>
      <td style="color: var(--slate-600);">${escapeHtml(p.variant)}</td>
      <td>${p.unit}</td>
      <td style="text-align: right; font-family: var(--font-mono);">${p.cost.toFixed(2)}</td>
      <td style="font-size: 11px; color: var(--success);">${p.stock}</td>
      <td style="text-align: center;">
        <button class="btn btn-primary btn-sm" onclick="selectProductFromCatalog('${p.code}')">
          + Select
        </button>
      </td>
    </tr>
  `).join("");
}

function filterCatalogResults() {
  const query = (document.getElementById("catalogSearchQuery")?.value || "").toLowerCase().trim();
  const category = document.getElementById("catalogCategorySelect")?.value || "All";

  const filtered = ERP_CATALOG.filter(p => {
    const matchesQuery = !query || 
      p.code.toLowerCase().includes(query) || 
      p.description.toLowerCase().includes(query) || 
      p.variant.toLowerCase().includes(query);
    const matchesCategory = (category === "All") || (p.category === category);
    return matchesQuery && matchesCategory;
  });

  const tbody = document.getElementById("catalogTableBody");
  if (tbody) tbody.innerHTML = renderCatalogRows(filtered);

  const countBadge = document.getElementById("matchCountBadge");
  if (countBadge) countBadge.textContent = `${filtered.length} Items Found`;
}

function selectProductFromCatalog(code) {
  const product = ERP_CATALOG.find(p => p.code === code);
  if (!product) return;

  if (targetLineForCatalog) {
    // Replace existing line
    const line = currentQuote.lineItems.find(l => l.id === targetLineForCatalog);
    if (line) {
      line.erpCode = product.code;
      line.description = product.description;
      line.variant = product.variant;
      line.unit = product.unit;
      line.cost = product.cost;
      line.sellingPrice = product.listPrice;
      line.status = "Confirmed";
    }
  } else {
    // Add new line item
    const nextNo = currentQuote.lineItems.length + 1;
    currentQuote.lineItems.push({
      id: "line-" + Date.now(),
      lineNo: nextNo,
      description: product.description,
      erpCode: product.code,
      variant: product.variant,
      qty: 1,
      unit: product.unit,
      sellingPrice: product.listPrice,
      cost: product.cost,
      status: "Confirmed",
      notes: ""
    });
  }

  closeCatalogModal();
  renderWorkspace(document.getElementById("mainContent"));
  showToast(`Product linked: ${product.code}`);
}

function closeCatalogModal() {
  const modal = document.getElementById("catalogModalOverlay");
  if (modal) modal.remove();
}

// --------------------------------------------------------------------------
// SCREEN 2: QUOTATION DASHBOARD
// --------------------------------------------------------------------------
function renderDashboard(container) {
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
        <button class="btn btn-primary" onclick="switchScreen('workspace')">
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
                  <strong>${currentQuote.companyName}</strong>
                  <div style="font-size: 11px; color: var(--slate-500);">Current Active Workspace</div>
                </td>
                <td>${currentQuote.createdBy}</td>
                <td>Just now</td>
                <td style="text-align: right; font-family: var(--font-mono); font-weight: 600;">
                  AED ${formatMoney(calculateTotals().grandTotal)}
                </td>
                <td><span class="badge badge-warning">Awaiting Match</span></td>
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
                <td><span class="badge badge-danger">2 Unmatched</span></td>
                <td style="text-align: center;">
                  <button class="btn btn-secondary btn-sm" onclick="showToast('Loading DRAFT-2026-0039...')">Review</button>
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
                  <button class="btn btn-teal btn-sm" onclick="showToast('Opening review mode...')">Validate</button>
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
                <td><span class="badge badge-confirmed">ERP Confirmed</span></td>
                <td style="text-align: center;">
                  <button class="btn btn-ghost btn-sm" onclick="showToast('Viewing confirmed ERP quote...')">View</button>
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
            <strong>Quotation ${currentQuote.id}</strong> updated with 4 line items by <em>Alex Morgan</em> (Just now)
          </div>
          <div style="padding: 8px 0; border-bottom: 1px dashed var(--slate-200);">
            <strong>Product match confirmed</strong> for <code>MIM-SS-DISP-WM01</code> on DRAFT-2026-0041 by <em>Sarah Chen</em> (45 mins ago)
          </div>
          <div style="padding: 8px 0; border-bottom: 1px dashed var(--slate-200);">
            <strong>QUOTE-ERP-9182</strong> confirmed to ERP General Ledger by <em>Tariq Al-Hashimi</em> (Yesterday)
          </div>
          <div style="padding-top: 8px;">
            <strong>Credit check passed</strong> for Al-Futtaim Engineering Ltd (Approved by Finance)
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">Drafts Requiring Immediate Action</div>
        </div>
        <div class="card-body">
          <div style="background-color: var(--warning-bg); border: 1px solid var(--warning-border); padding: 10px; border-radius: var(--radius-sm); margin-bottom: 8px; font-size: 11.5px;">
            <strong>DRAFT-2026-0039:</strong> 2 SKUs unmapped to ERP master catalog. Finalisation blocked.
          </div>
          <div style="background-color: var(--danger-bg); border: 1px solid var(--danger-border); padding: 10px; border-radius: var(--radius-sm); font-size: 11.5px;">
            <strong>DRAFT-2026-0042 (Current):</strong> Line 3 has unknown cost. Catalog match required before ERP confirmation.
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
  container.innerHTML = `
    <div class="workspace-top-bar">
      <div>
        <h1 class="workspace-title">Pending Quotation Drafts</h1>
        <div class="meta-subtext">
          Resume unfinished quotations with preserved enquiry text, product line ordering, prices, and notes.
        </div>
      </div>
      <div class="top-bar-actions">
        <button class="btn btn-primary" onclick="switchScreen('workspace')">+ New Quotation</button>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="card" style="margin-bottom: 16px;">
      <div class="card-body" style="padding: 12px;">
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <input type="text" class="form-input" style="flex: 1; min-width: 220px;" placeholder="Search drafts by reference ID, customer name, contact person...">
          <select class="form-select" style="width: 170px;">
            <option>All Statuses</option>
            <option>In Progress</option>
            <option>Awaiting Confirmation</option>
            <option>Ready for Review</option>
          </select>
          <select class="form-select" style="width: 160px;">
            <option>All Team Members</option>
            <option>Alex Morgan</option>
            <option>Sarah Chen</option>
            <option>Tariq Al-Hashimi</option>
          </select>
          <button class="btn btn-secondary">Clear Filters</button>
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
            <tbody>
              <tr style="background-color: #f8fafc;">
                <td><input type="checkbox" checked></td>
                <td><strong class="draft-ref">${currentQuote.id}</strong> (Active Workspace)</td>
                <td>${currentQuote.customerAccount}</td>
                <td><span class="badge badge-info">Debtors Ledger [D]</span></td>
                <td>Just now</td>
                <td>4 lines (AED ${formatMoney(calculateTotals().grandTotal)})</td>
                <td><span class="badge badge-warning">1 Unresolved Item</span></td>
                <td>Alex Morgan</td>
                <td style="text-align: center;">
                  <button class="btn btn-primary btn-sm" onclick="resumeDraft('${currentQuote.id}')">Resume</button>
                  <button class="icon-btn" title="Delete draft" onclick="confirmDeleteDraft('${currentQuote.id}')">✕</button>
                </td>
              </tr>
              <tr>
                <td><input type="checkbox"></td>
                <td><span class="draft-ref">DRAFT-2026-0039</span></td>
                <td>Khansaheb Civil Engineering [ACC-44102]</td>
                <td><span class="badge badge-info">Debtors Ledger [D]</span></td>
                <td>45 mins ago</td>
                <td>12 lines (AED 42,100.00)</td>
                <td><span class="badge badge-danger">2 Unresolved Items</span></td>
                <td>Sarah Chen</td>
                <td style="text-align: center;">
                  <button class="btn btn-secondary btn-sm" onclick="showToast('Resuming DRAFT-2026-0039...')">Resume</button>
                  <button class="icon-btn" onclick="confirmDeleteDraft('DRAFT-2026-0039')">✕</button>
                </td>
              </tr>
              <tr>
                <td><input type="checkbox"></td>
                <td><span class="draft-ref">DRAFT-2026-0035</span></td>
                <td>Sobha Realty LLC [ACC-90112]</td>
                <td><span class="badge badge-draft">General Ledger [G]</span></td>
                <td>Yesterday 16:30</td>
                <td>2 lines (AED 1,450.00)</td>
                <td><span class="badge badge-confirmed">0 Unresolved</span></td>
                <td>Tariq Al-Hashimi</td>
                <td style="text-align: center;">
                  <button class="btn btn-secondary btn-sm" onclick="showToast('Resuming DRAFT-2026-0035...')">Resume</button>
                  <button class="icon-btn" onclick="confirmDeleteDraft('DRAFT-2026-0035')">✕</button>
                </td>
              </tr>
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

function resumeDraft(id) {
  showToast(`Draft ${id} resumed. Workspace restored.`);
  switchScreen("workspace");
}

function confirmDeleteDraft(id) {
  if (confirm(`Are you sure you want to delete ${id}? This action will remove all line items and customer notes and cannot be undone.`)) {
    showToast(`Draft ${id} deleted.`);
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
                <td>30 Days (28 Nov 2026)</td>
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
            <strong>${currentQuote.companyName}</strong><br>
            Account: ${currentQuote.customerAccount}<br>
            Attention: ${currentQuote.contactPerson}<br>
            Email: ${currentQuote.email} | Tel: ${currentQuote.phone}
          </div>
          <div>
            <div style="font-weight: 700; text-transform: uppercase; margin-bottom: 4px; color: var(--navy-900);">
              Project & Delivery Site:
            </div>
            Al-Futtaim Engineering MEP Logistics Central Hub<br>
            Jebel Ali Central Facility, Dubai, UAE<br>
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
          <strong>Amount in Words:</strong> Six Thousand Thirty-Two UAE Dirhams and 25/100 Only.
        </div>

        <!-- Commercial Terms -->
        <div class="terms-section">
          <div style="font-weight: 700; color: var(--navy-900); margin-bottom: 6px;">Commercial Terms & Delivery:</div>
          <div>• <strong>Lead Time:</strong> ${currentQuote.leadTime}</div>
          <div>• <strong>Delivery Terms:</strong> ${currentQuote.deliveryNotes}</div>
          <div>• <strong>Warranty:</strong> ${currentQuote.customerRemarks}</div>
          <div style="margin-top: 6px; font-size: 10px; color: var(--slate-500);">
            1. Prices valid for 30 calendar days. 2. This draft quotation is subject to final ERP booking and stock confirmation. 3. UAE VAT Registration TRN: 100293847500003.
          </div>
        </div>

        <!-- Signatory Block -->
        <div class="signatory-row">
          <div class="sign-box">
            Prepared By:<br>
            <strong>${currentQuote.createdBy}</strong><br>
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
// MODAL: PREPARE FOR ERP CONFIRMATION
// --------------------------------------------------------------------------
function openErpConfirmModal() {
  const totals = calculateTotals();
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
            <span>Customer route verified: <strong>Debtors Ledger [D]</strong> (Account: ACC-88219)</span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px;">
            <input type="checkbox" ${totals.hasUnmatchedItems ? '' : 'checked'} id="chkCatalog">
            <span>All ${currentQuote.lineItems.length} line items confirmed against ERP product master</span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px;">
            <input type="checkbox" ${totals.hasUnknownCost ? '' : 'checked'} id="chkCost">
            <span>Cost basis and margin verified (UAE VAT 5% compliant)</span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px;">
            <input type="checkbox" checked id="chkTerms">
            <span>Commercial lead time reviewed (${currentQuote.leadTime})</span>
          </label>
        </div>

        ${(totals.hasUnmatchedItems || totals.hasUnknownCost) ? `
          <div style="margin-top: 14px; padding: 8px 12px; background-color: var(--danger-bg); border: 1px solid var(--danger-border); border-radius: var(--radius-sm); font-size: 11.5px; color: var(--danger);">
            ✕ <strong>Action Required:</strong> Draft contains unmatched items or unconfirmed costs. Resolve in quotation workspace prior to ERP transmission.
          </div>
        ` : `
          <div style="margin-top: 14px; padding: 8px 12px; background-color: var(--success-bg); border: 1px solid var(--success-border); border-radius: var(--radius-sm); font-size: 11.5px; color: var(--success);">
            ✓ All checks passed! Ready for live ERP connector handshake.
          </div>
        `}
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="closeErpModal()">Return to Workspace</button>
        <button class="btn btn-primary" onclick="simulateErpHandshake()">
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
    alert("Simulated ERP Confirmation Complete!\n\nNote: In Phase 2 this triggers the real Windows ERP connector. No database records have been modified in this UI prototype.");
  }, 600);
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
  localStorage.setItem("MIM_CURRENT_DRAFT", JSON.stringify(currentQuote));
  const el = document.getElementById("lastSavedText");
  if (el) el.textContent = currentQuote.lastSaved;
  showToast(`Draft ${currentQuote.id} saved to local storage.`);
}

function runValidationCheck(showAlert = false) {
  const totals = calculateTotals();
  if (totals.hasPriceBelowCost) {
    if (showAlert) alert("Validation Blocked: One or more line items are priced below cost.");
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
  return (num || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
