# MIM QuoteFlow AI — Phase 2: ERP Discovery Checklist & Questionnaire

> **Document Version:** 1.0.0 (Phase 2 Specification)  
> **Target System:** MIM Windows ERP Environment  
> **Integration Status:** Pre-Integration Discovery (Strictly Read-Only)  
> **Author:** Antigravity Engineering & Quotation Architecture Team  

---

## 1. Executive Summary & Purpose

MIM QuoteFlow AI is an enterprise quotation workspace created to accelerate and validate customer quotation workflows alongside the existing MIM Windows ERP system. 

In **Phase 1 and 1.5**, a high-fidelity client-side prototype was created, audited, and tested. The calculation engine, input sanitization, multi-draft LocalStorage persistence, and pre-flight validation safeguards were verified.

**Phase 2** establishes the formal discovery checklist and technical questionnaire required before connecting QuoteFlow AI to the physical MIM Windows ERP. To ensure zero risk to active commercial operations:
- **No live connections or database writes are permitted** until the administrative discovery checklist below is verified and approved by the MIM ERP System Administrator.
- The target connector architecture must operate under **strict read-only constraints**.
- The frontend prototype must continue to operate independently in demo mode using verified fallback contracts.

---

## 2. ERP Environment Fact Matrix

The table below documents what is confirmed, what is pending technical discovery, and what requires executive or administrative approval.

| Dimension | Classification | Status / Finding | Impact on Connector Design |
| :--- | :--- | :--- | :--- |
| **ERP Product & Version** | Unknown | Pending Administrator Confirmation | Dictates whether vendor APIs (REST/SOAP/gRPC), COM interop, .NET assemblies, or database views are available. |
| **Database Engine & Version** | Candidate / Unknown | Microsoft SQL Server (Candidate) / Pervasive PSQL / Proprietary ISAM | Direct database read-only views require specific SQL dialects, driver configurations (ODBC/OLE DB), and connection pooling. |
| **Host Operating System** | Candidate | Windows Server (2016 / 2019 / 2022 / Windows 10/11 Workstation) | Determines where the QuoteFlow Windows Service Agent can be hosted. |
| **Vendor Supported APIs** | Unknown | Pending Vendor Documentation | If official REST/SOAP APIs exist, they are prioritized over direct database reading. |
| **Product Master Code Uniqueness** | Confirmed Policy | Unique alphanumeric SKU (e.g. `MIM-SS-DISP-WM01`) | Primary key for catalog lookups. Case-insensitivity must be enforced in search. |
| **Product Active/Inactive Flag** | Unknown | Pending Schema Discovery | Connector must filter out obsolete or discontinued items from quotation search. |
| **Debtors Ledger Account Identifiers** | Confirmed Policy | Authoritative alphanumeric Account ID (e.g. `ACC-88219`) | Required to bind quotation to existing customer account without free-text ambiguity. |
| **General Ledger Route Policy** | Confirmed Policy | Ad-hoc recipient entry; does **not** create ERP customer records | Preserves integrity of ERP Debtors Ledger. |
| **Cost Basis Definition** | Decision Required | Unconfirmed: "Last Purchase Cost" vs. "Weighted Moving Average Cost" | Directly impacts gross margin calculation and below-cost blocking logic. |
| **Price List Hierarchy** | Unknown | Base selling price vs. customer-specific discount tiers | QuoteFlow needs to know whether customer accounts have linked price list IDs. |
| **Test Environment Availability** | Unknown | Pending Administrator Provisioning | A segregated sandbox/test ERP instance is mandatory before testing live read connectors. |

---

## 3. Detailed Discovery Categories

### Category 1: ERP Host, Version & Runtime Topology

1. **ERP Software Identity:**
   - What is the commercial name and major/minor version of the MIM Windows ERP system (e.g. Sage 50/200, SAP Business One, Microsoft Dynamics GP/NAV/Business Central, Epicor, Tally, custom proprietary WinForms/VB6/Delphi system)?
