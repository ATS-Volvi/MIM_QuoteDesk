/**
 * MIM QuoteFlow AI — Phase 4: Business Rules & Workflow Hardening Tests
 * 
 * Verifies:
 * 1. Pricing Policy Configuration & Calculation Engine
 * 2. Quotation Lifecycle Transitions & Transition Validator
 * 3. Commercial Approval Framework (Triggers, Decisions, Roles)
 * 4. Append-Only Structured Audit Trail Generation
 * 5. Mock-Only ERP Confirmation Restrictions (ERP_CONFIRMED blocked)
 * 6. Protection against Unknown Cost becoming Zero
 * 7. Customer & Product Validation Hardening
 */

const assert = require('assert');
const { DEFAULT_PRICING_POLICY, PricingEngine } = require('../src/rules/pricingPolicy.js');
const {
  LIFECYCLE_STATES,
  VALID_TRANSITIONS,
  DEMO_ACTORS,
  APPROVAL_TRIGGERS,
  APPROVAL_DECISIONS,
  AUDIT_EVENT_TYPES,
  createAuditEvent,
  recordAuditEvent,
  detectApprovalTriggers,
  syncQuoteApprovals,
  applyApprovalDecision,
  validateTransition,
  executeTransition
} = require('../src/rules/workflowLifecycle.js');
const { mockConnector } = require('../src/connector/erpConnector.js');

let totalAssertions = 0;

function it(desc, fn) {
  try {
    fn();
    console.log(`  ✓ ${desc}`);
  } catch (err) {
    console.error(`  ✗ FAIL: ${desc}`);
    console.error(err);
    process.exit(1);
  }
}

console.log('================================================================');
console.log('MIM QuoteFlow AI — Phase 4 Business Rules & Workflow Test Suite');
console.log('================================================================\n');

// -----------------------------------------------------------------------------
// 1. Pricing Policy & Calculation Engine Tests
// -----------------------------------------------------------------------------
console.log('1. Pricing Policy & Calculation Engine:');

it('should initialize with default provisional VAT (5%) and provisional WAC cost basis', () => {
  const engine = new PricingEngine();
  const policy = engine.getPolicy();
  assert.strictEqual(policy.currency, 'AED');
  assert.strictEqual(policy.vatRate, 0.05);
  assert.strictEqual(policy.isVatProvisional, true);
  assert.strictEqual(policy.costValuationBasis, 'WEIGHTED_AVERAGE_COST');
  assert.strictEqual(policy.isCostBasisProvisional, true);
  assert.strictEqual(policy.decimalPrecision, 2);
  totalAssertions += 6;
});

it('should calculate accurate line totals with discount and proper rounding', () => {
  const engine = new PricingEngine();
  // Qty: 10, Unit Price: 45.50, Discount: 10%
  // Gross: 455.00, Discount: 45.50, Net: 409.50
  const line = engine.calculateLineTotal(10, 45.50, 10);
  assert.strictEqual(line.qty, 10);
  assert.strictEqual(line.unitPrice, 45.50);
  assert.strictEqual(line.grossTotal, 455.00);
  assert.strictEqual(line.discountAmount, 45.50);
  assert.strictEqual(line.lineTotal, 409.50);
  totalAssertions += 5;
});

it('should handle zero-value quotations gracefully without errors', () => {
  const engine = new PricingEngine();
  const totals = engine.calculateQuoteTotals([]);
  assert.strictEqual(totals.subtotal, 0);
  assert.strictEqual(totals.vat, 0);
  assert.strictEqual(totals.grandTotal, 0);
  assert.strictEqual(totals.totalCost, 0);
  assert.strictEqual(totals.grossProfit, 0);
  assert.strictEqual(totals.grossMargin, 0);
  totalAssertions += 6;
});

it('should NEVER convert unknown cost to zero', () => {
  const engine = new PricingEngine();
  const lines = [
    { id: 1, erpCode: 'CBL-001', description: 'Cable', qty: 5, sellingPrice: 100, cost: null }
  ];
  const totals = engine.calculateQuoteTotals(lines);
  assert.strictEqual(totals.hasUnknownCost, true);
  assert.strictEqual(totals.totalCost, null, 'totalCost must remain null when an item cost is unknown');
  assert.strictEqual(totals.grossProfit, null, 'grossProfit must remain null when cost is unknown');
  assert.strictEqual(totals.grossMargin, null, 'grossMargin must remain null when cost is unknown');
  assert.strictEqual(totals.lines[0].lineCost, null);
  assert.strictEqual(totals.lines[0].isCostUnknown, true);
  totalAssertions += 6;
});

