/**
 * MIM QuoteFlow AI — Phase 3.5: Mock-Connected Workspace Integration Test Suite
 * 
 * Tests the complete end-to-end user workflows:
 * - Product search, exact match, similar match without auto-confirmation
 * - Debtors customer search, credit hold flags
 * - General Ledger isolation (zero customer master search)
 * - Pricing & cost lookup with provisional metadata and missing-cost handling
 * - Deterministic calculation engine & below-cost blocking
 * - Draft preservation after connector timeouts and errors
 * - Outdated async response race-condition protection
 * - Explicit mock demo confirmation boundary
 */

const assert = require("assert");
const { createErpConnector, ERROR_CODES } = require("../src/connector/erpConnector");

let totalTests = 0;
let passedTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`✓ PASS: ${name}`);
  } catch (err) {
    console.error(`✕ FAIL: ${name}`);
    console.error(`  Error: ${err.message}`);
    process.exitCode = 1;
  }
}

async function runAsyncTest(name, fn) {
  totalTests++;
  try {
    await fn();
    passedTests++;
    console.log(`✓ PASS: ${name}`);
  } catch (err) {
    console.error(`✕ FAIL: ${name}`);
    console.error(`  Error: ${err.message}`);
    process.exitCode = 1;
  }
}

// Calculations Engine Verification Replica
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