2. **Architecture Model:**
   - Is the ERP a single-tier client/server desktop application (fat client reading directly from a central database) or an $n$-tier architecture with an application server layer?
3. **Multi-Branch / Multi-Company:**
   - Does MIM operate multiple company entities or databases within the ERP (e.g., UAE Trading entity vs. JAFZA Free Zone entity)? Which company database holds authoritative customer accounts and products?

### Category 2: Database Engine & Access Boundaries

1. **Underlying Database Management System (DBMS):**
   - What database engine powers the ERP (Microsoft SQL Server, PostgreSQL, MySQL, Pervasive SQL, Sybase, SQLite, MS Access / Jet, or proprietary flat files)?
2. **Access Policy & Security Mandates:**
   - Does the ERP software vendor permit external read-only SQL connections to dedicated views or stored procedures?
   - Is there a database replication mechanism (e.g. AlwaysOn Read-Only Availability Group, Log Shipping, or Transactional Replication) that allows querying a read-only reporting replica without imposing load on live transaction processing?
3. **Database Collation & Character Encoding:**
   - What character encoding/collation is configured (e.g. `SQL_Latin1_General_CP1_CI_AS` for English, or Arabic UTF-8 / Windows-1256 support for customer names)?

### Category 3: Vendor-Supported Integration Mechanisms

1. **Supported Integration Channels:**
   - Does the ERP vendor provide an official integration SDK, COM/ActiveX interface, .NET class library, REST API, or web service layer?
2. **Vendor Certification & Warranty Constraints:**
   - Does querying database tables directly invalidate the vendor support contract or software warranty? (If yes, queries must execute strictly through vendor-approved APIs or abstracted reporting views).

### Category 4: Product Master Schema & Uniqueness Rules

1. **Product SKU Format:**
   - What is the primary key column for the product master? Is it a single string field (e.g., `ItemCode`, `StockCode`, `PartNumber`)?
   - What are the minimum and maximum lengths and character constraints (special characters, hyphens, slashes)?
2. **Product Variants & Attributes:**
   - How are variants stored (e.g., separate line items with distinct SKU codes, or a parent item with child matrix attributes)?
3. **Units of Measure (UOM):**
   - Are standard units (`PCS`, `SET`, `MTR`, `BOX`, `ROLL`) validated against a fixed UOM master table? Does the ERP support conversion factors (e.g., 1 BOX = 10 PCS)?
4. **Lifecycle & Availability Flags:**
   - What column indicates product availability (e.g., `IsActive`, `Status = 'A'`, `Discontinued = 0`)?

### Category 5: Customer Accounts & Ledger Classifications

1. **Debtors Ledger (`D` Route):**
   - What is the customer master table (e.g., `tblDebtors`, `CustomerMaster`, `AR_Customers`)?
   - What fields uniquely identify an account (e.g., `AccountCode`, `CustID`, `TRN_TaxNumber`, `CreditLimit`, `CreditTermsCode`)?
2. **General Ledger (`G` Route):**
   - For ad-hoc customers or general ledger transactions, does the ERP have a miscellaneous cash customer account (e.g. `CASH-GEN-001`), or does QuoteFlow retain GL recipient details solely inside the QuoteFlow draft document until manual posting?
3. **Payment Terms:**
   - Are standard payment terms (e.g., `30 Days Net`, `Immediate Cash`, `50% Advance`) linked to customer master records as foreign keys?

### Category 6: Pricing, Cost Baselines & Currency Rules

1. **Currency Handling:**
   - Is AED the standard base currency? If multi-currency is supported (e.g. USD, EUR, SAR), how are exchange rates updated and stored in the ERP?
2. **Authoritative Cost Field:**
   - Which cost field is the commercial standard for estimating gross margin:
     - **Last Inward Cost:** Most recent supplier invoice purchase price.
     - **Weighted Moving Average Cost (MAC):** Dynamic inventory valuation based on current warehouse stock.
     - **Standard / Replacement Cost:** Fixed engineering cost baseline reviewed quarterly.
