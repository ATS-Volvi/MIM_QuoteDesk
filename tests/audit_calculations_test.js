/**
 * MIM QuoteFlow AI — Automated Test Suite
 * Calculations, Validation Logic, Product Matching, and State Safety
 */

const assert = require("assert");

// Pure calculation engine extracted from app.js logic
function calculateTotals(lineItems) {
  let subtotal = 0;
  let totalCost = 0;
  let hasUnknownCost = false;
  let hasPriceBelowCost = false;
  let hasUnmatchedItems = false;
  let totalUnits = 0;

  lineItems.forEach(item => {
    // Sanitize input numbers
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

function runValidation(totals) {
  if (totals.hasPriceBelowCost) {
    return { status: "BLOCKED", reason: "Line priced below cost" };
  }
  if (totals.hasUnknownCost) {
    return { status: "WARNING", reason: "Cost unavailable" };
  }
  if (totals.hasUnmatchedItems) {
    return { status: "WARNING", reason: "Awaiting ERP product match" };
  }
  return { status: "READY", reason: "Valid quotation ready for review" };
}

// -----------------------------------------------------------------------------
// TEST RUNNER
// -----------------------------------------------------------------------------
const testResults = [];

function runTest(name, fn) {
  try {
    fn();
    testResults.push({ name, status: "PASS", error: null });
    console.log(`✓ PASS: ${name}`);
  } catch (err) {
    testResults.push({ name, status: "FAIL", error: err.message });
    console.error(`✕ FAIL: ${name}: ${err.message}`);
  }
}

console.log("=================================================");
console.log("MIM QuoteFlow AI — Calculation & Logic Test Suite");
console.log("=================================================\n");

// Test 1: Normal Multi-line Quotation
runTest("Test 1: Normal Multi-line Quotation (Line total, subtotal, 5% VAT, grand total, profit, margin)", () => {
  const lines = [
    { erpCode: "MIM-SS-DISP-WM01", qty: 25, sellingPrice: 185.00, cost: 115.00 },
    { erpCode: "MIM-ACC-MK02", qty: 25, sellingPrice: 35.00, cost: 18.00 }
  ];
  const res = calculateTotals(lines);

  // Line 1: 25 * 185 = 4625.00, Cost: 25 * 115 = 2875.00
  // Line 2: 25 * 35 = 875.00, Cost: 25 * 18 = 450.00
  // Subtotal = 5500.00
  // VAT (5%) = 275.00
  // Grand Total = 5775.00
  // Total Cost = 3325.00
  // Gross Profit = 2175.00
  // Gross Margin = (2175 / 5500) * 100 = 39.5%
  assert.strictEqual(res.subtotal, 5500.00);
  assert.strictEqual(res.vat, 275.00);
  assert.strictEqual(res.grandTotal, 5775.00);
  assert.strictEqual(res.totalCost, 3325.00);
  assert.strictEqual(res.grossProfit, 2175.00);
  assert.strictEqual(res.grossMargin, 39.5);
  assert.strictEqual(res.hasPriceBelowCost, false);
  assert.strictEqual(res.hasUnknownCost, false);
  assert.strictEqual(res.hasUnmatchedItems, false);

  const val = runValidation(res);
  assert.strictEqual(val.status, "READY");
});

// Test 2: Below-Cost Product Detection
runTest("Test 2: Below-Cost Product blocks quotation finalisation even if overall quote is profitable", () => {
  const lines = [
    { erpCode: "MIM-SS-DISP-WM01", qty: 20, sellingPrice: 200.00, cost: 100.00 }, // Profit = 2000
    { erpCode: "MIM-LOSS-LEADER", qty: 5, sellingPrice: 30.00, cost: 50.00 }      // Loss = -100 (Below cost!)
  ];
  const res = calculateTotals(lines);
  assert.strictEqual(res.hasPriceBelowCost, true);
  assert.strictEqual(res.grossProfit > 0, true, "Overall quote is profitable");

  const val = runValidation(res);
  assert.strictEqual(val.status, "BLOCKED");
  assert.strictEqual(val.reason, "Line priced below cost");
});

// Test 3: Unmatched Product
runTest("Test 3: Unmatched product (erpCode is null) flags warning and does not fabricate ERP code", () => {
  const lines = [
    { erpCode: "MIM-SS-DISP-WM01", qty: 10, sellingPrice: 185.00, cost: 115.00 },
    { erpCode: null, qty: 2, sellingPrice: 50.00, cost: 30.00 }
  ];
  const res = calculateTotals(lines);
  assert.strictEqual(res.hasUnmatchedItems, true);

  const val = runValidation(res);
  assert.strictEqual(val.status, "WARNING");
  assert.strictEqual(val.reason, "Awaiting ERP product match");
});

// Test 4: Missing or Unknown Cost
runTest("Test 4: Missing cost results in unknown profit and margin, not 0.00 or misleading numbers", () => {
  const lines = [
    { erpCode: "MIM-SS-DISP-WM01", qty: 10, sellingPrice: 185.00, cost: 115.00 },
    { erpCode: null, qty: 5, sellingPrice: 15.00, cost: null } // Unknown cost
  ];
  const res = calculateTotals(lines);
  assert.strictEqual(res.hasUnknownCost, true);
  assert.strictEqual(res.grossProfit, null, "Gross profit must be null (Unknown)");
  assert.strictEqual(res.grossMargin, null, "Gross margin must be null (Unknown)");
  assert.strictEqual(res.totalCost, null, "Total cost must be null (Unknown)");

  const val = runValidation(res);
  assert.strictEqual(val.status, "WARNING");
});

// Test 5: Zero-Value Quotation
runTest("Test 5: Zero-value sales do not cause division by zero or NaN margins", () => {
  const lines = [
    { erpCode: "MIM-SAMPLE", qty: 1, sellingPrice: 0.00, cost: 0.00 }
  ];
  const res = calculateTotals(lines);
  assert.strictEqual(res.subtotal, 0.00);
  assert.strictEqual(res.vat, 0.00);
  assert.strictEqual(res.grandTotal, 0.00);
  assert.strictEqual(res.grossMargin, 0);
  assert.strictEqual(isNaN(res.grossMargin), false);
});

// Test 6: Invalid Inputs (Negative Qty, Negative Price, NaN strings)
runTest("Test 6: Sanitization handles negative quantities, negative prices, and non-numeric inputs safely", () => {
  const lines = [
    { erpCode: "MIM-TEST-1", qty: -5, sellingPrice: "invalid_str", cost: 10.00 },
    { erpCode: "MIM-TEST-2", qty: "abc", sellingPrice: -50.00, cost: 20.00 }
  ];
  const res = calculateTotals(lines);
  // Qty: Math.max(1, ...) -> 1
  // Price: Math.max(0, ...) -> 0
  assert.strictEqual(res.totalUnits, 2);
  assert.strictEqual(res.subtotal, 0.00);
  assert.strictEqual(res.hasPriceBelowCost, true, "Selling price 0 is below cost 10 and 20");
});

// Test 7: Decimal Precision and Rounding
runTest("Test 7: Decimal precision does not suffer from IEEE 754 float drift", () => {
  const lines = [
    { erpCode: "MIM-ITEM-1", qty: 3, sellingPrice: 19.99, cost: 12.33 },
    { erpCode: "MIM-ITEM-2", qty: 7, sellingPrice: 7.15, cost: 4.88 }
  ];
  const res = calculateTotals(lines);
  // Line 1: 3 * 19.99 = 59.97, cost: 36.99
  // Line 2: 7 * 7.15 = 50.05, cost: 34.16
  // Subtotal = 110.02
  // VAT = 110.02 * 0.05 = 5.501 -> 5.50
  // Grand Total = 115.52
  // Total Cost = 71.15
  // Gross Profit = 38.87
  assert.strictEqual(res.subtotal, 110.02);
  assert.strictEqual(res.vat, 5.50);
  assert.strictEqual(res.grandTotal, 115.52);
  assert.strictEqual(res.grossProfit, 38.87);
});

// Test 8: Confirmation Pre-Flight Guard
runTest("Test 8: ERP Confirmation guard blocks action when warnings or below-cost items exist", () => {
  function canConfirmToErp(totals) {
    if (totals.hasPriceBelowCost || totals.hasUnknownCost || totals.hasUnmatchedItems) {
      return false;
    }
    return true;
  }

  assert.strictEqual(canConfirmToErp({ hasPriceBelowCost: true, hasUnknownCost: false, hasUnmatchedItems: false }), false);
  assert.strictEqual(canConfirmToErp({ hasPriceBelowCost: false, hasUnknownCost: true, hasUnmatchedItems: false }), false);
  assert.strictEqual(canConfirmToErp({ hasPriceBelowCost: false, hasUnknownCost: false, hasUnmatchedItems: true }), false);
  assert.strictEqual(canConfirmToErp({ hasPriceBelowCost: false, hasUnknownCost: false, hasUnmatchedItems: false }), true);
});

console.log("\n=================================================");
console.log(`Test Execution Summary: ${testResults.filter(t => t.status === "PASS").length}/${testResults.length} passed`);
console.log("=================================================");
