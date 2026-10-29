# MIM QuoteFlow AI — Read-Only ERP Connector Test Plan

**Document Reference:** `docs/phase-2/ERP_CONNECTOR_TEST_PLAN.md`  
**Phase:** Phase 2 — Read-Only ERP Connector Specification  
**Status:** DRAFT — Verification & Validation Strategy  
**Execution Scope:** Contract Specification, Mock Adapter Validation, and Staging Acceptance Suite

---

## 1. Test Strategy Overview

The testing strategy validates that the **QuoteFlow Bridge Agent** fulfills all read-only requirements, correctly handles network and data edge cases, prevents unauthorized mutations, and ensures QuoteFlow AI UI gracefully preserves user drafts under failure conditions.

### Test Levels & Environments:
1. **Level 1: Local Contract & Unit Tests (Executed via Mock Server):**  
   Fast-running automated tests in Node.js/C# verifying request validation, serialization, error mapping, and calculation integrity against mock ERP payloads.
2. **Level 2: Staging ERP Integration Suite (Specified for Staging Provisioning):**  
   End-to-end integration tests connecting the Bridge Agent to an isolated, non-production ERP test database.
3. **Level 3: Security & Immutability Audit (Specified for Pre-Deployment):**  
   Negative security assertions verifying that no SQL write commands, arbitrary queries, or elevation of privileges succeed.

---

## 2. Test Execution Matrix (13 Mandatory Scenarios)

| Test ID | Scenario Description | Test Level | Status | Input Data / Precondition | Expected Behavior & Assertions |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-01** | **Exact Product Match** | Level 1 / Contract | Specified (Automated) | Query: `code=CBL-4C-016-CU` | Returns HTTP 200, exactly 1 record, `match_type: EXACT_CODE`, full specifications, and active status. |
| **TC-02** | **Similar Product Descriptions with Different Variants** | Level 1 / Contract | Specified (Automated) | Query: `query=XLPE 4-Core Cu` | Returns HTTP 200 with 2+ variants (`16mm²`, `25mm²`, `35mm²`). UI presents disambiguation table requiring user selection. |
| **TC-03** | **Unknown Product Code** | Level 1 / Contract | Specified (Automated) | Query: `code=NON-EXISTENT-999` | Returns HTTP 404 with RFC 7807 problem `ERR_NO_MATCH`. UI shows clean "No ERP records found" notice; draft state unchanged. |
| **TC-04** | **Duplicate / Ambiguous Customer Results** | Level 1 / Contract | Specified (Automated) | Query: `search=Al-Futtaim` | Returns HTTP 200 with multiple matching Debtors entities. UI forces estimator to pick exact TRN/Account code before binding. |
| **TC-05** | **General Ledger [G] Recipient Isolation** | Level 1 / Workspace | Specified (Automated) | Workspace toggle: `[G] General Ledger`, recipient text: `"Gulf Contracting"` | Assert that **zero HTTP network requests** are sent to `/api/v1/erp/customers/debtors`. Recipient string stored only in local draft. |
| **TC-06** | **Missing Recorded Cost Baseline** | Level 1 / Contract | Specified (Automated) | Mock item where `recorded_cost: null` | Returns HTTP 200 with `recorded_cost: null` and warning flag. QuoteFlow UI displays `⚠ Missing Cost Baseline`, does NOT default to 0. |
| **TC-07** | **Inactive / Discontinued Product** | Level 1 / Contract | Specified (Automated) | Item marked `is_active: false` in ERP | When `include_inactive=false`, item is omitted. When requested directly, returns `is_active: false`. UI disables "Add to Quote". |
| **TC-08** | **ERP Database Query Timeout** | Level 1 / Fault Injection | Specified (Automated) | Simulated database sleep > 5000ms | Bridge Agent aborts query at 3000ms, returns HTTP 504 `ERR_TIMEOUT`. UI alerts user and preserves draft. |
| **TC-09** | **Authentication & Role Failure** | Level 1 / Security | Specified (Automated) | Missing or expired Bearer token; or token lacking `pricing:read` | Returns HTTP 401 `ERR_UNAUTHORIZED` or HTTP 403 `ERR_FORBIDDEN`. Sensitive cost data never disclosed. |
| **TC-10** | **Malformed ERP Database Response** | Level 1 / Fault Injection | Specified (Automated) | ERP returns string for numeric price or broken JSON | Connector catches deserialization fault, returns HTTP 502 `ERR_INVALID_ERP_RESPONSE`. UI maintains draft integrity. |
| **TC-11** | **Excessive Query String / SQL Injection Attempt** | Level 1 / Security | Specified (Automated) | Query contains `' OR 1=1; DROP TABLE tbl_Items;--` | Regex validator blocks request at API boundary with HTTP 400 `ERR_INVALID_REQUEST`. No query reaches ERP. |
| **TC-12** | **Draft Preservation After Search Failure** | Level 1 / Workspace | Specified (Automated) | User has 5 items in draft; conducts product search that returns 503 ERP Offline | Existing 5 items remain completely intact in UI and LocalStorage. Error banner displayed without reload or form wipe. |
| **TC-13** | **Read-Only Verification (Mutation Prohibition)** | Level 3 / Security | Specified (Staging) | Execute SQL write probe: `INSERT INTO tbl_Items...` via Bridge Agent identity | Database server immediately rejects with `SqlException: The INSERT permission was denied on the object 'tbl_Items'`. |

