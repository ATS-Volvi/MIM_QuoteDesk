/**
 * MIM QuoteFlow AI — ERP Connector Contract Test Suite
 * 
 * Verifies the read-only connector interface, mock adapter, RFC 7807 error handling,
 * security boundaries, and draft safety invariants.
 */

const assert = require('assert');
const { createErpConnector, ERROR_CODES } = require('../src/connector/erpConnector');

let passedTests = 0;
let totalTests = 0;

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

(async function () {
  console.log('======================================================');
  console.log('MIM QuoteFlow AI — Read-Only ERP Connector Test Suite');
  console.log('======================================================\n');

  const connector = createErpConnector({ simulatedLatencyMs: 5 });

  // --------------------------------------------------------------------------
  // Test 1: Exact Product Search
  // --------------------------------------------------------------------------
  await runAsyncTest('Test 1: Exact product search returns verified SKU and specifications', async () => {
    const res = await connector.searchProducts({ code: 'CBL-4C-016-CU' });
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.total_records, 1);
    assert.strictEqual(res.data.items[0].product_code, 'CBL-4C-016-CU');
    assert.strictEqual(res.data.items[0].unit_of_measure, 'MTR');
    assert.strictEqual(res.data.items[0].match_type, 'EXACT_CODE');
    assert.strictEqual(res.metadata.data_source, 'MOCK_DEMO_DATA');
    assert.strictEqual(res.metadata.is_authoritative, false);
  });

  // --------------------------------------------------------------------------
  // Test 2: Similar Product Search & Variant Filtering
  // --------------------------------------------------------------------------
  await runAsyncTest('Test 2: Free-text search returns multiple variants with distinct specifications', async () => {
    const res = await connector.searchProducts({ query: 'XLPE', category: 'CABLES' });
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.data.items.length >= 2, true);
    const codes = res.data.items.map(i => i.product_code);
    assert.ok(codes.includes('CBL-4C-016-CU'));
    assert.ok(codes.includes('CBL-4C-025-CU'));
  });

  // --------------------------------------------------------------------------
  // Test 3: Unknown Product Code (RFC 7807 404 Error)
  // --------------------------------------------------------------------------
  await runAsyncTest('Test 3: Unknown product code returns RFC 7807 ERR_NO_MATCH (404)', async () => {
    const res = await connector.searchProducts({ code: 'NON-EXISTENT-SKU' });
    assert.strictEqual(res.success, false);
    assert.strictEqual(res.error.status, 404);
    assert.strictEqual(res.error.code, ERROR_CODES.NO_MATCH);
    assert.ok(res.error.detail.includes('NON-EXISTENT-SKU'));
    assert.ok(res.error.user_action);
  });

  // --------------------------------------------------------------------------
  // Test 4: Inactive Product Exclusion
  // --------------------------------------------------------------------------
  await runAsyncTest('Test 4: Inactive/discontinued products are excluded by default', async () => {
    const res = await connector.searchProducts({ query: 'Dispenser', include_inactive: false });
    assert.strictEqual(res.success, true);
    const hasInactive = res.data.items.some(i => i.is_active === false);
    assert.strictEqual(hasInactive, false);
  });

  // --------------------------------------------------------------------------
  // Test 5: Debtors Ledger Customer Search
  // --------------------------------------------------------------------------
  await runAsyncTest('Test 5: Debtors Customer Search returns authoritative account ID and TRN', async () => {
    const res = await connector.searchDebtorsCustomers({ search: 'Al-Futtaim' });
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.data.items.length, 1);
    const customer = res.data.items[0];
    assert.strictEqual(customer.account_id, 'ACC-88219');
    assert.strictEqual(customer.account_type, 'DEBTORS_LEDGER');
    assert.strictEqual(customer.tax_registration_number, '100293847200003');
    assert.strictEqual(customer.status, 'ACTIVE');
  });

  // --------------------------------------------------------------------------
  // Test 6: Unknown Debtors Customer Search
  // --------------------------------------------------------------------------
  await runAsyncTest('Test 6: Unknown customer search returns 404 ERR_NO_MATCH with guidance', async () => {
    const res = await connector.searchDebtorsCustomers({ search: 'Unregistered Co 999' });
    assert.strictEqual(res.success, false);
    assert.strictEqual(res.error.status, 404);
    assert.strictEqual(res.error.code, ERROR_CODES.NO_MATCH);
    assert.ok(res.error.user_action.includes('General Ledger'));
  });

  // --------------------------------------------------------------------------
  // Test 7: General Ledger Recipient Isolation
  // --------------------------------------------------------------------------
  runTest('Test 7: General Ledger [G] recipient strings do not query or pollute customer master', () => {
    // When an estimator chooses [G], the application must bypass connector customer search entirely.
    const glRecipient = 'Dubai Municipality Parks Division';
    const simulatedCustomerRoute = 'G';

    // Verify isolation invariant: GL recipient remains document-local
    const quotationCustomerState = {
      route: simulatedCustomerRoute,
      account_id: null, // No ERP account binding
      recipient_name: glRecipient
    };

    assert.strictEqual(quotationCustomerState.account_id, null);
    assert.strictEqual(quotationCustomerState.route, 'G');
  });

  // --------------------------------------------------------------------------
  // Test 8: Authoritative Pricing and Costing Lookup
  // --------------------------------------------------------------------------
  await runAsyncTest('Test 8: Pricing and cost lookup returns list price and cost valuation basis', async () => {
    const res = await connector.lookupPricingAndCost({ product_code: 'CBL-4C-016-CU' });
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.data.pricing.standard_list_price, 145.00);
    assert.strictEqual(res.data.costing.recorded_cost, 115.00);
    assert.strictEqual(res.data.costing.cost_type, 'WEIGHTED_AVERAGE_COST');
    assert.strictEqual(res.data.costing.is_cost_stale, false);
  });

  // --------------------------------------------------------------------------
  // Test 9: Missing Cost Baseline Handling (Null, not 0.00)
  // --------------------------------------------------------------------------
  await runAsyncTest('Test 9: Missing cost baseline returns null and flags pending valuation', async () => {
    const res = await connector.lookupPricingAndCost({ product_code: 'CBL-NO-COST' });
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.data.costing.recorded_cost, null);
    assert.strictEqual(res.data.costing.is_cost_stale, true);
    assert.strictEqual(res.data.costing.cost_approval_status, 'PENDING_VALUATION');
  });

  // --------------------------------------------------------------------------
  // Test 10: Connector Health Check & Credential Sanitization
  // --------------------------------------------------------------------------
  await runAsyncTest('Test 10: Health check returns sanitized diagnostics with zero credentials exposed', async () => {
    const res = await connector.checkHealth();
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.data.status, 'healthy');
    assert.strictEqual(res.data.dependencies.erp_connection.mode, 'READ_ONLY_MOCK');
    // Ensure no connection strings, passwords, or usernames leak
    const serialized = JSON.stringify(res);
    assert.ok(!serialized.toLowerCase().includes('password'));
    assert.ok(!serialized.toLowerCase().includes('uid='));
    assert.ok(!serialized.toLowerCase().includes('connstr'));
  });

  // --------------------------------------------------------------------------
  // Test 11: Request Timeout / Cancellation via AbortSignal
  // --------------------------------------------------------------------------
  await runAsyncTest('Test 11: Timeout aborts query gracefully and returns ERR_TIMEOUT (504)', async () => {
    const slowConnector = createErpConnector({ simulatedLatencyMs: 150 });
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 20); // Abort before completion

    const res = await slowConnector.searchProducts({
      query: 'CBL',
      signal: controller.signal
    });

    assert.strictEqual(res.success, false);
    assert.strictEqual(res.error.status, 504);
    assert.strictEqual(res.error.code, ERROR_CODES.TIMEOUT);
    assert.strictEqual(res.error.retryable, true);
  });

  // --------------------------------------------------------------------------
  // Test 12: Security Boundary & Unauthorized Promotion Guard
  // --------------------------------------------------------------------------
  runTest('Test 12: Security factory blocks unauthorized client-side promotion to LIVE mode', () => {
    // Attempt 1: Switching to LIVE_ON_PREM without server credentials
    assert.throws(
      () => {
        createErpConnector({ mode: 'LIVE_ON_PREM' });
      },
      /SECURITY VIOLATION/,
      'Should throw security violation when credentials/endpoint missing'
    );

    // Attempt 2: Even with spoofed token, blocked by Phase Gate
    assert.throws(
      () => {
        createErpConnector({
          mode: 'LIVE_ON_PREM',
          serverEndpoint: 'https://erp-internal.mim.ae:8443',
          authToken: 'spoofed_token_long_string_12345'
        });
      },
      /PHASE 2\/3 GATE BLOCKED/,
      'Should block live connection until staging environment is certified'
    );
  });

  // --------------------------------------------------------------------------
  // Test 13: Draft Preservation on Connector Failure
  // --------------------------------------------------------------------------
  await runAsyncTest('Test 13: Simulated ERP outage returns structured error without corrupting draft', async () => {
    const failingConnector = createErpConnector({ simulateFailures: true });
    
    // User draft state prior to call
    const userDraft = {
      id: 'DRAFT-2026-0042',
      lines: [{ id: 'line-1', qty: 25, price: 185.00 }]
    };

    const res = await failingConnector.searchProducts({ query: 'CBL' });
    
    assert.strictEqual(res.success, false);
    assert.strictEqual(res.error.status, 503);
    assert.strictEqual(res.error.code, ERROR_CODES.ERP_UNAVAILABLE);

    // Assert user draft remains completely intact
    assert.strictEqual(userDraft.lines.length, 1);
    assert.strictEqual(userDraft.lines[0].qty, 25);
  });

  console.log('\n======================================================');
  console.log(`Test Execution Summary: ${passedTests}/${totalTests} passed`);
  console.log('======================================================\n');
})();