it('should detect below-cost sales and calculate accurate margins', () => {
  const engine = new PricingEngine();
  const lines = [
    { id: 1, erpCode: 'CBL-001', description: 'Cable A', qty: 2, sellingPrice: 50, cost: 60 } // Sold below cost
  ];
  const totals = engine.calculateQuoteTotals(lines);
  assert.strictEqual(totals.hasPriceBelowCost, true);
  assert.strictEqual(totals.belowCostLines.length, 1);
  assert.strictEqual(totals.subtotal, 100);
  assert.strictEqual(totals.totalCost, 120);
  assert.strictEqual(totals.grossProfit, -20);
  assert.strictEqual(totals.grossMargin, -20);
  assert.strictEqual(totals.isMarginBelowThreshold, true);
  totalAssertions += 7;
});

it('should apply both line discounts and header discount accurately with VAT', () => {
  const engine = new PricingEngine();
  const lines = [
    { id: 1, erpCode: 'CBL-001', description: 'Cable 1', qty: 10, sellingPrice: 100, cost: 70, discountPercent: 10 }, // 1000 - 100 = 900
    { id: 2, erpCode: 'SWG-002', description: 'Switch 2', qty: 5, sellingPrice: 200, cost: 150, discountPercent: 0 }    // 1000 - 0 = 1000
  ];
  // Subtotal before header discount = 1900
  // Header discount 5% = 95
  // Net subtotal = 1805
  // VAT 5% = 90.25
  // Grand Total = 1895.25
  const totals = engine.calculateQuoteTotals(lines, { percent: 5 });
  assert.strictEqual(totals.subtotalBeforeHeaderDiscount, 1900);
  assert.strictEqual(totals.headerDiscountPercent, 5);
  assert.strictEqual(totals.headerDiscountAmount, 95);
  assert.strictEqual(totals.subtotal, 1805);
  assert.strictEqual(totals.vat, 90.25);
  assert.strictEqual(totals.grandTotal, 1895.25);
  totalAssertions += 6;
});

it('should support dynamic policy reconfiguration', () => {
  const engine = new PricingEngine({ vatRate: 0.10, minimumMarginThreshold: 20 });
  const policy = engine.getPolicy();
  assert.strictEqual(policy.vatRate, 0.10);
  assert.strictEqual(policy.minimumMarginThreshold, 20);

  engine.updatePolicy({ vatRate: 0.05 });
  assert.strictEqual(engine.getPolicy().vatRate, 0.05);
  totalAssertions += 3;
});

// -----------------------------------------------------------------------------
// 2. Quotation Lifecycle & Transition Validator Tests
// -----------------------------------------------------------------------------
console.log('\n2. Quotation Lifecycle & Transition Validator:');

it('should define all 6 required states', () => {
  assert.ok(LIFECYCLE_STATES.DRAFT);
  assert.ok(LIFECYCLE_STATES.IN_REVIEW);
  assert.ok(LIFECYCLE_STATES.CHANGES_REQUESTED);
  assert.ok(LIFECYCLE_STATES.APPROVED);
  assert.ok(LIFECYCLE_STATES.READY_FOR_ERP);
  assert.ok(LIFECYCLE_STATES.ERP_CONFIRMED);
  totalAssertions += 6;
});

it('should strictly BLOCK transition to ERP_CONFIRMED in mock mode', () => {
  const quote = {
    lifecycleState: LIFECYCLE_STATES.READY_FOR_ERP,
    customerName: 'Al Naboodah Contracting LLC',
    items: [{ erpCode: 'CBL-001', description: 'Cable', qty: 10, sellingPrice: 100, cost: 70 }]
  };

  const validation = validateTransition(quote, LIFECYCLE_STATES.ERP_CONFIRMED, { isMockMode: true });
  assert.strictEqual(validation.allowed, false);
  assert.ok(validation.errors.some(e => e.includes('ERR_ERP_CONFIRMATION_NOT_PERMITTED_IN_MOCK')));

  assert.throws(() => {
    executeTransition(quote, LIFECYCLE_STATES.ERP_CONFIRMED, { isMockMode: true });
  }, /ERR_ERP_CONFIRMATION_NOT_PERMITTED_IN_MOCK/);

  totalAssertions += 3;
});

