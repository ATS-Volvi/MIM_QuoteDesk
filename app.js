/**
 * MIM QuoteFlow AI — High-Fidelity UI Prototype
 * Core State & Interactive Engine (Phase 1.5 Verified)
 */

// Initial Sample Drafts Database
const INITIAL_DRAFTS = {
  "DRAFT-2026-0042": {
    id: "DRAFT-2026-0042",
    status: "Draft",
    lifecycleState: "DRAFT",
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
    headerDiscountPercent: 0,
    approvals: [],
    auditTrail: [
      {
        eventId: "AUD-INIT-0042",
        quotationId: "DRAFT-2026-0042",
        eventType: "QUOTATION_CREATED",
        timestamp: "2026-10-30T08:00:00.000Z",
        actor: "Alex Morgan (Sales Engineer)",
        actorRole: "Sales Estimator",
        previousValue: null,
        newValue: "DRAFT-2026-0042",
        reason: "Initial quotation drafted from customer enquiry",
        isLocalDraftLog: true
      }
    ],
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
        discountPercent: 0,
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
        discountPercent: 0,
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
        discountPercent: 0,
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
        discountPercent: 0,
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
    lifecycleState: "DRAFT",
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
    headerDiscountPercent: 0,
    approvals: [],
    auditTrail: [
      {
        eventId: "AUD-INIT-0039",
        quotationId: "DRAFT-2026-0039",
        eventType: "QUOTATION_CREATED",
        timestamp: "2026-10-30T07:15:00.000Z",
        actor: "Sarah Chen (Senior Estimator)",
        actorRole: "Sales Estimator",
        previousValue: null,
        newValue: "DRAFT-2026-0039",
        reason: "Initial quotation drafted from Dubai Creek Harbour enquiry",
        isLocalDraftLog: true
      }
    ],
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
        discountPercent: 0,
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
        discountPercent: 0,
        cost: null, // Unknown cost - Blocker!
        status: "Awaiting",
        notes: "Blocker: Cost unavailable"
      }
    ]
  },
  "DRAFT-2026-0035": {
    id: "DRAFT-2026-0035",
    status: "Ready for Review",
    lifecycleState: "IN_REVIEW",
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
    headerDiscountPercent: 5,
    approvals: [],
    auditTrail: [
      {
        eventId: "AUD-INIT-0035",
        quotationId: "DRAFT-2026-0035",
        eventType: "QUOTATION_CREATED",
        timestamp: "2026-10-29T16:30:00.000Z",
        actor: "Tariq Al-Hashimi (Sales Engineer)",
        actorRole: "Sales Estimator",
        previousValue: null,
        newValue: "DRAFT-2026-0035",
        reason: "Initial quotation drafted for Sobha Hartland show villa",
        isLocalDraftLog: true
      },
      {
        eventId: "AUD-REV-0035",
        quotationId: "DRAFT-2026-0035",
        eventType: "STATUS_CHANGED",
        timestamp: "2026-10-29T16:45:00.000Z",
        actor: "Tariq Al-Hashimi (Sales Engineer)",
        actorRole: "Sales Estimator",
        previousValue: "DRAFT",
        newValue: "IN_REVIEW",
        reason: "Submitted for commercial review and approval",
        isLocalDraftLog: true
      }
    ],
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
        discountPercent: 0,
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
        discountPercent: 0,
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

// --------------------------------------------------------------------------
// Phase 4 Business Rules & Workflow Lifecycle Engines
// --------------------------------------------------------------------------
const pricingPolicyModule = (typeof MIM_PricingPolicy !== "undefined")
  ? MIM_PricingPolicy
  : (typeof require !== "undefined" ? require("./src/rules/pricingPolicy") : null);

const workflowLifecycleModule = (typeof MIM_WorkflowLifecycle !== "undefined")
  ? MIM_WorkflowLifecycle
  : (typeof require !== "undefined" ? require("./src/rules/workflowLifecycle") : null);

const defaultPricingEngine = (pricingPolicyModule && pricingPolicyModule.defaultPricingEngine)
  ? pricingPolicyModule.defaultPricingEngine
  : (pricingPolicyModule ? new pricingPolicyModule.PricingEngine() : null);

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
  const lifecycle = currentQuote.lifecycleState || "DRAFT";

  let lifecycleBadgeClass = "badge-draft";
  if (lifecycle === "IN_REVIEW") lifecycleBadgeClass = "badge-in-review";
  else if (lifecycle === "CHANGES_REQUESTED") lifecycleBadgeClass = "badge-changes-requested";
  else if (lifecycle === "APPROVED") lifecycleBadgeClass = "badge-approved";
  else if (lifecycle === "READY_FOR_ERP") lifecycleBadgeClass = "badge-ready-for-erp";

  const isAuditExpanded = window._mimAuditTrailExpanded !== false;

  container.innerHTML = `
    <!-- Top Quotation Bar -->
    <div class="workspace-top-bar">
      <div>
        <div class="workspace-title-group">
          <h1 class="workspace-title">Create Quotation</h1>
          <span class="badge ${lifecycleBadgeClass}">${lifecycle}</span>
          <span class="draft-ref">${currentQuote.id}</span>
        </div>
        <div class="meta-subtext">
          Created by <strong>${currentQuote.createdBy}</strong> • Last saved: <span id="lastSavedText">${currentQuote.lastSaved}</span> • ERP Demo Mode (Read-Only)
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
        ${lifecycle === 'DRAFT' ? `
          <button class="btn btn-teal" onclick="handleLifecycleTransition('IN_REVIEW')">
            Submit for Review →
          </button>
          <button class="btn btn-primary" onclick="handleLifecycleTransition('APPROVED')">
            Direct Approve
          </button>
        ` : ''}
        ${lifecycle === 'IN_REVIEW' ? `
          <button class="btn btn-primary" onclick="handleLifecycleTransition('APPROVED')">
            ✓ Approve (Commercial Manager)
          </button>
          <button class="btn btn-secondary" onclick="handleLifecycleTransition('CHANGES_REQUESTED')">
            Request Changes
          </button>
        ` : ''}
        ${lifecycle === 'CHANGES_REQUESTED' ? `
          <button class="btn btn-primary" onclick="handleLifecycleTransition('DRAFT')">
            Revise Draft →
          </button>
        ` : ''}
        ${lifecycle === 'APPROVED' ? `
          <button class="btn btn-primary" onclick="handleLifecycleTransition('READY_FOR_ERP')">
            Advance to Ready for ERP →
          </button>
          <button class="btn btn-secondary" onclick="handleLifecycleTransition('DRAFT')">
            Reopen Draft
          </button>
        ` : ''}
        ${lifecycle === 'READY_FOR_ERP' ? `
          <button class="btn btn-primary" onclick="openErpConfirmModal()">
            Pre-Flight ERP Staging Check →
          </button>
          <button class="btn btn-secondary" onclick="handleLifecycleTransition('DRAFT')">
            Reopen Draft
          </button>
        ` : ''}
      </div>
    </div>

    <!-- Lifecycle Stepper Bar -->
    <div class="lifecycle-stepper-bar">
      <div class="lifecycle-steps">
        <div class="lifecycle-step-node ${lifecycle === 'DRAFT' ? 'active' : (lifecycle !== 'DRAFT' ? 'completed' : '')}">
          <span class="lifecycle-step-dot">${lifecycle !== 'DRAFT' ? '✓' : '1'}</span>
          <span>Draft</span>
        </div>
        <span class="lifecycle-step-arrow">→</span>
        <div class="lifecycle-step-node ${lifecycle === 'IN_REVIEW' ? 'active' : (['APPROVED', 'READY_FOR_ERP'].includes(lifecycle) ? 'completed' : '')}">
          <span class="lifecycle-step-dot">${['APPROVED', 'READY_FOR_ERP'].includes(lifecycle) ? '✓' : '2'}</span>
          <span>In Review</span>
        </div>
        <span class="lifecycle-step-arrow">→</span>
        ${lifecycle === 'CHANGES_REQUESTED' ? `
          <div class="lifecycle-step-node active" style="color: #c2410c;">
            <span class="lifecycle-step-dot" style="background-color: #ffedd5; border-color: #fdba74; color: #c2410c;">!</span>
            <span>Changes Requested</span>
          </div>
          <span class="lifecycle-step-arrow">→</span>
        ` : ''}
        <div class="lifecycle-step-node ${lifecycle === 'APPROVED' ? 'active' : (lifecycle === 'READY_FOR_ERP' ? 'completed' : '')}">
          <span class="lifecycle-step-dot">${lifecycle === 'READY_FOR_ERP' ? '✓' : '3'}</span>
          <span>Approved</span>
        </div>
        <span class="lifecycle-step-arrow">→</span>
        <div class="lifecycle-step-node ${lifecycle === 'READY_FOR_ERP' ? 'active completed' : ''}">
          <span class="lifecycle-step-dot">${lifecycle === 'READY_FOR_ERP' ? '✓' : '4'}</span>
          <span>Ready for ERP</span>
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <span class="badge ${lifecycleBadgeClass}">Lifecycle: ${lifecycle}</span>
        ${totals.isMarginBelowThreshold ? '<span class="badge badge-warning">Low Margin Trigger</span>' : ''}
      </div>
    </div>

    <!-- Commercial Approvals Panel -->
    ${(currentQuote.approvals && currentQuote.approvals.length > 0) ? `
      <div class="approval-panel">
        <div class="approval-panel-header">
          <div class="approval-panel-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            Commercial Approval Policy Triggers (${currentQuote.approvals.length})
          </div>
          <span style="font-size: 11px; color: #6b21a8;">Demo Role: Estimating & Commercial Management</span>
        </div>
        ${currentQuote.approvals.map(appr => `
          <div class="approval-item-card">
            <div>
              <div class="approval-item-reason">${escapeHtml(appr.reason)}</div>
              <div class="approval-item-meta">
                Trigger: <strong>${appr.triggerType}</strong> • Assigned: <strong>${appr.assignedApprover}</strong> • Status: <strong style="color: ${appr.decision === 'APPROVED' ? 'var(--success)' : (appr.decision === 'PENDING' ? 'var(--warning)' : 'var(--danger)')};">${appr.decision}</strong>
                ${appr.approvalComments ? ` • Note: <em>"${escapeHtml(appr.approvalComments)}"</em>` : ''}
              </div>
            </div>
            <div class="approval-actions-group">
              ${appr.decision !== 'APPROVED' ? `
                <button class="btn btn-sm btn-teal" onclick="handleApprovalDecision('${appr.approvalId}', 'APPROVED')">✓ Approve</button>
                <button class="btn btn-sm btn-secondary" onclick="handleApprovalDecision('${appr.approvalId}', 'REQUEST_CHANGES')">Request Changes</button>
                <button class="btn btn-sm btn-danger" onclick="handleApprovalDecision('${appr.approvalId}', 'REJECTED')">✕ Reject</button>
              ` : `
                <span class="badge badge-confirmed">Approved by ${escapeHtml(appr.decisionBy || 'Commercial Manager')}</span>
              `}
            </div>
          </div>
        `).join('')}
      </div>
    ` : ''}

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
          All values in AED • UAE VAT at 5% applies (Provisional Demo Value)
        </div>
      </div>
      <div class="card-body" style="padding: 0;">
        <div class="table-container" style="border: none; margin-bottom: 0;">
          <table class="quote-table">
            <thead>
              <tr>
                <th style="width: 35px; text-align: center;">#</th>
                <th style="min-width: 200px;">Product / Description</th>
                <th style="width: 130px;">ERP Code</th>
                <th style="width: 160px;">Variant / Spec</th>
                <th style="width: 70px; text-align: right;">Qty</th>
                <th style="width: 55px;">Unit</th>
                <th style="width: 100px; text-align: right;">Selling Price</th>
                <th style="width: 70px; text-align: right;">Disc %</th>
                <th style="width: 95px; text-align: right;">Cost</th>
                <th style="width: 105px; text-align: right;">Line Total</th>
                <th style="width: 125px;">Status</th>
                <th style="width: 60px; text-align: center;">Actions</th>
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
          <span class="text-muted">Gross Subtotal (Excl. VAT)</span>
          <span class="font-mono">AED ${formatMoney(totals.subtotalBeforeHeaderDiscount || totals.subtotal)}</span>
        </div>

        <div class="summary-row" style="align-items: center;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span class="text-muted">Header Discount (%):</span>
            <input type="number" min="0" max="100" style="width: 46px; font-size: 11px; padding: 2px 4px; border: 1px solid var(--slate-300); border-radius: var(--radius-xs);" 
                   value="${currentQuote.headerDiscountPercent || 0}" 
                   onchange="updateHeaderDiscount(this.value)">
          </div>
          <span class="font-mono" style="color: var(--danger);">- AED ${formatMoney(totals.totalDiscountAmount || 0)}</span>
        </div>

        <div class="summary-row">
          <span class="text-muted">Net Subtotal</span>
          <span class="font-mono" style="font-weight: 600;">AED ${formatMoney(totals.subtotal)}</span>
        </div>

        <div class="summary-row">
          <span class="text-muted">
            UAE VAT at 5% <span class="badge badge-provisional">Provisional</span>
          </span>
          <span class="font-mono">AED ${formatMoney(totals.vat)}</span>
        </div>

        <div class="summary-row grand-total">
          <span>Grand Total</span>
          <span class="font-mono" style="color: var(--primary);">AED ${formatMoney(totals.grandTotal)}</span>
        </div>

        <div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--slate-200);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 11px; font-weight: 700; color: var(--slate-500); text-transform: uppercase;">
              Commercial Margin Analysis
            </span>
            <span class="badge badge-provisional">WAC Demo</span>
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
                : `<span class="margin-chip" style="${totals.isMarginBelowThreshold ? 'background-color: var(--danger-bg); color: var(--danger); border-color: var(--danger-border);' : ''}">${totals.grossMargin.toFixed(1)}%</span>`}
            </span>
          </div>

          ${totals.isMarginBelowThreshold ? `
            <div style="margin-top: 10px; padding: 6px 8px; background-color: var(--warning-bg); border: 1px solid var(--warning-border); border-radius: var(--radius-sm); font-size: 11px; color: var(--warning);">
              ⚠️ <strong>Margin Policy Warning:</strong> Gross margin (${totals.grossMargin}%) is below 15.0% threshold. Managerial approval required.
            </div>
          ` : ''}

          ${totals.hasPriceBelowCost ? `
            <div style="margin-top: 10px; padding: 6px 8px; background-color: var(--danger-bg); border: 1px solid var(--danger-border); border-radius: var(--radius-sm); font-size: 11px; color: var(--danger);">
              ⚠️ <strong>Below-Cost Item:</strong> One or more items are priced below cost. Managerial review required.
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

    <!-- Section: Structured Audit Trail Component -->
    <div class="audit-trail-card">
      <div class="audit-trail-header" onclick="toggleAuditTrail()">
        <div style="display: flex; align-items: center; gap: 8px;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          <span style="font-weight: 700; color: var(--navy-900);">Quotation Audit Trail (${currentQuote.auditTrail ? currentQuote.auditTrail.length : 0} Events)</span>
          <span class="badge badge-provisional">Append-Only Local Session Log</span>
        </div>
        <span style="font-size: 11px; color: var(--slate-500);" id="auditToggleText">
          ${isAuditExpanded ? 'Collapse ▲' : 'Expand ▼'}
        </span>
      </div>
      <div class="audit-timeline-list" id="auditTimelineContainer" style="display: ${isAuditExpanded ? 'flex' : 'none'};">
        ${renderAuditTrailEntries()}
      </div>
    </div>

    <!-- Section G: Validation Panel -->
    <div class="validation-strip">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-weight: 700; font-size: 12px; color: var(--navy-900);">Quotation Pre-Flight Validation:</span>
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
          <span>Products Confirmed (${totals.hasUnmatchedItems ? 'Unmatched SKUs' : 'All Confirmed'})</span>
        </div>
        <div class="check-item">
          ${totals.hasUnknownCost ? '<span class="check-icon-warning">⚠️</span>' : '<span class="check-icon-ready">✓</span>'}
          <span>Costs Available (${totals.hasUnknownCost ? 'Missing Cost' : 'Complete'})</span>
        </div>
        <div class="check-item">
          ${totals.hasPriceBelowCost ? '<span class="check-icon-blocked">✕</span>' : '<span class="check-icon-ready">✓</span>'}
          <span>Price Above Cost</span>
        </div>
        <div class="check-item">
          ${lifecycle === 'APPROVED' || lifecycle === 'READY_FOR_ERP' ? '<span class="check-icon-ready">✓</span>' : '<span class="check-icon-warning">⚠️</span>'}
          <span>Approval Status (${lifecycle})</span>
        </div>
      </div>
    </div>

    <!-- Section G Bottom Sticky Action Bar -->
    <div class="bottom-action-bar">
      <div style="display: flex; align-items: center; gap: 12px; font-size: 11.5px; color: var(--slate-500);">
        <span>Auto-save: <strong style="color: var(--success);">Active</strong></span>
        <span>•</span>
        <span>Lifecycle: <strong style="color: var(--navy-900);">${lifecycle}</strong></span>
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

// Calculations Engine with Strict Decimal Precision & Centralized Pricing Policy Support
function calculateTotals(targetQuote) {
  const quote = targetQuote || currentQuote;
  const items = (quote && Array.isArray(quote.lineItems)) ? quote.lineItems : [];
  const headerDiscPct = Math.min(Math.max(Number(quote && quote.headerDiscountPercent) || 0, 0), 100);

  let subtotal = 0;
  let totalCost = 0;
  let hasUnknownCost = false;
  let hasPriceBelowCost = false;
  let hasUnmatchedItems = false;
  let totalUnits = 0;
  let totalDiscountAmount = 0;

  items.forEach(item => {
    const qty = Math.max(1, Math.floor(Number(item.qty) || 1));
    const sellingPrice = Math.max(0, Number(item.sellingPrice) || 0);
    const disc = Math.min(Math.max(Number(item.discountPercent || item.discount) || 0, 0), 100);
    
    const gross = Math.round(qty * sellingPrice * 100) / 100;
    const discAmt = Math.round(gross * (disc / 100) * 100) / 100;
    const lineTotal = Math.round(Math.max(0, gross - discAmt) * 100) / 100;

    subtotal += lineTotal;
    totalUnits += qty;
    totalDiscountAmount += discAmt;

    if (item.cost === null || item.cost === undefined || isNaN(item.cost)) {
      hasUnknownCost = true;
    } else {
      const cost = Number(item.cost);
      const lineCost = Math.round(qty * cost * 100) / 100;
      totalCost += lineCost;
      if (sellingPrice < cost || lineTotal < lineCost) {
        hasPriceBelowCost = true;
      }
    }

    if (!item.erpCode) {
      hasUnmatchedItems = true;
    }
  });

  const subtotalBeforeHeaderDiscount = Math.round(subtotal * 100) / 100;
  const headerDiscountAmount = Math.round(subtotalBeforeHeaderDiscount * (headerDiscPct / 100) * 100) / 100;
  const netSubtotal = Math.round(Math.max(0, subtotalBeforeHeaderDiscount - headerDiscountAmount) * 100) / 100;
  totalDiscountAmount = Math.round((totalDiscountAmount + headerDiscountAmount) * 100) / 100;

  subtotal = netSubtotal;
  totalCost = Math.round(totalCost * 100) / 100;

  const vat = Math.round(subtotal * 0.05 * 100) / 100;
  const grandTotal = Math.round((subtotal + vat) * 100) / 100;
  const grossProfit = hasUnknownCost ? null : Math.round((subtotal - totalCost) * 100) / 100;
  const grossMargin = (hasUnknownCost || subtotal === 0) ? (hasUnknownCost ? null : 0) : Math.round(((grossProfit / subtotal) * 100) * 10) / 10;

  const isMarginBelowThreshold = !hasUnknownCost && grossMargin !== null && grossMargin < 15.0;

  const res = {
    subtotal,
    vat,
    grandTotal,
    totalCost: hasUnknownCost ? null : totalCost,
    grossProfit,
    grossMargin,
    hasUnknownCost,
    hasPriceBelowCost,
    hasUnmatchedItems,
    totalUnits,
    subtotalBeforeHeaderDiscount,
    headerDiscountPercent: headerDiscPct,
    headerDiscountAmount,
    totalDiscountAmount,
    isMarginBelowThreshold,
    currency: 'AED',
    isVatProvisional: true,
    costValuationBasis: 'WEIGHTED_AVERAGE_COST',
    isCostBasisProvisional: true
  };

  if (quote) {
    quote.financials = res;
    if (workflowLifecycleModule && typeof workflowLifecycleModule.syncQuoteApprovals === "function") {
      workflowLifecycleModule.syncQuoteApprovals(quote, defaultPricingEngine ? defaultPricingEngine.getPolicy() : {});
    }
  }

  return res;
}

// Update row field with audit trail recording
function updateRowField(id, field, value) {
  const item = currentQuote.lineItems.find(i => i.id === id);
  if (!item) return;

  const prev = item[field];

  if (field === "qty") {
    item.qty = Math.max(1, Math.floor(parseFloat(value) || 1));
    if (workflowLifecycleModule && prev !== item.qty) {
      workflowLifecycleModule.recordAuditEvent(currentQuote, {
        eventType: workflowLifecycleModule.AUDIT_EVENT_TYPES.QUANTITY_CHANGED,
        actor: workflowLifecycleModule.DEMO_ACTORS.ESTIMATOR,
        previousValue: prev,
        newValue: item.qty,
        reason: `Line ${item.lineNo || id} (${item.erpCode || item.description}) quantity changed`
      });
    }
  } else if (field === "sellingPrice") {
    item.sellingPrice = Math.max(0, Math.round((parseFloat(value) || 0) * 100) / 100);
    if (workflowLifecycleModule && prev !== item.sellingPrice) {
      workflowLifecycleModule.recordAuditEvent(currentQuote, {
        eventType: workflowLifecycleModule.AUDIT_EVENT_TYPES.SELLING_PRICE_CHANGED,
        actor: workflowLifecycleModule.DEMO_ACTORS.ESTIMATOR,
        previousValue: prev,
        newValue: item.sellingPrice,
        reason: `Line ${item.lineNo || id} (${item.erpCode || item.description}) unit selling price changed`
      });
    }
  } else if (field === "discountPercent") {
    item.discountPercent = Math.min(Math.max(parseFloat(value) || 0, 0), 100);
    if (workflowLifecycleModule && prev !== item.discountPercent) {
      workflowLifecycleModule.recordAuditEvent(currentQuote, {
        eventType: workflowLifecycleModule.AUDIT_EVENT_TYPES.DISCOUNT_CHANGED,
        actor: workflowLifecycleModule.DEMO_ACTORS.ESTIMATOR,
        previousValue: `${prev || 0}%`,
        newValue: `${item.discountPercent}%`,
        reason: `Line ${item.lineNo || id} (${item.erpCode || item.description}) discount updated`
      });
    }
  } else {
    item[field] = value;
  }

  renderWorkspace(document.getElementById("mainContent"));
}

// Update header discount with audit trail
function updateHeaderDiscount(val) {
  const prev = currentQuote.headerDiscountPercent || 0;
  const num = Math.min(Math.max(parseFloat(val) || 0, 0), 100);
  currentQuote.headerDiscountPercent = num;

  if (workflowLifecycleModule) {
    workflowLifecycleModule.recordAuditEvent(currentQuote, {
      eventType: workflowLifecycleModule.AUDIT_EVENT_TYPES.DISCOUNT_CHANGED,
      actor: workflowLifecycleModule.DEMO_ACTORS.ESTIMATOR,
      previousValue: `${prev}%`,
      newValue: `${num}%`,
      reason: `Overall quote header discount changed from ${prev}% to ${num}%`
    });
  }

  saveDraft();
  renderWorkspace(document.getElementById("mainContent"));
}

// Lifecycle transition handler through central validator
function handleLifecycleTransition(targetState) {
  if (!workflowLifecycleModule) {
    currentQuote.lifecycleState = targetState;
    currentQuote.status = targetState;
    renderWorkspace(document.getElementById("mainContent"));
    return;
  }

  const validation = workflowLifecycleModule.validateTransition(currentQuote, targetState, {
    isMockMode: true,
    pricingPolicy: defaultPricingEngine ? defaultPricingEngine.getPolicy() : {}
  });

  if (!validation.allowed) {
    const errorMsg = validation.errors.join('\n• ');
    alert(`Transition to ${targetState} Blocked:\n\n• ${errorMsg}`);
    return;
  }

  try {
    workflowLifecycleModule.executeTransition(currentQuote, targetState, {
      actor: workflowLifecycleModule.DEMO_ACTORS.ESTIMATOR,
      reason: `Quotation advanced to ${targetState}`
    });
    currentQuote.status = targetState;
    saveDraft();
    renderWorkspace(document.getElementById("mainContent"));
    showToast(`Quotation transitioned to ${targetState}`);
  } catch (err) {
    alert(`Transition Error: ${err.message}`);
  }
}

// Approval decision resolution
function handleApprovalDecision(approvalId, decision) {
  if (!workflowLifecycleModule) return;
  const approver = workflowLifecycleModule.DEMO_ACTORS.COMMERCIAL_MANAGER;
  let comments = '';
  if (decision === 'REQUEST_CHANGES') {
    comments = prompt('Enter change requests or required price adjustments for estimator:', 'Please reduce line discount or increase margin to minimum 15%');
    if (comments === null) return;
  } else if (decision === 'REJECT') {
    comments = prompt('Enter reason for commercial rejection:', 'Pricing does not meet company commercial thresholds');
    if (comments === null) return;
  } else {
    comments = 'Commercial and margin thresholds verified & accepted by Demo Manager.';
  }

  try {
    workflowLifecycleModule.applyApprovalDecision(currentQuote, approvalId, decision, approver, comments);
    
    if (decision === 'CHANGES_REQUESTED') {
      currentQuote.lifecycleState = workflowLifecycleModule.LIFECYCLE_STATES.CHANGES_REQUESTED;
      currentQuote.status = 'Changes Requested';
    } else if (decision === 'APPROVED') {
      const allApproved = currentQuote.approvals.every(a => a.decision === 'APPROVED');
      if (allApproved) {
        currentQuote.lifecycleState = workflowLifecycleModule.LIFECYCLE_STATES.APPROVED;
        currentQuote.status = 'Approved';
      }
    } else if (decision === 'REJECTED') {
      currentQuote.lifecycleState = workflowLifecycleModule.LIFECYCLE_STATES.CHANGES_REQUESTED;
      currentQuote.status = 'Rejected';
    }

    saveDraft();
    renderWorkspace(document.getElementById("mainContent"));
    showToast(`Approval decision recorded: ${decision}`);
  } catch (err) {
    alert(`Approval action failed: ${err.message}`);
  }
}

// Toggle Audit Trail
function toggleAuditTrail() {
  window._mimAuditTrailExpanded = window._mimAuditTrailExpanded === false ? true : false;
  const el = document.getElementById("auditTimelineContainer");
  const txt = document.getElementById("auditToggleText");
  if (el) {
    el.style.display = window._mimAuditTrailExpanded ? "flex" : "none";
  }
  if (txt) {
    txt.textContent = window._mimAuditTrailExpanded ? "Collapse ▲" : "Expand ▼";
  }
}

// Render Audit Trail Entries
function renderAuditTrailEntries() {
  const trail = (currentQuote && Array.isArray(currentQuote.auditTrail)) ? currentQuote.auditTrail : [];
  if (trail.length === 0) {
    return `<div style="padding: 12px; color: var(--slate-400); font-size: 11px; text-align: center;">No audit events recorded for this draft.</div>`;
  }
  return trail.slice().reverse().map(ev => `
    <div class="audit-entry">
      <span class="audit-entry-time">${new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
      <span class="audit-entry-tag">${ev.eventType}</span>
      <div class="audit-entry-body">
        <div class="audit-entry-actor">${escapeHtml(ev.actor)} <span style="font-weight: 400; color: var(--slate-500);">(${ev.actorRole || 'User'})</span></div>
        <div class="audit-entry-desc">${escapeHtml(ev.reason || '')} ${ev.previousValue !== null && ev.newValue !== null ? `[${ev.previousValue} ➔ ${ev.newValue}]` : ''}</div>
      </div>
    </div>
  `).join('');
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
              <th style="width: 110px;">ERP Code</th>
              <th>Description & Specification</th>
              <th style="width: 50px; text-align: right;">Qty</th>
              <th style="width: 45px;">Unit</th>
              <th style="width: 85px; text-align: right;">Rate (AED)</th>
              <th style="width: 60px; text-align: right;">Disc %</th>
              <th style="width: 95px; text-align: right;">Total (AED)</th>
            </tr>
          </thead>
          <tbody>
            ${currentQuote.lineItems.map((item, idx) => {
              const qty = Math.max(1, Math.floor(Number(item.qty) || 1));
              const sellingPrice = Math.max(0, Number(item.sellingPrice) || 0);
              const disc = Math.min(Math.max(Number(item.discountPercent || item.discount) || 0, 0), 100);
              const lineTotal = Math.round(Math.max(0, (qty * sellingPrice) * (1 - disc / 100)) * 100) / 100;
              return `
                <tr>
                  <td>${idx + 1}</td>
                  <td class="font-mono">${item.erpCode || '<span style="color: var(--warning);">[MATCH PENDING]</span>'}</td>
                  <td>
                    <strong>${escapeHtml(item.description)}</strong>
                    <div style="font-size: 10.5px; color: var(--slate-600);">${escapeHtml(item.variant)}</div>
                  </td>
                  <td style="text-align: right;">${qty}</td>
                  <td>${item.unit}</td>
                  <td style="text-align: right; font-family: var(--font-mono);">${sellingPrice.toFixed(2)}</td>
                  <td style="text-align: right; font-family: var(--font-mono);">${disc > 0 ? disc + '%' : '-'}</td>
                  <td style="text-align: right; font-family: var(--font-mono); font-weight: 600;">
                    ${formatMoney(lineTotal)}
                  </td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>

        <!-- Financial Summary -->
        <div style="display: flex; justify-content: flex-end; margin-bottom: 16px;">
          <div style="width: 340px;">
            <div class="summary-row">
              <span class="text-muted">Gross Subtotal (Excl. VAT):</span>
              <span class="font-mono">AED ${formatMoney(totals.subtotalBeforeHeaderDiscount || totals.subtotal)}</span>
            </div>
            ${(totals.totalDiscountAmount > 0) ? `
              <div class="summary-row">
                <span class="text-muted">Total Discounts Applied:</span>
                <span class="font-mono" style="color: var(--danger);">- AED ${formatMoney(totals.totalDiscountAmount)}</span>
              </div>
            ` : ''}
            <div class="summary-row">
              <span class="text-muted">Net Subtotal:</span>
              <span class="font-mono" style="font-weight: 600;">AED ${formatMoney(totals.subtotal)}</span>
            </div>
            <div class="summary-row">
              <span class="text-muted">UAE VAT at 5.0% (Provisional):</span>
              <span class="font-mono">AED ${formatMoney(totals.vat)}</span>
            </div>
            <div class="summary-row grand-total" style="font-size: 15px; border-top: 2px solid var(--navy-900);">
              <span>Grand Total:</span>
              <span class="font-mono" style="color: var(--navy-900);">AED ${formatMoney(totals.grandTotal)}</span>
            </div>
          </div>
        </div>

        <div class="amount-words-box">
          <strong>Currency:</strong> United Arab Emirates Dirham (AED) • Applicable UAE VAT: 5.0% (Provisional) • Cost Basis: WAC (Provisional)
        </div>

        <!-- Commercial Terms -->
        <div class="terms-section">
          <div style="font-weight: 700; color: var(--navy-900); margin-bottom: 6px;">Commercial Terms & Delivery:</div>
          <div>• <strong>Lead Time:</strong> ${escapeHtml(currentQuote.leadTime)}</div>
          <div>• <strong>Delivery Terms:</strong> ${escapeHtml(currentQuote.deliveryNotes)}</div>
          <div>• <strong>Warranty:</strong> ${escapeHtml(currentQuote.customerRemarks)}</div>
          <div style="margin-top: 6px; font-size: 10px; color: var(--slate-500);">
            1. Prices valid for 30 calendar days. 2. This draft quotation is a preliminary estimate and does NOT constitute an official ERP order confirmation. 3. UAE VAT Registration TRN: 100293847500003 (Provisional).
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
  const lifecycle = currentQuote.lifecycleState || "DRAFT";
  const isLifecycleApproved = lifecycle === 'APPROVED' || lifecycle === 'READY_FOR_ERP';
  const isBlocked = totals.hasPriceBelowCost || totals.hasUnknownCost || totals.hasUnmatchedItems || !isLifecycleApproved;

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
          ⚠️ <strong>UI Prototype Demo Mode (Read-Only Connector):</strong> This application prepares and validates quotations.
          Official ERP quotation records are strictly generated only by the authoritative live Windows ERP database.
          <strong>ERP_CONFIRMED is prohibited in mock mode.</strong>
        </div>

        <div style="font-weight: 700; margin-bottom: 10px; font-size: 12.5px;">Pre-Flight Verification Checklist:</div>

        <div style="display: flex; flex-direction: column; gap: 8px; font-size: 12px;">
          <label style="display: flex; align-items: center; gap: 8px;">
            <input type="checkbox" ${isLifecycleApproved ? 'checked' : ''} disabled>
            <span>Quotation Lifecycle Status: <strong>${lifecycle}</strong> ${isLifecycleApproved ? '(Approved)' : '(Approval Required)'}</span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px;">
            <input type="checkbox" checked disabled>
            <span>Customer routing verified: <strong>${currentQuote.customerRoute === 'D' ? 'Debtors Ledger [D]' : 'General Ledger [G]'}</strong></span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px;">
            <input type="checkbox" ${totals.hasUnmatchedItems ? '' : 'checked'} disabled>
            <span>All ${currentQuote.lineItems.length} line items confirmed against ERP product master</span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px;">
            <input type="checkbox" ${totals.hasUnknownCost ? '' : 'checked'} disabled>
            <span>Cost basis available and recorded in catalog (WAC Provisional)</span>
          </label>
          <label style="display: flex; align-items: center; gap: 8px;">
            <input type="checkbox" ${totals.hasPriceBelowCost ? '' : 'checked'} disabled>
            <span>No line item priced below recorded cost</span>
          </label>
        </div>

        ${isBlocked ? `
          <div style="margin-top: 14px; padding: 10px 14px; background-color: var(--danger-bg); border: 1px solid var(--danger-border); border-radius: var(--radius-sm); font-size: 11.5px; color: var(--danger);">
            ✕ <strong>Action Blocked:</strong> Cannot proceed to ERP preparation due to the following issues:
            <ul style="margin: 6px 0 0 16px;">
              ${!isLifecycleApproved ? `<li>Quotation must be in 'APPROVED' or 'READY_FOR_ERP' state (Current: '${lifecycle}').</li>` : ''}
              ${totals.hasPriceBelowCost ? '<li>One or more items are priced below cost.</li>' : ''}
              ${totals.hasUnknownCost ? '<li>One or more items have unknown cost.</li>' : ''}
              ${totals.hasUnmatchedItems ? '<li>One or more items are awaiting ERP catalog matching.</li>' : ''}
            </ul>
          </div>
        ` : `
          <div style="margin-top: 14px; padding: 10px 14px; background-color: var(--success-bg); border: 1px solid var(--success-border); border-radius: var(--radius-sm); font-size: 11.5px; color: var(--success);">
            ✓ All pre-flight checks passed! Ready for ERP staging payload generation.
          </div>
        `}
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="closeErpModal()">Return to Workspace</button>
        <button class="btn btn-primary" ${isBlocked ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''} onclick="${isBlocked ? '' : 'simulateErpHandshake()'}">
          Attempt ERP Confirmation Handshake (Mock)
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
}

function simulateErpHandshake() {
  closeErpModal();
  if (workflowLifecycleModule) {
    try {
      // Intentionally attempt transition through central validator to prove strict security boundary
      workflowLifecycleModule.executeTransition(currentQuote, 'ERP_CONFIRMED', { isMockMode: true });
    } catch (err) {
      alert(`ERP Confirmation Guard (Security Boundary Enforced):\n\n${err.message}\n\nNotice: This connector is operating in MOCK_DEMO_DATA mode. Live ERP write operations and official ERP quotation numbers are strictly prohibited until Phase 5 live connector certification.\n\nThe quotation has been safely advanced to 'READY_FOR_ERP' for future staging.`);
      
      if (currentQuote.lifecycleState === 'APPROVED') {
        currentQuote.lifecycleState = 'READY_FOR_ERP';
        currentQuote.status = 'Ready for ERP';
        saveDraft();
        renderWorkspace(document.getElementById("mainContent"));
      }
      return;
    }
  }
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
