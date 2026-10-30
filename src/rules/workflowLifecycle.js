/**
 * MIM QuoteFlow AI — Workflow Lifecycle, Approval Framework & Audit Trail
 * Phase 4: Business Rules & Workflow Hardening
 * 
 * Implements:
 * 1. Explicit Quotation Lifecycle States & Transition Validator
 * 2. Configurable Commercial Approval Framework (Triggers & Actions)
 * 3. Append-Only Structured Audit Trail
 * 
 * Security Boundary: Strictly enforces that ERP_CONFIRMED cannot be reached
 * in mock mode (MOCK_DEMO_DATA).
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    // Node.js CommonJS
    const pricingPolicyModule = require('./pricingPolicy.js');
    module.exports = factory(pricingPolicyModule);
  } else {
    // Browser Global
    root.MIM_WorkflowLifecycle = factory(root.MIM_PricingPolicy);
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function (pricingPolicyModule) {
  'use strict';

  const PricingEngine = (pricingPolicyModule && pricingPolicyModule.PricingEngine)
    ? pricingPolicyModule.PricingEngine
    : null;

  // --------------------------------------------------------------------------
  // 1. Explicit Quotation Lifecycle States
  // --------------------------------------------------------------------------
  const LIFECYCLE_STATES = {
    DRAFT: 'DRAFT',
    IN_REVIEW: 'IN_REVIEW',
    CHANGES_REQUESTED: 'CHANGES_REQUESTED',
    APPROVED: 'APPROVED',
    READY_FOR_ERP: 'READY_FOR_ERP',
    ERP_CONFIRMED: 'ERP_CONFIRMED' // Reserved for future verified ERP live implementation
  };

  const STATE_DESCRIPTIONS = {
    DRAFT: 'Quotation is actively being drafted by estimator; fully editable.',
    IN_REVIEW: 'Submitted for managerial review or approval due to commercial policy triggers.',
    CHANGES_REQUESTED: 'Approver requested changes or price adjustments before approval.',
    APPROVED: 'Commercial parameters, margins, and customer status approved for preparation.',
    READY_FOR_ERP: 'Passed pre-flight validation; formatted and queued for ERP entry.',
    ERP_CONFIRMED: 'Officially written to live ERP database (Strictly disabled in Mock mode).'
  };

  // State Transition Graph (Valid Allowed Transitions)
  const VALID_TRANSITIONS = {
    DRAFT: ['DRAFT', 'IN_REVIEW', 'APPROVED'],
    IN_REVIEW: ['APPROVED', 'CHANGES_REQUESTED', 'DRAFT'],
    CHANGES_REQUESTED: ['DRAFT', 'IN_REVIEW'],
    APPROVED: ['READY_FOR_ERP', 'DRAFT', 'IN_REVIEW'],
    READY_FOR_ERP: ['DRAFT', 'APPROVED'], // ERP_CONFIRMED is guarded and blocked in mock mode
    ERP_CONFIRMED: []
  };

  // --------------------------------------------------------------------------
  // 2. Demo Actors (Clearly labeled non-production identities)
  // --------------------------------------------------------------------------
  const DEMO_ACTORS = {
    ESTIMATOR: {
      id: 'DEMO_SALES_ESTIMATOR',
      name: 'Salim Al-Ketbi (Demo Estimator)',
      role: 'Sales Estimator',
      isDemo: true
    },
    COMMERCIAL_MANAGER: {
      id: 'DEMO_COMMERCIAL_MANAGER',
      name: 'Rashid Mansoori (Demo Commercial Manager)',
      role: 'Commercial Approver',
      isDemo: true
    },
    FINANCE_MANAGER: {
      id: 'DEMO_FINANCE_MANAGER',
      name: 'Fatima Al-Nuaimi (Demo Credit Controller)',
      role: 'Finance Approver',
      isDemo: true
    }
  };

  // --------------------------------------------------------------------------
  // 3. Approval Trigger Types & Decisions
  // --------------------------------------------------------------------------
  const APPROVAL_TRIGGERS = {
    HIGH_DISCOUNT: 'HIGH_DISCOUNT',
    LOW_MARGIN: 'LOW_MARGIN',
    BELOW_COST_PRICE: 'BELOW_COST_PRICE',
    CREDIT_HOLD_CUSTOMER: 'CREDIT_HOLD_CUSTOMER',
    EXCEPTIONAL_PRICE: 'EXCEPTIONAL_PRICE',
    MANUAL_OVERRIDE: 'MANUAL_OVERRIDE'
  };

  const APPROVAL_DECISIONS = {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    CHANGES_REQUESTED: 'CHANGES_REQUESTED'
  };

  // --------------------------------------------------------------------------
  // 4. Audit Trail Event Types
  // --------------------------------------------------------------------------
  const AUDIT_EVENT_TYPES = {
    QUOTATION_CREATED: 'QUOTATION_CREATED',
    STATUS_CHANGED: 'STATUS_CHANGED',
    CUSTOMER_SELECTED: 'CUSTOMER_SELECTED',
    RECIPIENT_MODIFIED: 'RECIPIENT_MODIFIED',
    PRODUCT_ADDED: 'PRODUCT_ADDED',
    PRODUCT_REMOVED: 'PRODUCT_REMOVED',
    PRODUCT_CHANGED: 'PRODUCT_CHANGED',
    QUANTITY_CHANGED: 'QUANTITY_CHANGED',
    SELLING_PRICE_CHANGED: 'SELLING_PRICE_CHANGED',
    DISCOUNT_CHANGED: 'DISCOUNT_CHANGED',
    COST_REFRESHED: 'COST_REFRESHED',
    VALIDATION_WARNING_TRIGGERED: 'VALIDATION_WARNING_TRIGGERED',
    APPROVAL_REQUESTED: 'APPROVAL_REQUESTED',
    APPROVAL_DECISION: 'APPROVAL_DECISION',
    ERP_PREFLIGHT_CHECK: 'ERP_PREFLIGHT_CHECK'
  };

  /**
   * Helper to generate structured Audit Event
   */
  function createAuditEvent({ quotationId, eventType, actor, previousValue = null, newValue = null, reason = null }) {
    const timestamp = new Date().toISOString();
    const eventId = 'AUD-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    return {
      eventId,
      quotationId: quotationId || 'UNSAVED_DRAFT',
      eventType,
      timestamp,
      actor: typeof actor === 'object' && actor ? actor.name || actor.id : (actor || 'System / Estimator'),
      actorRole: typeof actor === 'object' && actor ? actor.role || 'User' : 'User',
      previousValue,
      newValue,
      reason,
      isLocalDraftLog: true // Explicit note that this is client/workspace session audit
    };
  }

  /**
   * Append audit event to a quote immutably or by reference safely
   */
  function recordAuditEvent(quote, eventData) {
    if (!quote) return;
    if (!Array.isArray(quote.auditTrail)) {
      quote.auditTrail = [];
    }
    const event = createAuditEvent(Object.assign({ quotationId: quote.id || quote.quotationNumber }, eventData));
    quote.auditTrail.push(event);
    return event;
  }

  // --------------------------------------------------------------------------
  // 5. Approval Framework Engine
  // --------------------------------------------------------------------------

  /**
   * Detect required approval triggers based on current quote state and pricing policy
   */
  function detectApprovalTriggers(quote, pricingPolicy = {}) {
    const triggers = [];
    if (!quote) return triggers;

    const lines = Array.isArray(quote.items) ? quote.items : [];
    const minMarginThreshold = pricingPolicy.minimumMarginThreshold !== undefined ? pricingPolicy.minimumMarginThreshold : 15.0;
    const maxDiscountThreshold = pricingPolicy.maximumDiscountThreshold !== undefined ? pricingPolicy.maximumDiscountThreshold : 15.0;
    const exceptionalThreshold = pricingPolicy.exceptionalPriceThreshold !== undefined ? pricingPolicy.exceptionalPriceThreshold : 50000.0;

    // 1. Credit Hold Trigger
    if (quote.customerStatus === 'CREDIT_HOLD' || (quote.customer && quote.customer.status === 'CREDIT_HOLD')) {
      triggers.push({
        triggerType: APPROVAL_TRIGGERS.CREDIT_HOLD_CUSTOMER,
        reason: 'Customer account is currently on CREDIT_HOLD status. Requires Credit Controller review.',
        assignedApprover: DEMO_ACTORS.FINANCE_MANAGER,
        threshold: 'CREDIT_HOLD',
        proposedValue: quote.customerName || (quote.customer && quote.customer.name) || 'Unknown Customer'
      });
    }

    // 2. High Header Discount Trigger
    const headerDisc = Number(quote.headerDiscountPercent) || 0;
    if (headerDisc > 10.0) {
      triggers.push({
        triggerType: APPROVAL_TRIGGERS.HIGH_DISCOUNT,
        reason: `Overall quote discount of ${headerDisc}% exceeds maximum non-approval threshold (10.0%).`,
        assignedApprover: DEMO_ACTORS.COMMERCIAL_MANAGER,
        threshold: 10.0,
        proposedValue: `${headerDisc}%`
      });
    }

    // Line-level checks
    lines.forEach((item, idx) => {
      const lineNo = idx + 1;
      const unitPrice = Number(item.sellingPrice) || 0;
      const qty = Number(item.qty) || 1;
      const disc = Number(item.discountPercent || item.discount) || 0;
      const cost = item.cost !== null && item.cost !== undefined ? Number(item.cost) : null;
      const lineNet = (qty * unitPrice) * (1 - disc / 100);

      // 3. High Line Discount
      if (disc > maxDiscountThreshold) {
        triggers.push({
          triggerType: APPROVAL_TRIGGERS.HIGH_DISCOUNT,
          lineId: item.id || `line-${lineNo}`,
          lineIndex: idx,
          reason: `Line ${lineNo} (${item.erpCode || item.description}) discount of ${disc}% exceeds threshold of ${maxDiscountThreshold}%.`,
          assignedApprover: DEMO_ACTORS.COMMERCIAL_MANAGER,
          threshold: maxDiscountThreshold,
          proposedValue: `${disc}%`
        });
      }

      // 4. Below-cost price
      if (cost !== null && unitPrice < cost) {
        triggers.push({
          triggerType: APPROVAL_TRIGGERS.BELOW_COST_PRICE,
          lineId: item.id || `line-${lineNo}`,
          lineIndex: idx,
          reason: `Line ${lineNo} (${item.erpCode || item.description}) unit selling price (AED ${unitPrice}) is BELOW catalog cost (AED ${cost}).`,
          assignedApprover: DEMO_ACTORS.COMMERCIAL_MANAGER,
          threshold: cost,
          proposedValue: `AED ${unitPrice}`
        });
      }

      // 5. Exceptional Line Total
      if (lineNet >= exceptionalThreshold) {
        triggers.push({
          triggerType: APPROVAL_TRIGGERS.EXCEPTIONAL_PRICE,
          lineId: item.id || `line-${lineNo}`,
          lineIndex: idx,
          reason: `Line ${lineNo} total of AED ${lineNet.toFixed(2)} exceeds high-value threshold (AED ${exceptionalThreshold}).`,
          assignedApprover: DEMO_ACTORS.COMMERCIAL_MANAGER,
          threshold: exceptionalThreshold,
          proposedValue: `AED ${lineNet.toFixed(2)}`
        });
      }
    });

    // 6. Overall Quote Margin Below Threshold
    if (quote.financials && quote.financials.grossMargin !== null && quote.financials.grossMargin !== undefined) {
      if (quote.financials.grossMargin < minMarginThreshold && quote.financials.subtotal > 0) {
        triggers.push({
          triggerType: APPROVAL_TRIGGERS.LOW_MARGIN,
          reason: `Overall quote margin of ${quote.financials.grossMargin}% is BELOW minimum policy threshold of ${minMarginThreshold}%.`,
          assignedApprover: DEMO_ACTORS.COMMERCIAL_MANAGER,
          threshold: minMarginThreshold,
          proposedValue: `${quote.financials.grossMargin}%`
        });
      }
    }

    return triggers;
  }

  /**
   * Synchronize quote approvals array with active triggers
   */
  function syncQuoteApprovals(quote, pricingPolicy = {}) {
    if (!quote) return [];
    if (!Array.isArray(quote.approvals)) {
      quote.approvals = [];
    }

    const activeTriggers = detectApprovalTriggers(quote, pricingPolicy);

    activeTriggers.forEach(trigger => {
      // Check if an existing approval matches this trigger and line
      const existing = quote.approvals.find(a => 
        a.triggerType === trigger.triggerType &&
        (a.lineId === trigger.lineId || (!a.lineId && !trigger.lineId))
      );

      if (!existing) {
        const approvalRecord = {
          approvalId: 'APP-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(Math.random() * 1000).toString(),
          triggerType: trigger.triggerType,
          lineId: trigger.lineId || null,
          lineIndex: trigger.lineIndex !== undefined ? trigger.lineIndex : null,
          reason: trigger.reason,
          requestedBy: DEMO_ACTORS.ESTIMATOR.name,
          assignedApprover: trigger.assignedApprover ? trigger.assignedApprover.name : DEMO_ACTORS.COMMERCIAL_MANAGER.name,
          approverRole: trigger.assignedApprover ? trigger.assignedApprover.role : DEMO_ACTORS.COMMERCIAL_MANAGER.role,
          threshold: trigger.threshold,
          proposedValue: trigger.proposedValue,
          decision: APPROVAL_DECISIONS.PENDING,
          decisionTimestamp: null,
          decisionBy: null,
          approvalComments: null
        };
        quote.approvals.push(approvalRecord);
        recordAuditEvent(quote, {
          eventType: AUDIT_EVENT_TYPES.APPROVAL_REQUESTED,
          actor: DEMO_ACTORS.ESTIMATOR,
          newValue: approvalRecord.triggerType,
          reason: approvalRecord.reason
        });
      } else if (existing.decision === APPROVAL_DECISIONS.PENDING) {
        // Update proposed value and reason if changed while pending
        existing.proposedValue = trigger.proposedValue;
        existing.reason = trigger.reason;
      }
    });

    return quote.approvals;
  }

  /**
   * Apply an approval decision (Approve, Reject, Request Changes)
   */
  function applyApprovalDecision(quote, approvalId, decision, approver, comments = '') {
    if (!quote || !Array.isArray(quote.approvals)) {
      throw new Error('Quote or approvals list not found');
    }

    const approval = quote.approvals.find(a => a.approvalId === approvalId);
    if (!approval) {
      throw new Error(`Approval record ${approvalId} not found`);
    }

    const validDecisions = [APPROVAL_DECISIONS.APPROVED, APPROVAL_DECISIONS.REJECTED, APPROVAL_DECISIONS.CHANGES_REQUESTED];
    if (!validDecisions.includes(decision)) {
      throw new Error(`Invalid approval decision: ${decision}`);
    }

    const previousDecision = approval.decision;
    approval.decision = decision;
    approval.decisionTimestamp = new Date().toISOString();
    approval.decisionBy = approver && typeof approver === 'object' ? approver.name : (approver || DEMO_ACTORS.COMMERCIAL_MANAGER.name);
    approval.approvalComments = comments || '';

    recordAuditEvent(quote, {
      eventType: AUDIT_EVENT_TYPES.APPROVAL_DECISION,
      actor: approver || DEMO_ACTORS.COMMERCIAL_MANAGER,
      previousValue: previousDecision,
      newValue: decision,
      reason: comments ? `${approval.reason} -> Decision: ${decision}. Note: ${comments}` : `${approval.reason} -> Decision: ${decision}`
    });

    return approval;
  }

  // --------------------------------------------------------------------------
  // 6. Central Transition Validator
  // --------------------------------------------------------------------------

  /**
   * Validates whether a quotation can legally transition from its current state to a target state.
   * Enforces all business rules, product confirmations, pricing checks, approval requirements,
   * customer routing rules, and mock security boundaries.
   * 
   * @param {Object} quote - Quotation draft object
   * @param {string} targetState - Destination state from LIFECYCLE_STATES
   * @param {Object} options - Options including isMockMode, pricingPolicy, userContext
   * @returns {Object} { allowed: boolean, errors: string[], warnings: string[], requiredApprovals: Array }
   */
  function validateTransition(quote, targetState, options = {}) {
    const errors = [];
    const warnings = [];
    const requiredApprovals = [];

    const currentState = (quote && quote.lifecycleState) || LIFECYCLE_STATES.DRAFT;
    const isMockMode = options.isMockMode !== undefined ? options.isMockMode : true;
    const policy = options.pricingPolicy || {};

    // 1. Target State Validity
    if (!Object.values(LIFECYCLE_STATES).includes(targetState)) {
      return {
        allowed: false,
        currentState,
        targetState,
        errors: [`Invalid target lifecycle state: '${targetState}'. Valid states: ${Object.values(LIFECYCLE_STATES).join(', ')}`],
        warnings,
        requiredApprovals
      };
    }

    // 2. Strict Mock Security Boundary: ERP_CONFIRMED is NEVER reachable in mock mode
    if (targetState === LIFECYCLE_STATES.ERP_CONFIRMED) {
      return {
        allowed: false,
        currentState,
        targetState,
        errors: [
          'ERR_ERP_CONFIRMATION_NOT_PERMITTED_IN_MOCK: Official ERP confirmation (ERP_CONFIRMED) cannot be executed in mock mode. Live ERP write operations are strictly disabled.'
        ],
        warnings,
        requiredApprovals
      };
    }

    // 3. State Transition Graph Validation
    const allowedTargets = VALID_TRANSITIONS[currentState] || [];
    if (currentState !== targetState && !allowedTargets.includes(targetState)) {
      errors.push(`Illegal state transition from '${currentState}' to '${targetState}'. Permitted transitions: [${allowedTargets.join(', ')}]`);
    }

    // If staying in DRAFT or returning to DRAFT, allow with warnings if any
    if (targetState === LIFECYCLE_STATES.DRAFT) {
      return {
        allowed: errors.length === 0,
        currentState,
        targetState,
        errors,
        warnings,
        requiredApprovals
      };
    }

    // 4. Required Field Checks for IN_REVIEW, APPROVED, and READY_FOR_ERP
    const customerName = quote.customerName || (quote.customer && quote.customer.name);
    if (!customerName || customerName.trim() === '') {
      errors.push('Customer legal entity name is required.');
    }

    // Customer routing check
    const isDebtors = quote.recipientType === 'DEBTORS' || (quote.customer && quote.customer.accountCode);
    const isGeneralLedger = quote.recipientType === 'GENERAL_LEDGER';
    if (!isDebtors && !isGeneralLedger) {
      warnings.push('Customer routing ledger (Debtors Ledger vs General Ledger) has not been explicitly confirmed.');
    }

    // Lines validation
    const items = Array.isArray(quote.items) ? quote.items : [];
    if (items.length === 0) {
      errors.push('Quotation must contain at least one line item.');
    }

    // Line Item Inspections
    let hasUnmatchedItems = false;
    let hasMissingCost = false;
    let hasZeroPrice = false;

    items.forEach((item, idx) => {
      const lineNo = idx + 1;
      if (!item.erpCode) {
        hasUnmatchedItems = true;
        errors.push(`Line ${lineNo} (${item.description || 'Item'}) is unconfirmed: must be mapped to an exact ERP product code.`);
      }

      if (item.cost === null || item.cost === undefined || isNaN(item.cost)) {
        hasMissingCost = true;
        if (targetState === LIFECYCLE_STATES.APPROVED || targetState === LIFECYCLE_STATES.READY_FOR_ERP) {
          errors.push(`Line ${lineNo} (${item.erpCode || item.description}) has unknown cost. Cost must be confirmed before approval.`);
        } else {
          warnings.push(`Line ${lineNo} has missing cost. Costing must be resolved before final approval.`);
        }
      }

      const price = Number(item.sellingPrice) || 0;
      if (price <= 0) {
        hasZeroPrice = true;
        errors.push(`Line ${lineNo} (${item.erpCode || item.description}) has zero or negative selling price.`);
      }
    });

    // 5. Commercial Approvals Check (Required for APPROVED and READY_FOR_ERP)
    if (targetState === LIFECYCLE_STATES.APPROVED || targetState === LIFECYCLE_STATES.READY_FOR_ERP) {
      // Evaluate active approval triggers
      const activeTriggers = detectApprovalTriggers(quote, policy);
      const approvals = Array.isArray(quote.approvals) ? quote.approvals : [];

      activeTriggers.forEach(trigger => {
        const matchingApproval = approvals.find(a => 
          a.triggerType === trigger.triggerType &&
          (a.lineId === trigger.lineId || (!a.lineId && !trigger.lineId))
        );

        if (!matchingApproval) {
          errors.push(`Unresolved commercial trigger: ${trigger.reason}`);
          requiredApprovals.push(trigger);
        } else if (matchingApproval.decision !== APPROVAL_DECISIONS.APPROVED) {
          errors.push(`Approval required: ${trigger.reason} (Current status: ${matchingApproval.decision})`);
          requiredApprovals.push(trigger);
        }
      });
    }

    // 6. Specific Requirements for READY_FOR_ERP
    if (targetState === LIFECYCLE_STATES.READY_FOR_ERP) {
      if (currentState !== LIFECYCLE_STATES.APPROVED) {
        errors.push("Quotation must be in 'APPROVED' state before advancing to 'READY_FOR_ERP'.");
      }
      if (hasUnmatchedItems) {
        errors.push('All product codes must be verified against ERP catalog before ERP staging.');
      }
      if (hasMissingCost) {
        errors.push('All line items must have verified cost valuation before ERP staging.');
      }
    }

    return {
      allowed: errors.length === 0,
      currentState,
      targetState,
      errors,
      warnings,
      requiredApprovals
    };
  }

  /**
   * Safely execute a quotation lifecycle transition through the central validator
   */
  function executeTransition(quote, targetState, options = {}) {
    const validation = validateTransition(quote, targetState, options);
    if (!validation.allowed) {
      const err = new Error(`Cannot transition quotation to ${targetState}: ${validation.errors.join('; ')}`);
      err.validation = validation;
      throw err;
    }

    const previousState = quote.lifecycleState || LIFECYCLE_STATES.DRAFT;
    quote.lifecycleState = targetState;

    recordAuditEvent(quote, {
      eventType: AUDIT_EVENT_TYPES.STATUS_CHANGED,
      actor: options.actor || DEMO_ACTORS.ESTIMATOR,
      previousValue: previousState,
      newValue: targetState,
      reason: options.reason || `Transitioned status from ${previousState} to ${targetState}`
    });

    return {
      success: true,
      previousState,
      newState: targetState,
      quote
    };
  }

  return {
    LIFECYCLE_STATES,
    STATE_DESCRIPTIONS,
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
  };
});