it('should disallow invalid transitions that skip required states (e.g. DRAFT direct to READY_FOR_ERP)', () => {
  const quote = {
    lifecycleState: LIFECYCLE_STATES.DRAFT,
    customerName: 'Al Naboodah Contracting LLC',
    items: [{ erpCode: 'CBL-001', description: 'Cable', qty: 10, sellingPrice: 100, cost: 70 }]
  };

  const validation = validateTransition(quote, LIFECYCLE_STATES.READY_FOR_ERP);
  assert.strictEqual(validation.allowed, false);
  assert.ok(validation.errors.some(e => e.includes('Illegal state transition')));
  totalAssertions += 2;
});

it('should block approval if customer name is missing', () => {
  const quote = {
    lifecycleState: LIFECYCLE_STATES.DRAFT,
    customerName: '',
    items: [{ erpCode: 'CBL-001', description: 'Cable', qty: 10, sellingPrice: 100, cost: 70 }]
  };

  const validation = validateTransition(quote, LIFECYCLE_STATES.APPROVED);
  assert.strictEqual(validation.allowed, false);
  assert.ok(validation.errors.some(e => e.includes('Customer legal entity name is required')));
  totalAssertions += 2;
});

it('should block approval if unconfirmed/unmatched items exist', () => {
  const quote = {
    lifecycleState: LIFECYCLE_STATES.DRAFT,
    customerName: 'Al Naboodah Contracting LLC',
    items: [
      { erpCode: 'CBL-001', description: 'Cable', qty: 10, sellingPrice: 100, cost: 70 },
      { erpCode: null, description: 'Unknown Switchgear', qty: 1, sellingPrice: 200, cost: null }
    ]
  };

  const validation = validateTransition(quote, LIFECYCLE_STATES.APPROVED);
  assert.strictEqual(validation.allowed, false);
  assert.ok(validation.errors.some(e => e.includes('unconfirmed')));
  totalAssertions += 2;
});

it('should block approval if item cost is unknown', () => {
  const quote = {
    lifecycleState: LIFECYCLE_STATES.DRAFT,
    customerName: 'Al Naboodah Contracting LLC',
    items: [
      { erpCode: 'CBL-001', description: 'Cable', qty: 10, sellingPrice: 100, cost: null }
    ]
  };

  const validation = validateTransition(quote, LIFECYCLE_STATES.APPROVED);
  assert.strictEqual(validation.allowed, false);
  assert.ok(validation.errors.some(e => e.includes('unknown cost')));
  totalAssertions += 2;
});

// -----------------------------------------------------------------------------
// 3. Approval Framework Tests
// -----------------------------------------------------------------------------
console.log('\n3. Commercial Approval Framework:');

it('should detect high discount trigger (> 15%)', () => {
  const quote = {
    customerName: 'Test Customer',
    items: [
      { erpCode: 'CBL-001', description: 'Cable', qty: 10, sellingPrice: 100, cost: 70, discountPercent: 20 }
    ]
  };
  const triggers = detectApprovalTriggers(quote, DEFAULT_PRICING_POLICY);
  assert.ok(triggers.some(t => t.triggerType === APPROVAL_TRIGGERS.HIGH_DISCOUNT));
  totalAssertions += 1;
});

it('should detect below-cost selling price trigger', () => {
  const quote = {
    customerName: 'Test Customer',
    items: [
      { erpCode: 'CBL-001', description: 'Cable', qty: 10, sellingPrice: 50, cost: 70, discountPercent: 0 }
    ]
  };
  const triggers = detectApprovalTriggers(quote, DEFAULT_PRICING_POLICY);
  assert.ok(triggers.some(t => t.triggerType === APPROVAL_TRIGGERS.BELOW_COST_PRICE));
  totalAssertions += 1;
});

it('should detect credit hold customer trigger', () => {
  const quote = {
    customerName: 'Dubai Horizon Builders LLC',
    customerStatus: 'CREDIT_HOLD',
    items: [
      { erpCode: 'CBL-001', description: 'Cable', qty: 10, sellingPrice: 100, cost: 70 }
    ]
  };
  const triggers = detectApprovalTriggers(quote, DEFAULT_PRICING_POLICY);
  assert.ok(triggers.some(t => t.triggerType === APPROVAL_TRIGGERS.CREDIT_HOLD_CUSTOMER));
  assert.strictEqual(triggers[0].assignedApprover.id, DEMO_ACTORS.FINANCE_MANAGER.id);
  totalAssertions += 2;
});

