# MIM QuoteFlow AI — ERP Connector Security Model & Operational Guardrails

**Document Reference:** `docs/phase-2/ERP_SECURITY_MODEL.md`  
**Phase:** Phase 2 — Read-Only ERP Connector Specification  
**Classification:** Internal Confidential / Security Architecture  
**Status:** DRAFT — Security & Compliance Blueprint

---

## 1. Security Architecture Principles

The integration between MIM QuoteFlow AI and the on-premise MIM Windows ERP enforces a **Zero-Trust, Defense-in-Depth** model designed to protect production ERP integrity, customer commercial data, and internal margin structures.

### The Five Non-Negotiable Tenets:
1. **Absolute Read-Only Enforcement:** No process, API, or credential in Phase 2 has write, insert, update, delete, or schema-alter permissions in the ERP database.
2. **No Direct Browser-to-Database Connectivity:** The web browser client runs strictly sandboxed in the user's browser. It communicates solely over HTTPS with the internal QuoteFlow Bridge Agent.
3. **Prohibition of Arbitrary SQL / AI SQL:** The connector exposes strictly parameterized, whitelisted query contracts. Under no circumstances will AI prompts or browser inputs be transformed into dynamic SQL or executed via an open database proxy.
4. **Data Minimization & Sanitization:** Diagnostic endpoints, logs, and API responses never expose database connection strings, passwords, server hostnames, internal table schemas, or unmasked sensitive customer PII.
5. **Fail-Closed Availability:** If security credentials fail, network connections time out, or data fails schema validation, the system fails closed safely preserving local drafts without corrupting ERP state.

---

## 2. Service Identity & Least-Privilege Access Control

```mermaid
flowchart TD
    subgraph Browser["User Browser (Client)"]
        QF["QuoteFlow AI Frontend"]
        Token["Bearer Token (Short-lived JWT)"]
    end

    subgraph DMZ["Internal Secure Boundary"]
        Bridge["QuoteFlow Bridge Agent (Windows Service)"]
        Vault["Windows DPAPI / Protected Config"]
    end

    subgraph ERP["On-Premise ERP Infrastructure"]
        SQL["ERP Database Engine"]
        Views["SCHEMA: quoteflow_ro\nv_products_search\nv_debtors_lookup\nv_pricing_costing"]
    end

    QF -->|HTTPS / JWT / Correlation ID| Bridge
    Vault -->|Encrypted Read-Only DB Creds| Bridge
    Bridge -->|Parameterized SP / View Queries| Views
    Views -->|Read-Only Execution (db_datareader restricted)| SQL
```

### 2.1 ERP Database Account Constraints
The database user account provisioned for the QuoteFlow Bridge Agent must adhere to strict least-privilege standards:
- **Username:** `svc_quoteflow_ro`
- **Database Server Role:** Explicitly denied `sysadmin`, `serveradmin`, `securityadmin`, `dbcreator`.
- **Database Role:** Granted membership **only** in a custom role `db_quoteflow_readonly`.
- **Object-Level Permissions:**
  - `GRANT SELECT ON SCHEMA::quoteflow_ro TO svc_quoteflow_ro;`
  - Explicit `DENY INSERT, UPDATE, DELETE, ALTER, DROP, EXECUTE ON SCHEMA::dbo TO svc_quoteflow_ro;`
- **View-Level Abstraction:**
  Rather than querying base tables (`tbl_ItemMaster`, `tbl_Customer`), the database administrator must provision a dedicated view schema (`quoteflow_ro`):
  - `quoteflow_ro.v_products_search`
  - `quoteflow_ro.v_debtors_lookup`
  - `quoteflow_ro.v_pricing_costing`

### 2.2 Application Service Identity
- The Bridge Agent runs under a dedicated Windows Managed Service Account (gMSA): `DOMAIN\svc_quoteflow_bridge$`.
- Does not run as `NT AUTHORITY\SYSTEM` or local administrator.
- Permissions restricted to:
  - Binding to designated internal port (`https://+:8443/api/v1/erp`).
  - Read access to local Windows DPAPI certificate store.
  - Append-only write access to local audit log directory.

---

## 3. Secret Management & Credential Isolation

1. **Zero Credentials in Git / Codebase:**
   - No database passwords, JWT signing secrets, API tokens, or server IP addresses are permitted in source repositories or client bundles.
   - Verified via pre-commit secret scanners (Gitleaks, Trufflehog).
