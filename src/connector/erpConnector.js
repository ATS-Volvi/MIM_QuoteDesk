/**
 * MIM QuoteFlow AI — Technology-Neutral Read-Only ERP Connector Foundation
 * 
 * Defines the contract interface, mock implementation, and security configuration
 * boundary for Phase 3 integration with the MIM Windows ERP.
 * 
 * Compatibility: Universal JavaScript (Node.js CommonJS & Browser Global)
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    // Node.js CommonJS
    module.exports = factory();
  } else {
    // Browser Global
    root.MIM_ERP = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  // --------------------------------------------------------------------------
  // Standard RFC 7807 Error Code Definitions
  // --------------------------------------------------------------------------
  const ERROR_CODES = {
    INVALID_REQUEST: 'ERR_INVALID_REQUEST',
    UNAUTHORIZED: 'ERR_UNAUTHORIZED',
    FORBIDDEN: 'ERR_FORBIDDEN',
    NO_MATCH: 'ERR_NO_MATCH',
    AMBIGUOUS_MATCH: 'ERR_AMBIGUOUS_MATCH',
    RATE_LIMIT: 'ERR_RATE_LIMIT',
    ERP_UNAVAILABLE: 'ERR_ERP_UNAVAILABLE',
    TIMEOUT: 'ERR_TIMEOUT',
    UNSUPPORTED_CAPABILITY: 'ERR_UNSUPPORTED_CAPABILITY',
    INVALID_ERP_RESPONSE: 'ERR_INVALID_ERP_RESPONSE'
  };

  /**
   * Helper to construct RFC 7807 Problem Document
   */
  function createProblemDetails({ status, code, title, detail, instance, retryable, userAction }) {
    return {
      type: `https://quoteflow.mim.ae/errors/${code}`,
      title: title || 'ERP Connector Operation Failed',
      status: status || 500,
      code: code || ERROR_CODES.ERP_UNAVAILABLE,
      detail: detail || 'An unexpected error occurred while communicating with the ERP service.',
      instance: instance || '/api/v1/erp',
      timestamp: new Date().toISOString(),
      retryable: retryable !== undefined ? retryable : false,
      user_action: userAction || 'Please verify your inputs or retry the operation in draft mode.'
    };
  }

  // --------------------------------------------------------------------------
  // Mock Data Store (Explicitly identified as Non-Production Synthetic Data)
  // --------------------------------------------------------------------------
  const MOCK_PRODUCTS_DATA = [
    {
      product_code: 'CBL-4C-016-CU',
      description: 'XLPE/SWA/PVC 4-Core 16mm² Cu 0.6/1kV',
      category: 'CABLES',
      unit_of_measure: 'MTR',
      is_active: true,
      match_type: 'EXACT_CODE',
      specifications: {
        conductor: 'Copper',
        cores: 4,
        cross_section_mm2: 16.0,
        insulation: 'XLPE',
        armour: 'SWA',
        sheath: 'PVC',
        standard: 'BS 5467 / IEC 60502-1'
      },
      inventory_status: {
        is_stocked: true,
        lead_time_days: 3
      },
      pricing_summary: {
        currency: 'AED',
        list_price: 145.00,
        unit: 'MTR'
      }
    },
    {
      product_code: 'CBL-4C-025-CU',
      description: 'XLPE/SWA/PVC 4-Core 25mm² Cu 0.6/1kV',
      category: 'CABLES',
      unit_of_measure: 'MTR',
      is_active: true,
      match_type: 'SIMILAR_DESCRIPTION',
      specifications: {
        conductor: 'Copper',
        cores: 4,
        cross_section_mm2: 25.0,
        insulation: 'XLPE',
        armour: 'SWA',
        sheath: 'PVC',
        standard: 'BS 5467 / IEC 60502-1'
      },
      inventory_status: {
        is_stocked: true,
        lead_time_days: 5
      },
      pricing_summary: {
        currency: 'AED',
        list_price: 210.00,
        unit: 'MTR'
      }
    },
    {
      product_code: 'EMT-CON-020-GI',
      description: 'Galvanized Steel Electrical Metallic Tubing (EMT) Conduit 20mm (3m Length)',
      category: 'CONDUITS',
      unit_of_measure: 'PCS',
      is_active: true,
      match_type: 'EXACT_CODE',
      specifications: {
        material: 'Galvanized Steel',
        diameter_mm: 20.0,
        length_m: 3.0,
        standard: 'UL 797 / ANSI C80.3'
      },
      inventory_status: {
        is_stocked: true,
        lead_time_days: 1
      },
      pricing_summary: {
        currency: 'AED',
        list_price: 28.50,
        unit: 'PCS'
      }
    },
    {
      product_code: 'DISP-SS-DISC-01',
      description: 'Obsolete Wall Mount Dispenser (Legacy)',
      category: 'DISPENSERS',
      unit_of_measure: 'PCS',
      is_active: false, // Discontinued item
      match_type: 'EXACT_CODE',
      specifications: {},
      inventory_status: {
        is_stocked: false,
        lead_time_days: 0
      },
      pricing_summary: {
        currency: 'AED',
        list_price: 80.00,
        unit: 'PCS'
      }
    }
  ];

  const MOCK_DEBTORS_DATA = [
    {
      account_id: 'ACC-88219',
      account_type: 'DEBTORS_LEDGER',
      legal_name: 'Al-Futtaim Engineering & Technologies LLC',
      trade_name: 'Al-Futtaim Engineering',
      tax_registration_number: '100293847200003',
      status: 'ACTIVE',
      credit_status: 'APPROVED',
      default_payment_terms: '30 Days PDC',
      default_price_list_id: 'PL-CONTRACTOR-2026',
      billing_address: {
        street: 'Airport Road, Um Ramool',
        city: 'Dubai',
        country: 'United Arab Emirates',
        po_box: '159'
      },
      currency: 'AED'
    },
    {
      account_id: 'ACC-44102',
      account_type: 'DEBTORS_LEDGER',
      legal_name: 'Khansaheb Civil Engineering LLC',
      trade_name: 'Khansaheb',
      tax_registration_number: '100348291000003',
      status: 'ACTIVE',
      credit_status: 'APPROVED',
      default_payment_terms: '45 Days Net',
      default_price_list_id: 'PL-CONTRACTOR-2026',
      billing_address: {
        street: 'Khansaheb Building, Dubai-Sharjah Road',
        city: 'Dubai',
        country: 'United Arab Emirates',
        po_box: '2716'
      },
      currency: 'AED'
    },
    {
      account_id: 'ACC-HOLD-09',
      account_type: 'DEBTORS_LEDGER',
      legal_name: 'Stalled Commercial Contractors LLC',
      trade_name: 'Stalled Commercial',
      tax_registration_number: '100998877600003',
      status: 'ON_HOLD',
      credit_status: 'CREDIT_HOLD',
      default_payment_terms: 'Cash on Delivery Only',
      default_price_list_id: 'PL-STANDARD-2026',
      billing_address: {
        street: 'Al Quoz Industrial 3',
        city: 'Dubai',
        country: 'United Arab Emirates',
        po_box: '8841'
      },
      currency: 'AED'
    }
  ];

  const MOCK_PRICING_DATA = {
    'CBL-4C-016-CU': {
      product_code: 'CBL-4C-016-CU',
      currency: 'AED',
      unit_of_measure: 'MTR',
      pricing: {
        standard_list_price: 145.00,
        customer_special_price: 138.00,
        price_list_id: 'PL-CONTRACTOR-2026',
        price_list_name: 'General MEP Contractors 2026',
        effective_from: '2026-01-01'
      },
      costing: {
        recorded_cost: 115.00,
        cost_type: 'WEIGHTED_AVERAGE_COST', // Candidate valuation method
        cost_timestamp: '2026-10-28T18:00:00Z',
        is_cost_stale: false,
        cost_approval_status: 'APPROVED'
      },
      historical_benchmarks: {
        last_quoted_price: 135.00,
        last_quoted_date: '2026-09-15',
        variance_indicator: 'HIGHER_THAN_LAST_QUOTE',
        variance_percent: 2.22
      }
    },
    'EMT-CON-020-GI': {
      product_code: 'EMT-CON-020-GI',
      currency: 'AED',
      unit_of_measure: 'PCS',
      pricing: {
        standard_list_price: 28.50,
        customer_special_price: 26.00,
        price_list_id: 'PL-CONTRACTOR-2026',
        price_list_name: 'General MEP Contractors 2026',
        effective_from: '2026-01-01'
      },
      costing: {
        recorded_cost: 18.20,
        cost_type: 'WEIGHTED_AVERAGE_COST',
        cost_timestamp: '2026-10-25T18:00:00Z',
        is_cost_stale: false,
        cost_approval_status: 'APPROVED'
      },
      historical_benchmarks: {
        last_quoted_price: 25.50,
        last_quoted_date: '2026-08-20',
        variance_indicator: 'HIGHER_THAN_LAST_QUOTE',
        variance_percent: 1.96
      }
    },
    'CBL-NO-COST': {
      product_code: 'CBL-NO-COST',
      currency: 'AED',
      unit_of_measure: 'MTR',
      pricing: {
        standard_list_price: 100.00,
        customer_special_price: 100.00,
        price_list_id: 'PL-STANDARD-2026',
        price_list_name: 'Standard Catalog 2026',
        effective_from: '2026-01-01'
      },
      costing: {
        recorded_cost: null, // Explicitly missing cost baseline test case
        cost_type: 'UNSPECIFIED',
        cost_timestamp: null,
        is_cost_stale: true,
        cost_approval_status: 'PENDING_VALUATION'
      },
      historical_benchmarks: null
    }
  };

  // --------------------------------------------------------------------------
  // MockErpConnector Implementation
  // --------------------------------------------------------------------------
  class MockErpConnector {
    constructor(options = {}) {
      this.mode = 'DEMO_MOCK';
      this.simulatedLatencyMs = options.simulatedLatencyMs || 10;
      this.simulateFailures = options.simulateFailures || false;
      this.version = '1.0.0-mock';
    }

    /**
     * Internal async delay respecting AbortSignal
     */
    async _delay(signal) {
      if (this.simulatedLatencyMs <= 0) return;
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => resolve(), this.simulatedLatencyMs);
        if (signal) {
          signal.addEventListener('abort', () => {
            clearTimeout(timer);
            const err = new Error('Request was aborted or timed out.');
            err.name = 'AbortError';
            reject(err);
          });
        }
      });
    }

    /**
     * Get operational mode
     */
    getMode() {
      return this.mode;
    }

    /**
     * Product Master Search (Read-Only)
     * @param {Object} params
     * @param {string} [params.query]
     * @param {string} [params.code]
     * @param {string} [params.category]
     * @param {boolean} [params.include_inactive=false]
     * @param {number} [params.limit=20]
     * @param {AbortSignal} [params.signal]
     */
    async searchProducts(params = {}) {
      try {
        await this._delay(params.signal);

        if (this.simulateFailures) {
          return {
            success: false,
            error: createProblemDetails({
              status: 503,
              code: ERROR_CODES.ERP_UNAVAILABLE,
              detail: 'Simulated on-premise ERP connection failure.'
            })
          };
        }

        const query = (params.query || '').trim().toLowerCase();
        const code = (params.code || '').trim().toUpperCase();
        const category = (params.category || 'ALL').toUpperCase();
        const includeInactive = Boolean(params.include_inactive);
        const limit = Math.min(Math.max(params.limit || 20, 1), 50);

        if (!query && !code) {
          return {
            success: false,
            error: createProblemDetails({
              status: 400,
              code: ERROR_CODES.INVALID_REQUEST,
              detail: 'Either product search "query" or exact "code" must be provided.',
              instance: '/api/v1/erp/products/search'
            })
          };
        }

        let filtered = MOCK_PRODUCTS_DATA.filter(item => {
          if (!includeInactive && !item.is_active) return false;
          if (category !== 'ALL' && item.category.toUpperCase() !== category) return false;

          if (code) {
            return item.product_code.toUpperCase() === code;
          }

          if (query) {
            const inCode = item.product_code.toLowerCase().includes(query);
            const inDesc = item.description.toLowerCase().includes(query);
            return inCode || inDesc;
          }

          return true;
        });

        if (code && filtered.length === 0) {
          return {
            success: false,
            error: createProblemDetails({
              status: 404,
              code: ERROR_CODES.NO_MATCH,
              detail: `No product found in catalog matching code: ${code}`,
              instance: `/api/v1/erp/products/search?code=${encodeURIComponent(code)}`,
              userAction: 'Please verify the product code or search by description.'
            })
          };
        }

        const items = filtered.slice(0, limit);

        return {
          success: true,
          status: 200,
          data: {
            total_records: filtered.length,
            page: 1,
            limit: limit,
            has_more: filtered.length > limit,
            items: items
          },
          metadata: {
            data_source: 'MOCK_DEMO_DATA',
            is_authoritative: false,
            contract_version: 'v1.0.0-draft',
            as_of: new Date().toISOString()
          }
        };
      } catch (err) {
        if (err.name === 'AbortError') {
          return {
            success: false,
            error: createProblemDetails({
              status: 504,
              code: ERROR_CODES.TIMEOUT,
              detail: 'Product search request exceeded configured timeout threshold.',
              retryable: true
            })
          };
        }
        return {
          success: false,
          error: createProblemDetails({
            status: 500,
            code: ERROR_CODES.INVALID_ERP_RESPONSE,
            detail: err.message
          })
        };
      }
    }

    /**
     * Debtors Ledger Customer Search (Read-Only)
     * @param {Object} params
     * @param {string} params.search
     * @param {string} [params.status='ACTIVE']
     * @param {number} [params.limit=15]
     * @param {AbortSignal} [params.signal]
     */
    async searchDebtorsCustomers(params = {}) {
      try {
        await this._delay(params.signal);

        const search = (params.search || '').trim().toLowerCase();
        const status = (params.status || 'ACTIVE').toUpperCase();
        const limit = Math.min(Math.max(params.limit || 15, 1), 30);

        if (!search || search.length < 2) {
          return {
            success: false,
            error: createProblemDetails({
              status: 400,
              code: ERROR_CODES.INVALID_REQUEST,
              detail: 'Customer search term must be at least 2 characters.',
              instance: '/api/v1/erp/customers/debtors'
            })
          };
        }

        let filtered = MOCK_DEBTORS_DATA.filter(c => {
          if (status !== 'ALL' && c.status.toUpperCase() !== status) return false;
          const matchCode = c.account_id.toLowerCase().includes(search);
          const matchLegal = c.legal_name.toLowerCase().includes(search);
          const matchTrade = c.trade_name.toLowerCase().includes(search);
          const matchTrn = c.tax_registration_number.includes(search);
          return matchCode || matchLegal || matchTrade || matchTrn;
        });

        if (filtered.length === 0) {
          return {
            success: false,
            error: createProblemDetails({
              status: 404,
              code: ERROR_CODES.NO_MATCH,
              detail: `No verified Debtors Ledger customer matched "${params.search}".`,
              instance: `/api/v1/erp/customers/debtors?search=${encodeURIComponent(params.search)}`,
              userAction: 'Verify the Debtors account code or switch to General Ledger [G] for one-off recipients.'
            })
          };
        }

        return {
          success: true,
          status: 200,
          data: {
            total_records: filtered.length,
            items: filtered.slice(0, limit)
          },
          metadata: {
            data_source: 'MOCK_DEMO_DATA',
            is_authoritative: false,
            as_of: new Date().toISOString()
          }
        };
      } catch (err) {
        if (err.name === 'AbortError') {
          return {
            success: false,
            error: createProblemDetails({
              status: 504,
              code: ERROR_CODES.TIMEOUT,
              detail: 'Customer search request timed out.'
            })
          };
        }
        return {
          success: false,
          error: createProblemDetails({
            status: 500,
            code: ERROR_CODES.INVALID_ERP_RESPONSE,
            detail: err.message
          })
        };
      }
    }

    /**
     * Authoritative Pricing and Cost Lookup (Read-Only)
     * @param {Object} params
     * @param {string} params.product_code
     * @param {string} [params.account_id]
     * @param {number} [params.quantity=1]
     * @param {AbortSignal} [params.signal]
     */
    async lookupPricingAndCost(params = {}) {
      try {
        await this._delay(params.signal);

        const code = (params.product_code || '').trim().toUpperCase();
        if (!code) {
          return {
            success: false,
            error: createProblemDetails({
              status: 400,
              code: ERROR_CODES.INVALID_REQUEST,
              detail: 'Field "product_code" is required for price and cost lookup.',
              instance: '/api/v1/erp/pricing/lookup'
            })
          };
        }

        const record = MOCK_PRICING_DATA[code];
        if (!record) {
          return {
            success: false,
            error: createProblemDetails({
              status: 404,
              code: ERROR_CODES.NO_MATCH,
              detail: `No pricing or cost baseline found for product: ${code}`,
              instance: `/api/v1/erp/pricing/lookup?product_code=${encodeURIComponent(code)}`
            })
          };
        }

        return {
          success: true,
          status: 200,
          data: JSON.parse(JSON.stringify(record)),
          metadata: {
            data_source: 'MOCK_DEMO_DATA',
            is_authoritative: false,
            note: 'QuoteFlow calculation engine retains calculation authority for margins and totals.'
          }
        };
      } catch (err) {
        if (err.name === 'AbortError') {
          return {
            success: false,
            error: createProblemDetails({
              status: 504,
              code: ERROR_CODES.TIMEOUT,
              detail: 'Pricing lookup request timed out.'
            })
          };
        }
        return {
          success: false,
          error: createProblemDetails({
            status: 500,
            code: ERROR_CODES.INVALID_ERP_RESPONSE,
            detail: err.message
          })
        };
      }
    }

    /**
     * Health and Version Check (Read-Only, Sanitized)
     */
    async checkHealth(params = {}) {
      try {
        await this._delay(params.signal);

        return {
          success: true,
          status: 200,
          data: {
            status: 'healthy',
            service: 'mim-quoteflow-bridge-agent-mock',
            version: this.version,
            contract_version: 'v1.0.0-draft',
            timestamp: new Date().toISOString(),
            dependencies: {
              erp_connection: {
                status: 'connected',
                mode: 'READ_ONLY_MOCK',
                latency_ms: this.simulatedLatencyMs
              }
            }
          }
        };
      } catch (err) {
        return {
          success: false,
          error: createProblemDetails({
            status: 503,
            code: ERROR_CODES.ERP_UNAVAILABLE,
            detail: 'Health check failed.'
          })
        };
      }
    }
  }

  // --------------------------------------------------------------------------
  // Integration Configuration Boundary & Anti-Tamper Factory
  // --------------------------------------------------------------------------
  /**
   * Factory function to create an approved connector instance.
   * Enforces that browser code CANNOT unilaterally switch into live production mode
   * without a validated server-side configuration token and verified endpoint.
   *
   * @param {Object} config
   * @param {string} [config.mode='DEMO_MOCK']
   * @param {string} [config.serverEndpoint]
   * @param {string} [config.authToken]
   * @param {number} [config.timeoutMs=5000]
   */
  function createErpConnector(config = {}) {
    const requestedMode = (config.mode || 'DEMO_MOCK').toUpperCase();

    // Guard: Prevent client-side unauthorized promotion to LIVE mode
    if (requestedMode === 'LIVE_ON_PREM') {
      const hasEndpoint = typeof config.serverEndpoint === 'string' && config.serverEndpoint.startsWith('https://');
      const hasToken = typeof config.authToken === 'string' && config.authToken.length > 20;

      if (!hasEndpoint || !hasToken) {
        throw new Error(
          'SECURITY VIOLATION: Unauthorized live ERP mode requested. ' +
          'Live on-premise ERP integration requires verified HTTPS serverEndpoint and trusted backend authToken. ' +
          'Client-side LocalStorage switching to live mode is strictly prohibited.'
        );
      }

      throw new Error(
        'PHASE 2/3 GATE BLOCKED: Live on-premise ERP connector is not yet approved. ' +
        'ERP product version, vendor integration mechanism, and staging environment must be certified first.'
      );
    }

    // Default: Safe Mock Connector
    return new MockErpConnector(config);
  }

  return {
    ERROR_CODES,
    MockErpConnector,
    createErpConnector,
    createProblemDetails
  };
});