it('should block transition to APPROVED when triggers are unresolved', () => {
  const quote = {
    lifecycleState: LIFECYCLE_STATES.DRAFT,
    customerName: 'Dubai Horizon Builders LLC',
    customerStatus: 'CREDIT_HOLD',
    items: [
      { erpCode: 'CBL-001', description: 'Cable', qty: 10, sellingPrice: 100, cost: 70 }
    ],
    approvals: []
  };

  const validation = validateTransition(quote, LIFECYCLE_STATES.APPROVED, { pricingPolicy: DEFAULT_PRICING_POLICY });
  assert.strictEqual(validation.allowed, false);
  assert.ok(validation.requiredApprovals.length > 0);
  totalAssertions += 2;
});

it('should allow transition to APPROVED once all approvals are granted by authorized demo approvers', () => {
  const quote = {
    lifecycleState: LIFECYCLE_STATES.IN_REVIEW,
    customerName: 'Dubai Horizon Builders LLC',
    customerStatus: 'CREDIT_HOLD',
    items: [
      { erpCode: 'CBL-001', description: 'Cable', qty: 10, sellingPrice: 100, cost: 70 }
    ],
    approvals: []
  };

  syncQuoteApprovals(quote, DEFAULT_PRICING_POLICY);
  assert.strictEqual(quote.approvals.length, 1);
  const approvalId = quote.approvals[0].approvalId;

  // Resolve with approve
  applyApprovalDecision(quote, approvalId, APPROVAL_DECISIONS.APPROVED, DEMO_ACTORS.FINANCE_MANAGER, 'Customer cleared overdue invoice via cheque.');
  assert.strictEqual(quote.approvals[0].decision, APPROVAL_DECISIONS.APPROVED);

  const validation = validateTransition(quote, LIFECYCLE_STATES.APPROVED, { pricingPolicy: DEFAULT_PRICING_POLICY });
  assert.strictEqual(validation.allowed, true);

  const res = executeTransition(quote, LIFECYCLE_STATES.APPROVED, { actor: DEMO_ACTORS.COMMERCIAL_MANAGER });
  assert.strictEqual(res.newState, LIFECYCLE_STATES.APPROVED);
  assert.strictEqual(quote.lifecycleState, LIFECYCLE_STATES.APPROVED);
  totalAssertions += 6;
});

it('should support Request Changes and Reject decisions', () => {
  const quote = {
    lifecycleState: LIFECYCLE_STATES.IN_REVIEW,
    customerName: 'Test Co',
    items: [{ erpCode: 'CBL-001', qty: 1, sellingPrice: 100, cost: 70 }],
    approvals: [{
      approvalId: 'APP-1',
      triggerType: APPROVAL_TRIGGERS.HIGH_DISCOUNT,
      decision: APPROVAL_DECISIONS.PENDING
    }]
  };

  applyApprovalDecision(quote, 'APP-1', APPROVAL_DECISIONS.CHANGES_REQUESTED, DEMO_ACTORS.COMMERCIAL_MANAGER, 'Cap discount at 8% maximum');
  assert.strictEqual(quote.approvals[0].decision, APPROVAL_DECISIONS.CHANGES_REQUESTED);

  // Transition to CHANGES_REQUESTED
  const res = executeTransition(quote, LIFECYCLE_STATES.CHANGES_REQUESTED, { actor: DEMO_ACTORS.COMMERCIAL_MANAGER });
  assert.strictEqual(quote.lifecycleState, LIFECYCLE_STATES.CHANGES_REQUESTED);
  totalAssertions += 2;
});

// -----------------------------------------------------------------------------
// 4. Structured Append-Only Audit Trail Tests
// -----------------------------------------------------------------------------
console.log('\n4. Structured Append-Only Audit Trail:');

it('should generate valid structured audit events with required fields', () => {
  const event = createAuditEvent({
    quotationId: 'QT-2026-TEST',
    eventType: AUDIT_EVENT_TYPES.CUSTOMER_SELECTED,
    actor: DEMO_ACTORS.ESTIMATOR,
    previousValue: null,
    newValue: 'Gulf Electromechanical WLL',
    reason: 'Enquiry matched customer ledger'
  });

  assert.ok(event.eventId.startsWith('AUD-'));
  assert.strictEqual(event.quotationId, 'QT-2026-TEST');
  assert.strictEqual(event.eventType, AUDIT_EVENT_TYPES.CUSTOMER_SELECTED);
  assert.strictEqual(event.actor, DEMO_ACTORS.ESTIMATOR.name);
  assert.strictEqual(event.newValue, 'Gulf Electromechanical WLL');
  assert.ok(event.timestamp);
  assert.strictEqual(event.isLocalDraftLog, true);
  totalAssertions += 7;
});