3. **Price Lists & Tier Breaks:**
   - How are standard selling prices determined? Does the ERP support customer-level price lists (e.g. `PriceListID = 'TIER2'`) or quantity-break discounts?
4. **Historical Price Logs:**
   - Does the ERP log previous quotation or sales order prices per customer/product combination, allowing QuoteFlow to flag price variations (e.g. "Previous price: 16.00 AED")?

### Category 7: Security, Authentication & Infrastructure Boundaries

1. **Network Segmentation:**
   - Is the ERP server located on an isolated Active Directory domain or private VLAN behind internal firewalls?
   - Can the QuoteFlow web application communicate directly with a Windows Service running on the LAN, or is an HTTPS reverse proxy required?
2. **Authentication Protocol:**
   - What authentication mechanism is standard for service-to-service communication (Windows Integrated Authentication / Kerberos, API tokens, mTLS)?
3. **Audit Logging & Governance:**
   - Does the ERP require every external read operation to be logged with employee ID, timestamp, and query parameters?

---

## 4. Formal Questionnaire for MIM ERP Administrator

Please provide responses to the following 10 critical technical questions before Phase 2 integration begins:

```text
================================================================================
MIM QUOTEFLOW AI — ERP TECHNICAL DISCOVERY QUESTIONNAIRE
================================================================================

1. EXACT ERP SYSTEM IDENTITY
   - What is the exact ERP brand, version, and edition currently in production?
   - Is the software under active vendor maintenance?

2. DATABASE SPECIFICATIONS
   - What database engine and version hosts the ERP data?
   - Where is the database physically hosted (server name, on-premise hardware, Azure VM)?

3. RECOMMENDED INTEGRATION INTERFACE
   - Does the ERP provide a supported REST/SOAP API, or do external tools query
     read-only SQL Server views?
   - Is an official developer guide or schema dictionary available?

4. ISOLATED TEST ENVIRONMENT
   - Is there a dedicated test/staging ERP database containing anonymised or
     representative product and customer records?
   - Can access credentials be provisioned for testing?

5. PRODUCT MASTER SCHEMA
   - What table and columns define:
     * Product Code (SKU)
     * Full Description
     * Technical Specification / Variant
     * Unit of Measure
     * Active / Inactive Flag
     * Warehouse Stock Quantity

6. COST BASIS DEFINITION
   - Which specific field represents authoritative product cost for margin calculation:
     Last Purchase Price, Average Moving Cost, or Standard Cost?

7. CUSTOMER MASTER SCHEMA
   - What table and columns define:
     * Customer Account Code
     * Company Registered Name
     * Credit Status & Payment Terms
     * TRN (Tax Registration Number)
     * Contact Person, Email & Phone

8. NETWORK & SECURITY CONSTRAINTS
   - What IP subnet or firewall rules govern communication between application servers
     and the ERP host?
   - Will the connector authenticate via Windows Service Accounts, SQL Service Accounts,
     or API Bearer Tokens?

9. READ-ONLY USER PROVISIONING
   - Can a dedicated read-only database user (db_datareader or SELECT-only on specific
     views) or read-only API key be created specifically for QuoteFlow AI?

10. PLANNED MAINTENANCE WINDOWS & BACKUP SCHEDULES
    - At what times do nightly ERP backups, batch ledger reconciliations, or maintenance
      occur, during which external queries should be suspended?
================================================================================
```

---

## 5. Phase 2 Completion Criteria for Discovery

Before any backend code is connected to live infrastructure:
- [ ] Questionnaire returned with signatures or written approval from ERP System Administrator.
- [ ] Test ERP database environment confirmed and accessible.
- [ ] Commercial cost basis explicitly defined and verified by Sales Management.
- [ ] Read-only service credentials provisioned with zero write/modify/delete permissions.
- [ ] No production credentials stored in source control or exposed to browser clients.