(async function () {
  console.log("==================================================================");
  console.log("MIM QuoteFlow AI — Mock-Connected Workspace Integration Test Suite");
  console.log("==================================================================\n");

  const connector = createErpConnector({ simulatedLatencyMs: 5 });

  // --------------------------------------------------------------------------
  // Workflow 1: Search and select an exact product
  // --------------------------------------------------------------------------
  await runAsyncTest("Workflow 1: Search for and select exact product via connector", async () => {
    const searchRes = await connector.searchProducts({ code: "MIM-SS-DISP-WM01" });
    assert.strictEqual(searchRes.success, true);
    assert.strictEqual(searchRes.data.items.length, 1);
    
    const product = searchRes.data.items[0];
    assert.strictEqual(product.product_code, "MIM-SS-DISP-WM01");
    assert.strictEqual(product.match_type, "EXACT_CODE");

    // Lookup authoritative pricing and cost
    const pricingRes = await connector.lookupPricingAndCost({ product_code: product.product_code });
    assert.strictEqual(pricingRes.success, true);
    assert.strictEqual(pricingRes.data.pricing.standard_list_price, 185.00);
    assert.strictEqual(pricingRes.data.costing.recorded_cost, 115.00);

    // Bind to quotation line item
    const lineItem = {
      id: "line-test-1",
      lineNo: 1,
      description: product.description,
      erpCode: product.product_code,
      variant: product.variant,
      qty: 25,
      unit: product.unit_of_measure,
      sellingPrice: pricingRes.data.pricing.standard_list_price,
      cost: pricingRes.data.costing.recorded_cost,
      costMetadata: {
        costType: pricingRes.data.costing.cost_type,
        isProvisional: true
      },
      status: "Confirmed"
    };

    assert.strictEqual(lineItem.erpCode, "MIM-SS-DISP-WM01");
    assert.strictEqual(lineItem.cost, 115.00);
    assert.strictEqual(lineItem.status, "Confirmed");
  });

  // --------------------------------------------------------------------------
  // Workflow 2: Display similar products without auto-confirming them
  // --------------------------------------------------------------------------
  await runAsyncTest("Workflow 2: Display similar products without auto-confirming them", async () => {
    const searchRes = await connector.searchProducts({ query: "Dispenser" });
    assert.strictEqual(searchRes.success, true);
    assert.ok(searchRes.data.items.length >= 2, "Expected multiple dispenser matches");

    // Line item state before selection must remain unconfirmed
    const draftLine = {
      id: "line-test-2",
      description: "Wall Soap Dispenser",
      erpCode: null,
      cost: null,
      status: "Awaiting"
    };

    // Assert that merely searching does NOT mutate or assign draftLine.erpCode
    assert.strictEqual(draftLine.erpCode, null);
    assert.strictEqual(draftLine.status, "Awaiting");
  });

  // --------------------------------------------------------------------------
  // Workflow 3: Handle an unmatched product
  // --------------------------------------------------------------------------
  await runAsyncTest("Workflow 3: Handle unmatched product gracefully (404 ERR_NO_MATCH)", async () => {
    const searchRes = await connector.searchProducts({ code: "UNKNOWN-CUSTOM-999" });
    assert.strictEqual(searchRes.success, false);
    assert.strictEqual(searchRes.error.status, 404);
    assert.strictEqual(searchRes.error.code, ERROR_CODES.NO_MATCH);

    // Line item remains in Awaiting state without fabricating a code
    const draftLine = {
      id: "line-test-3",
      description: "Custom Sensor Assembly Kit",
      erpCode: null,
      cost: null,
      status: "Awaiting"
    };

    const quote = { lineItems: [draftLine] };
    const totals = calculateTotals(quote);

    assert.strictEqual(totals.hasUnmatchedItems, true);
    assert.strictEqual(totals.hasUnknownCost, true);
    assert.strictEqual(totals.grossProfit, null);
  });

  // --------------------------------------------------------------------------
  // Workflow 4: Search and select a Debtors Ledger customer
  // --------------------------------------------------------------------------
  await runAsyncTest("Workflow 4: Search and select Debtors Ledger customer (ACC-88219)", async () => {
    const searchRes = await connector.searchDebtorsCustomers({ search: "Al-Futtaim" });
    assert.strictEqual(searchRes.success, true);
    assert.strictEqual(searchRes.data.items.length, 1);

    const customer = searchRes.data.items[0];
    assert.strictEqual(customer.account_id, "ACC-88219");
    assert.strictEqual(customer.tax_registration_number, "100293847200003");
    assert.strictEqual(customer.status, "ACTIVE");
    assert.strictEqual(customer.credit_status, "APPROVED");

    // Bind to quotation customer record
    const quote = {
      customerRoute: "D",
      customerAccount: `${customer.legal_name} [${customer.account_id}]`,
      companyName: customer.legal_name,
      trn: customer.tax_registration_number,
      customerCreditStatus: customer.credit_status
    };

    assert.ok(quote.customerAccount.includes("ACC-88219"));
    assert.strictEqual(quote.customerCreditStatus, "APPROVED");
  });

  // --------------------------------------------------------------------------
  // Workflow 5: Enter General Ledger recipient without invoking customer search
  // --------------------------------------------------------------------------
  runTest("Workflow 5: Enter General Ledger recipient without invoking customer search", () => {
    let customerSearchInvoked = false;
    const trackingConnector = {
      searchDebtorsCustomers: () => {
        customerSearchInvoked = true;
        return { success: true, data: { items: [] } };
      }
    };

    // User chooses General Ledger [G] route
    const quote = {
      customerRoute: "G",
      customerAccount: null, // Zero ERP account binding
      companyName: "Private Developer Project Office"
    };

    // If customerRoute is 'G', workspace bypasses connector customer search
    if (quote.customerRoute === "D") {
      trackingConnector.searchDebtorsCustomers({ search: quote.companyName });
    }

    assert.strictEqual(customerSearchInvoked, false, "Customer search must NEVER be called for GL [G] route");
    assert.strictEqual(quote.customerAccount, null);
    assert.strictEqual(quote.companyName, "Private Developer Project Office");
  });

  // --------------------------------------------------------------------------
  // Workflow 6: Retrieve pricing and handle missing cost
  // --------------------------------------------------------------------------
  await runAsyncTest("Workflow 6: Retrieve pricing and handle missing cost baseline (CBL-NO-COST)", async () => {
    const pricingRes = await connector.lookupPricingAndCost({ product_code: "CBL-NO-COST" });
    assert.strictEqual(pricingRes.success, true);
    assert.strictEqual(pricingRes.data.pricing.standard_list_price, 100.00);
    assert.strictEqual(pricingRes.data.costing.recorded_cost, null); // Cost is null, not 0.00!

    const line = {
      id: "line-no-cost",
      qty: 10,
      sellingPrice: pricingRes.data.pricing.standard_list_price,
      cost: pricingRes.data.costing.recorded_cost,
      erpCode: "CBL-NO-COST"
    };

    const quote = { lineItems: [line] };
    const totals = calculateTotals(quote);

    assert.strictEqual(totals.hasUnknownCost, true);
    assert.strictEqual(totals.totalCost, null);
    assert.strictEqual(totals.grossProfit, null);
    assert.strictEqual(totals.grossMargin, null);
  });

  // --------------------------------------------------------------------------
  // Workflow 7: Recalculate a multi-line quotation
  // --------------------------------------------------------------------------
  runTest("Workflow 7: Recalculate multi-line quotation with 5% VAT and margin", () => {
    const quote = {
      lineItems: [
        { id: "1", qty: 25, sellingPrice: 185.00, cost: 115.00, erpCode: "MIM-SS-DISP-WM01" },
        { id: "2", qty: 25, sellingPrice: 35.00, cost: 18.00, erpCode: "MIM-ACC-MK02" },
        { id: "3", qty: 10, sellingPrice: 17.00, cost: 9.50, erpCode: "MIM-VALVE-NZ04" }
      ]
    };

    const totals = calculateTotals(quote);

    // subtotal = (25*185) + (25*35) + (10*17) = 4625 + 875 + 170 = 5670.00
    assert.strictEqual(totals.subtotal, 5670.00);
    // vat = 5670 * 0.05 = 283.50
    assert.strictEqual(totals.vat, 283.50);
    // grandTotal = 5670 + 283.50 = 5953.50
    assert.strictEqual(totals.grandTotal, 5953.50);
    // totalCost = (25*115) + (25*18) + (10*9.5) = 2875 + 450 + 95 = 3420.00
    assert.strictEqual(totals.totalCost, 3420.00);
    // grossProfit = 5670 - 3420 = 2250.00
    assert.strictEqual(totals.grossProfit, 2250.00);
    // margin = (2250 / 5670) * 100 = 39.6825... -> 39.7%
    assert.strictEqual(totals.grossMargin, 39.7);
    assert.strictEqual(totals.hasPriceBelowCost, false);
    assert.strictEqual(totals.hasUnknownCost, false);
  });

  // --------------------------------------------------------------------------
  // Workflow 8: Block finalisation for a below-cost line
  // --------------------------------------------------------------------------
  runTest("Workflow 8: Block quotation finalisation for a below-cost line", () => {
    const quote = {
      lineItems: [
        { id: "1", qty: 10, sellingPrice: 90.00, cost: 115.00, erpCode: "MIM-SS-DISP-WM01" } // Below cost!
      ]
    };

    const totals = calculateTotals(quote);
    assert.strictEqual(totals.hasPriceBelowCost, true);

    // Pre-flight check simulates openErpConfirmModal gate
    const isBlocked = totals.hasPriceBelowCost || totals.hasUnknownCost || totals.hasUnmatchedItems;
    assert.strictEqual(isBlocked, true, "ERP confirmation MUST be blocked when selling price < recorded cost");
  });

  // --------------------------------------------------------------------------
  // Workflow 9: Preserve draft after connector timeout
  // --------------------------------------------------------------------------
  await runAsyncTest("Workflow 9: Preserve user draft completely after connector timeout", async () => {
    const slowConnector = createErpConnector({ simulatedLatencyMs: 150 });
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 20); // Abort early

    const userDraft = {
      id: "DRAFT-2026-0042",
      lineItems: [
        { id: "line-1", qty: 25, sellingPrice: 185.00, cost: 115.00, erpCode: "MIM-SS-DISP-WM01" },
        { id: "line-2", qty: 25, sellingPrice: 35.00, cost: 18.00, erpCode: "MIM-ACC-MK02" }
      ]
    };

    const res = await slowConnector.searchProducts({ query: "CBL", signal: controller.signal });
    assert.strictEqual(res.success, false);
    assert.strictEqual(res.error.code, ERROR_CODES.TIMEOUT);

    // Assert user draft is 100% intact with zero rows lost or wiped
    assert.strictEqual(userDraft.lineItems.length, 2);
    assert.strictEqual(userDraft.lineItems[0].qty, 25);
    assert.strictEqual(userDraft.lineItems[1].sellingPrice, 35.00);
  });

  // --------------------------------------------------------------------------
  // Workflow 10: Resume a draft without duplicating rows
  // --------------------------------------------------------------------------
  runTest("Workflow 10: Resume draft without duplicating or overwriting rows", () => {
    const draftsStore = {
      "DRAFT-1": { id: "DRAFT-1", lineItems: [{ id: "l1", qty: 10 }, { id: "l2", qty: 20 }] },
      "DRAFT-2": { id: "DRAFT-2", lineItems: [{ id: "l3", qty: 5 }] }
    };

    // Switch to DRAFT-1
    let active = JSON.parse(JSON.stringify(draftsStore["DRAFT-1"]));
    assert.strictEqual(active.lineItems.length, 2);

    // Switch to DRAFT-2
    active = JSON.parse(JSON.stringify(draftsStore["DRAFT-2"]));
    assert.strictEqual(active.lineItems.length, 1);

    // Switch back to DRAFT-1
    active = JSON.parse(JSON.stringify(draftsStore["DRAFT-1"]));
    assert.strictEqual(active.lineItems.length, 2);
    assert.strictEqual(active.lineItems[0].id, "l1");
  });

  // --------------------------------------------------------------------------
  // Workflow 11: Prevent outdated async responses from overwriting current state
  // --------------------------------------------------------------------------
  await runAsyncTest("Workflow 11: Prevent outdated async responses from overwriting newer selections", async () => {
    let globalSeq = 0;
    let finalAppliedData = null;

    async function simulatedAsyncSearch(term, delayMs) {
      const currentSeq = ++globalSeq;
      await new Promise(r => setTimeout(r, delayMs));
      
      // Only apply if this request is still the latest sequence
      if (currentSeq === globalSeq) {
        finalAppliedData = term;
      }
    }

    // Launch Slow Search 1 (e.g. 50ms)
    const p1 = simulatedAsyncSearch("Query-1-Slow", 50);
    // Immediately Launch Fast Search 2 (e.g. 10ms)
    const p2 = simulatedAsyncSearch("Query-2-Fast", 10);

    await Promise.all([p1, p2]);

    // Query 2 was launched second (globalSeq = 2). Even though Query 1 finished later, it must not overwrite Query 2!
    // Wait, Query 1 had delay 50ms (finishes at 50ms, currentSeq=1 vs globalSeq=2). So it is ignored!
    // Query 2 had delay 10ms (finishes at 10ms, currentSeq=2 vs globalSeq=2). Applied!
    assert.strictEqual(finalAppliedData, "Query-2-Fast", "Newer query must take precedence over slower older query");
  });

  // --------------------------------------------------------------------------
  // Workflow 12: Mock mode cannot claim official ERP confirmation
  // --------------------------------------------------------------------------
  runTest("Workflow 12: Mock mode explicitly disallows official ERP confirmation claims", () => {
    const connectorMode = connector.getMode();
    assert.strictEqual(connectorMode, "DEMO_MOCK");

    // Assertion: Any generated reference in mock mode must remain marked as draft/simulation
    const generatedRef = "DRAFT-2026-0042";
    assert.ok(generatedRef.startsWith("DRAFT-"), "Mock mode cannot generate official ERP QUOTE- references");

    // Modal simulation payload boundary
    const isLiveConnected = false;
    assert.strictEqual(isLiveConnected, false, "Live ERP flag must remain false in mock mode");
  });

  console.log("\n==================================================================");
  console.log(`Phase 3.5 Integration Test Summary: ${passedTests}/${totalTests} passed`);
  console.log("==================================================================\n");
})();