2. **On-Premise Secret Storage:**
   - Database credentials for the Bridge Agent are stored in `appsettings.Production.json` encrypted using **Windows Data Protection API (DPAPI)** machine-level keys, accessible only to `svc_quoteflow_bridge$`.
   - In containerized staging environments, credentials are injected via secure environment variables (`ERP_DB_CONNECTION_STRING`) through Kubernetes/Docker secrets.
3. **Transport Secret Rotation:**
   - Bridge Agent TLS certificates must use corporate internal PKI, renewed annually.
   - JWT signing keys rotated every 90 days with automated key rolling.

---

## 4. Transport Security & Network Segmentation

| Communication Segment | Protocol | Cipher / Standards | Network Access Rules |
| :--- | :--- | :--- | :--- |
| **Browser Client ➔ Bridge Agent** | HTTPS / TLS 1.3 | AES-256-GCM / ChaCha20-Poly1305 | Internal Corporate LAN / VPN only (Port 8443). Public internet access blocked by enterprise firewall. |
| **Bridge Agent ➔ ERP Database** | Encrypted TDS / Net-SQL | TLS 1.2+ (`TrustServerCertificate=false`) | Isolated VLAN segment (Port 1433 / vendor port). Firewall restricts inbound SQL to Bridge Agent IP only. |
| **Bridge Agent ➔ Identity Provider** | HTTPS | OAuth 2.0 / OpenID Connect | Internal Active Directory Federation Services (ADFS) or Azure AD. |

---

## 5. Audit Logging & SIEM Integration

Every interaction across the read-only connector is recorded in an append-only JSON audit log for regulatory compliance and security analysis.

### 5.1 Log Record Schema:
```json
{
  "timestamp": "2026-10-29T10:45:00.124Z",
  "event_type": "ERP_READ_QUERY",
  "request_id": "c8b4b7a1-893e-4d82-bf76-92135678abcd",
  "user_id": "usr_karim_alshami",
  "client_ip": "10.240.12.85",
  "endpoint": "/api/v1/erp/products/search",
  "parameters": {
    "query": "CBL-4C-016",
    "category": "CABLES"
  },
  "execution_metrics": {
    "db_query_time_ms": 18,
    "total_latency_ms": 32,
    "records_returned": 2
  },
  "status": "SUCCESS"
}
```

### 5.2 Sanitization & Privacy Controls:
- **Redaction Rules:** Passwords, connection strings, session tokens, and customer bank details are strictly redacted (`[REDACTED]`).
- **Log Retention:** Local log files rotated daily, compressed, and forwarded to central SIEM with 1-year retention.
- **Tamper Evidence:** Append-only file system ACLs prevent standard users from modifying or deleting logs.

---

## 6. Operational Guardrails: Rate Limits & Timeouts

To prevent the AI workspace or concurrent users from degrading production ERP performance:

1. **Request Rate Limiting:**
   - Maximum **10 requests per second** per authenticated user.
   - Maximum **100 requests per second** global connector throughput.
   - Excess queries receive `HTTP 429 Too Many Requests` with `Retry-After: 5` header.
2. **Strict Timeouts:**
   - Maximum ERP database query timeout: **3000ms**.
   - Total HTTP request timeout: **5000ms**.
   - Connector cancels long-running queries (`CancellationToken`) to free up database worker threads.
3. **Query Pagination Limits:**
   - Maximum page size enforced at **50 records** for product searches, **30 records** for customer searches. Unbounded queries (`SELECT *`) are architecturally prohibited.

---

## 7. Development vs. Staging vs. Production Profiles

| Security Control | Development / Local | Staging / Test ERP | Production Live ERP |
| :--- | :--- | :--- | :--- |
| **Data Source** | In-Memory Mock Adapter | Standalone Test ERP Database Replica | Production ERP Read-Only View Replica |
| **Authentication** | Mock Developer JWT | Corporate Staging SSO | Production Enterprise SSO / MFA |
| **TLS Enforcement** | Self-signed localhost | Internal CA Signed Certificate | Internal CA Signed Certificate |
| **Data Sanitization** | Synthetic Data Only | Masked/Scrambled Customer Data | Live Authoritative Records (Read-Only) |
| **Allowed IP Subnets** | `127.0.0.1` | Corporate Test Subnet (`10.240.x.x`) | Locked to Bridge Agent Host IP |
| **Write Permissions** | Blocked | Blocked | **Strictly Forbidden & Blocked at DDL Level** |