---

## 3. Test Automation Blueprint (Mock Contract Test)

Below is the automated mock contract test runner designed for implementation in `tests/contract_erp_mock_test.js`:

```javascript
/**
 * Automated Mock Contract Test Suite: ERP Connector Read-Only Specification
 * Verifies API schemas, error handling, and draft safety.
 */

const assert = require('assert');

// Mock Bridge Agent Dispatcher
function mockBridgeAgent(endpoint, params, headers) {
  if (!headers || !headers.Authorization) {
    return { status: 401, body: { code: 'ERR_UNAUTHORIZED' } };
  }

  if (endpoint === '/api/v1/erp/products/search') {
    if (params.code === 'CBL-4C-016-CU') {
      return {
        status: 200,
        body: {
          status: 'success',
          data: {
            total_records: 1,
            items: [{ product_code: 'CBL-4C-016-CU', is_active: true, unit_of_measure: 'MTR' }]
          }
        }
      };
    }
    if (params.code === 'NON-EXISTENT-999') {
      return { status: 404, body: { code: 'ERR_NO_MATCH' } };
    }
  }

  if (endpoint === '/api/v1/erp/pricing/lookup') {
    if (params.product_code === 'CBL-NO-COST') {
      return {
        status: 200,
        body: {
          data: {
            product_code: 'CBL-NO-COST',
            pricing: { standard_list_price: 100.00 },
            costing: { recorded_cost: null, is_cost_stale: true }
          }
        }
      };
    }
  }

  return { status: 400, body: { code: 'ERR_INVALID_REQUEST' } };
}

// Test Runner Execution
console.log('Running ERP Connector Contract Validation Suite...');

// TC-01: Exact Match
let res1 = mockBridgeAgent('/api/v1/erp/products/search', { code: 'CBL-4C-016-CU' }, { Authorization: 'Bearer valid' });
assert.strictEqual(res1.status, 200, 'TC-01 Failed: Status not 200');
assert.strictEqual(res1.body.data.items[0].product_code, 'CBL-4C-016-CU', 'TC-01 Failed: Wrong item');
console.log('✓ TC-01 Passed: Exact Product Match');

// TC-03: Unknown Product
let res3 = mockBridgeAgent('/api/v1/erp/products/search', { code: 'NON-EXISTENT-999' }, { Authorization: 'Bearer valid' });
assert.strictEqual(res3.status, 404, 'TC-03 Failed: Status not 404');
assert.strictEqual(res3.body.code, 'ERR_NO_MATCH', 'TC-03 Failed: Wrong error code');
console.log('✓ TC-03 Passed: Unknown Product Code');

// TC-06: Missing Cost
let res6 = mockBridgeAgent('/api/v1/erp/pricing/lookup', { product_code: 'CBL-NO-COST' }, { Authorization: 'Bearer valid' });
assert.strictEqual(res6.status, 200, 'TC-06 Failed: Status not 200');
assert.strictEqual(res6.body.data.costing.recorded_cost, null, 'TC-06 Failed: Cost should be null');
console.log('✓ TC-06 Passed: Missing Cost Baseline Handling');

// TC-09: Unauthorized Request
let res9 = mockBridgeAgent('/api/v1/erp/products/search', { code: 'CBL-4C-016-CU' }, {});
assert.strictEqual(res9.status, 401, 'TC-09 Failed: Status not 401');
console.log('✓ TC-09 Passed: Security Authorization Check');

console.log('\nAll mock contract assertions passed successfully.');
```

---

## 4. Distinction Between Executed vs. Specified Tests

> **COMPLIANCE DECLARATION:**
> - **Executed Tests (Completed in Phase 1.5):**
>   - `tests/audit_calculations_test.js`: Executed and verified (8/8 passed).
>   - `tests/workflow_integration_test.js`: Executed and verified (All workflow checks passed).
> - **Specified Tests (Phase 2):**
>   - The 13 test scenarios defined above are **architectural specifications**. They are scheduled for execution during Phase 3 after the Bridge Agent mock adapter and on-premise test environment are officially authorized.