it('should append events monotonically to quote.auditTrail', () => {
  const quote = { id: 'QT-100', auditTrail: [] };
  
  recordAuditEvent(quote, {
    eventType: AUDIT_EVENT_TYPES.QUOTATION_CREATED,
    actor: DEMO_ACTORS.ESTIMATOR,
    newValue: 'QT-100'
  });

  recordAuditEvent(quote, {
    eventType: AUDIT_EVENT_TYPES.PRODUCT_ADDED,
    actor: DEMO_ACTORS.ESTIMATOR,
    newValue: 'CBL-4C-016-CU'
  });

  recordAuditEvent(quote, {
    eventType: AUDIT_EVENT_TYPES.STATUS_CHANGED,
    actor: DEMO_ACTORS.ESTIMATOR,
    previousValue: 'DRAFT',
    newValue: 'IN_REVIEW'
  });

  assert.strictEqual(quote.auditTrail.length, 3);
  assert.strictEqual(quote.auditTrail[0].eventType, AUDIT_EVENT_TYPES.QUOTATION_CREATED);
  assert.strictEqual(quote.auditTrail[1].eventType, AUDIT_EVENT_TYPES.PRODUCT_ADDED);
  assert.strictEqual(quote.auditTrail[2].eventType, AUDIT_EVENT_TYPES.STATUS_CHANGED);
  totalAssertions += 4;
});

// -----------------------------------------------------------------------------
// 5. Complete Lifecycle Sequence: DRAFT -> IN_REVIEW -> APPROVED -> READY_FOR_ERP
// -----------------------------------------------------------------------------
console.log('\n5. Complete Lifecycle Sequence:');

it('should execute end-to-end happy path lifecycle transition successfully', () => {
  const quote = {
    id: 'QT-2026-FLOW',
    lifecycleState: LIFECYCLE_STATES.DRAFT,
    customerName: 'Al Naboodah Contracting LLC',
    customerStatus: 'ACTIVE',
    recipientType: 'DEBTORS',
    items: [
      {
        id: 'line-1',
        erpCode: 'CBL-4C-016-CU',
        description: 'XLPE/SWA/PVC 4-Core 16mm²',
        qty: 100,
        sellingPrice: 45.0,
        cost: 32.5,
        discountPercent: 5.0
      }
    ],
    approvals: [],
    auditTrail: []
  };

  // 1. DRAFT -> IN_REVIEW
  executeTransition(quote, LIFECYCLE_STATES.IN_REVIEW, { actor: DEMO_ACTORS.ESTIMATOR });
  assert.strictEqual(quote.lifecycleState, LIFECYCLE_STATES.IN_REVIEW);

  // 2. IN_REVIEW -> APPROVED (No triggers because discount 5% < 15% and margin > 15%)
  executeTransition(quote, LIFECYCLE_STATES.APPROVED, { actor: DEMO_ACTORS.COMMERCIAL_MANAGER });
  assert.strictEqual(quote.lifecycleState, LIFECYCLE_STATES.APPROVED);

  // 3. APPROVED -> READY_FOR_ERP
  executeTransition(quote, LIFECYCLE_STATES.READY_FOR_ERP, { actor: DEMO_ACTORS.COMMERCIAL_MANAGER });
  assert.strictEqual(quote.lifecycleState, LIFECYCLE_STATES.READY_FOR_ERP);

  // 4. Verification that audit trail recorded all transitions
  const statusEvents = quote.auditTrail.filter(e => e.eventType === AUDIT_EVENT_TYPES.STATUS_CHANGED);
  assert.strictEqual(statusEvents.length, 3);
  assert.strictEqual(statusEvents[0].newValue, LIFECYCLE_STATES.IN_REVIEW);
  assert.strictEqual(statusEvents[1].newValue, LIFECYCLE_STATES.APPROVED);
  assert.strictEqual(statusEvents[2].newValue, LIFECYCLE_STATES.READY_FOR_ERP);

  totalAssertions += 7;
});

console.log('\n================================================================');
console.log(`Phase 4 Test Suite Passed! Total Assertions: ${totalAssertions}`);
console.log('================================================================\n');
