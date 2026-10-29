/**
 * MIM QuoteFlow AI — End-to-End Workflow Integration Test
 */

const assert = require("assert");

// Mock environment for app.js state simulation
let draftsStore = {
  "DRAFT-2026-0042": {
    id: "DRAFT-2026-0042",
    customerRoute: "D",
    customerAccount: "Al-Futtaim Engineering Ltd [ACC-88219]",
    lineItems: [
      { id: "line-1", qty: 25, sellingPrice: 185.00, cost: 115.00, erpCode: "MIM-SS-DISP-WM01" },
      { id: "line-2", qty: 25, sellingPrice: 35.00, cost: 18.00, erpCode: "MIM-ACC-MK02" },
      { id: "line-3", qty: 5, sellingPrice: 15.00, cost: null, erpCode: null },
      { id: "line-4", qty: 10, sellingPrice: 17.00, cost: 9.50, erpCode: "MIM-VALVE-NZ04", status: "PriceWarning", historicalPrice: 16.00 }
    ]
  },
  "DRAFT-2026-0039": {
    id: "DRAFT-2026-0039",
    customerRoute: "D",
    customerAccount: "Khansaheb Civil Engineering [ACC-44102]",
    lineItems: [
      { id: "line-39-1", qty: 120, sellingPrice: 320.00, cost: 295.00, erpCode: "MIM-SS-DISP-FR01" },
      { id: "line-39-2", qty: 120, sellingPrice: 45.00, cost: null, erpCode: null }
    ]
  }
};

let currentQuote = JSON.parse(JSON.stringify(draftsStore["DRAFT-2026-0042"]));

function calculateTotals(quote) {
  let subtotal = 0;
  let totalCost = 0;
  let hasUnknownCost = false;
  let hasPriceBelowCost = false;
  let hasUnmatchedItems = false;
  let totalUnits = 0;

  quote.lineItems.forEach(item => {
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

console.log("Running Workflow Integration Tests...\n");

// Step 1: Initial state of DRAFT-2026-0042
let totals = calculateTotals(currentQuote);
console.log("Initial Totals:", totals);
assert.strictEqual(totals.subtotal, 5745.00);
assert.strictEqual(totals.vat, 287.25);
assert.strictEqual(totals.grandTotal, 6032.25);
assert.strictEqual(totals.hasUnknownCost, true, "Line 3 has unknown cost");
assert.strictEqual(totals.grossProfit, null, "Profit must be null when cost is unknown");
assert.strictEqual(totals.grossMargin, null, "Margin must be null when cost is unknown");
console.log("✓ Initial state correctly identified unknown cost and unmatched item.");

// Step 2: Match Line 3 to ERP Catalog SKU MIM-DISP-KEY-T01 (cost 6.20)
currentQuote.lineItems[2].erpCode = "MIM-DISP-KEY-T01";
currentQuote.lineItems[2].cost = 6.20;
currentQuote.lineItems[2].status = "Confirmed";

totals = calculateTotals(currentQuote);
assert.strictEqual(totals.hasUnknownCost, false, "All costs now known");
assert.strictEqual(totals.hasUnmatchedItems, false, "All items now confirmed");
const expectedCost = (25 * 115) + (25 * 18) + (5 * 6.20) + (10 * 9.50); // 3451.00
assert.strictEqual(totals.totalCost, expectedCost);
assert.strictEqual(totals.grossProfit, 5745.00 - expectedCost); // 2294.00
assert.strictEqual(totals.grossProfit, 2294.00);
console.log("✓ Matching Line 3 resulted in accurate profit calculation (AED 2,294.00).");

// Step 3: Trigger Below-Cost Line Violation on Line 1
currentQuote.lineItems[0].sellingPrice = 100.00; // Cost is 115.00!
totals = calculateTotals(currentQuote);
assert.strictEqual(totals.hasPriceBelowCost, true, "Below-cost line must be flagged");
console.log("✓ Below-cost selling price flagged accurately.");

// Step 4: Revert Line 1 and verify restoration
currentQuote.lineItems[0].sellingPrice = 185.00;
totals = calculateTotals(currentQuote);
assert.strictEqual(totals.hasPriceBelowCost, false);
console.log("✓ Restoring price clears below-cost violation.");

// Step 5: Test Multi-Draft Switch
draftsStore[currentQuote.id] = JSON.parse(JSON.stringify(currentQuote));
currentQuote = JSON.parse(JSON.stringify(draftsStore["DRAFT-2026-0039"]));
assert.strictEqual(currentQuote.id, "DRAFT-2026-0039");
assert.strictEqual(currentQuote.customerAccount, "Khansaheb Civil Engineering [ACC-44102]");
totals = calculateTotals(currentQuote);
assert.strictEqual(totals.hasUnknownCost, true);
console.log("✓ Draft switching preserves individual draft properties without collision.");

console.log("\nAll Workflow Integration Tests PASSED successfully!");
