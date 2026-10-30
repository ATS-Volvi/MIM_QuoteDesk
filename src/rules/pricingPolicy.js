/**
 * MIM QuoteFlow AI — Pricing Policy & Calculation Engine Configuration
 * Phase 4: Business Rules & Workflow Hardening
 * 
 * Provides centralized, configurable commercial calculation parameters.
 * Note: UAE 5% VAT and WAC cost basis are explicitly marked as provisional
 * pending formal corporate management signoff.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.MIM_PricingPolicy = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  // Default Centralized Pricing Policy Configuration
  const DEFAULT_PRICING_POLICY = {
    currency: 'AED',
    currencySymbol: 'AED',
    vatRate: 0.05, // 5.0% UAE VAT (Provisional assumption)
    vatName: 'UAE VAT (5%)',
    isVatProvisional: true,
    decimalPrecision: 2,
    minimumMarginThreshold: 15.0, // Quotes below 15% margin trigger managerial approval
    maximumDiscountThreshold: 15.0, // Discounts above 15% trigger managerial approval
    exceptionalPriceThreshold: 50000.0, // High-value lines requiring review
    costValuationBasis: 'WEIGHTED_AVERAGE_COST', // Provisional WAC basis
    isCostBasisProvisional: true,
    roundingMethod: 'HALF_UP' // Standard commercial rounding
  };

  class PricingEngine {
    constructor(config = {}) {
      this.policy = Object.assign({}, DEFAULT_PRICING_POLICY, config);
    }

    /**
     * Update runtime policy parameters
     */
    updatePolicy(newConfig = {}) {
      this.policy = Object.assign(this.policy, newConfig);
      return this.policy;
    }

    getPolicy() {
      return Object.assign({}, this.policy);
    }

    /**
     * Round number to policy decimal precision
     */
    roundMoney(val) {
      if (val === null || val === undefined || isNaN(val)) return 0;
      const factor = Math.pow(10, this.policy.decimalPrecision);
      return Math.round((Number(val) + Number.EPSILON) * factor) / factor;
    }

    /**
     * Calculate line total given quantity, unit selling price, and optional line discount %
     */
    calculateLineTotal(qty, unitPrice, discountPercent = 0) {
      const q = Math.max(1, Math.floor(Number(qty) || 1));
      const p = Math.max(0, Number(unitPrice) || 0);
      const disc = Math.min(Math.max(Number(discountPercent) || 0, 0), 100);

      const gross = q * p;
      const discountAmount = gross * (disc / 100);
      const net = Math.max(0, gross - discountAmount);

      return {
        qty: q,
        unitPrice: this.roundMoney(p),
        discountPercent: disc,
        grossTotal: this.roundMoney(gross),
        discountAmount: this.roundMoney(discountAmount),
        lineTotal: this.roundMoney(net)
      };
    }

    /**
     * Calculate comprehensive quote financial totals, tax, and margin analysis
     * @param {Array} lineItems
     * @param {Object} [headerDiscount] optional overall quote discount { percent: 0 }
     */
    calculateQuoteTotals(lineItems = [], headerDiscount = { percent: 0 }) {
      let subtotal = 0;
      let totalCost = 0;
      let totalUnits = 0;
      let totalDiscountAmount = 0;

      let hasUnknownCost = false;
      let hasPriceBelowCost = false;
      let hasUnmatchedItems = false;
      let belowCostLines = [];
      let lowMarginLines = [];
      let highDiscountLines = [];

      const processedLines = lineItems.map((item, index) => {
        const qty = Math.max(1, Math.floor(Number(item.qty) || 1));
        const unitPrice = Math.max(0, Number(item.sellingPrice) || 0);
        const discountPercent = Math.min(Math.max(Number(item.discountPercent || item.discount) || 0, 0), 100);

        const lineCalc = this.calculateLineTotal(qty, unitPrice, discountPercent);
        subtotal += lineCalc.lineTotal;
        totalUnits += qty;
        totalDiscountAmount += lineCalc.discountAmount;

        const isUnmatched = !item.erpCode;
        if (isUnmatched) hasUnmatchedItems = true;

        const isCostUnknown = item.cost === null || item.cost === undefined || isNaN(item.cost);
        let lineCost = null;
        let lineMarginAED = null;
        let lineMarginPercent = null;

        if (isCostUnknown) {
          hasUnknownCost = true;
        } else {
          const unitCost = Number(item.cost);
          lineCost = this.roundMoney(qty * unitCost);
          totalCost += lineCost;

          if (lineCalc.lineTotal < lineCost) {
            hasPriceBelowCost = true;
            belowCostLines.push({ lineIndex: index, id: item.id, description: item.description });
          }

          lineMarginAED = this.roundMoney(lineCalc.lineTotal - lineCost);
          lineMarginPercent = lineCalc.lineTotal > 0
            ? Math.round(((lineMarginAED / lineCalc.lineTotal) * 100) * 10) / 10
            : 0;

          if (lineMarginPercent < this.policy.minimumMarginThreshold) {
            lowMarginLines.push({ lineIndex: index, id: item.id, marginPercent: lineMarginPercent });
          }
        }

        if (discountPercent > this.policy.maximumDiscountThreshold) {
          highDiscountLines.push({ lineIndex: index, id: item.id, discountPercent });
        }

        return Object.assign({}, item, {
          qty,
          sellingPrice: lineCalc.unitPrice,
          discountPercent,
          discountAmount: lineCalc.discountAmount,
          lineTotal: lineCalc.lineTotal,
          lineCost,
          lineMarginPercent,
          isCostUnknown,
          isBelowCost: !isCostUnknown && lineCalc.lineTotal < lineCost
        });
      });

      // Apply optional Header-level discount
      const headerDiscPct = Math.min(Math.max(Number(headerDiscount.percent) || 0, 0), 100);
      const headerDiscountAmount = this.roundMoney(subtotal * (headerDiscPct / 100));
      const netSubtotal = this.roundMoney(Math.max(0, subtotal - headerDiscountAmount));
      totalDiscountAmount = this.roundMoney(totalDiscountAmount + headerDiscountAmount);

      subtotal = this.roundMoney(subtotal);
      netSubtotal;
      totalCost = this.roundMoney(totalCost);

      const vat = this.roundMoney(netSubtotal * this.policy.vatRate);
      const grandTotal = this.roundMoney(netSubtotal + vat);

      const grossProfit = hasUnknownCost ? null : this.roundMoney(netSubtotal - totalCost);
      const grossMargin = (hasUnknownCost || netSubtotal === 0)
        ? (hasUnknownCost ? null : 0)
        : Math.round(((grossProfit / netSubtotal) * 100) * 10) / 10;

      const isMarginBelowThreshold = !hasUnknownCost && grossMargin !== null && grossMargin < this.policy.minimumMarginThreshold;

      return {
        currency: this.policy.currency,
        currencySymbol: this.policy.currencySymbol,
        vatRate: this.policy.vatRate,
        vatName: this.policy.vatName,
        isVatProvisional: this.policy.isVatProvisional,
        costValuationBasis: this.policy.costValuationBasis,
        isCostBasisProvisional: this.policy.isCostBasisProvisional,

        totalUnits,
        subtotalBeforeHeaderDiscount: subtotal,
        headerDiscountPercent: headerDiscPct,
        headerDiscountAmount,
        subtotal: netSubtotal,
        totalDiscountAmount,
        vat,
        grandTotal,

        totalCost: hasUnknownCost ? null : totalCost,
        grossProfit,
        grossMargin,

        hasUnknownCost,
        hasPriceBelowCost,
        hasUnmatchedItems,
        isMarginBelowThreshold,
        belowCostLines,
        lowMarginLines,
        highDiscountLines,
        lines: processedLines
      };
    }
  }

  return {
    DEFAULT_PRICING_POLICY,
    PricingEngine,
    defaultPricingEngine: new PricingEngine()
  };
});
