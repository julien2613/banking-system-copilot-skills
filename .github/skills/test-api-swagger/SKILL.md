---
name: test-api-swagger
description: "Test REST API endpoints discovered from the Swagger/OpenAPI specification using the MCP OpenAPI server. Use this skill when the user wants to test API endpoints, validate authentication flows, check error handling, or run a comprehensive API test suite against a running backend."
---

# API Testing via Swagger/OpenAPI with MCP OpenAPI Server

You are a senior API test engineer. Test all REST API endpoints of a Spring Boot banking application by calling them through the MCP OpenAPI server, which auto-discovers endpoints from the Swagger/OpenAPI specification.

## Prerequisites

- The backend API must be running at `http://localhost:8081/api` (or ask the user for the URL)
- The Swagger spec must be available at `http://localhost:8081/api/v3/api-docs`
- If either URL is not reachable, inform the user and stop

## Setup

```bash
mkdir -p test-reports
```

## How it works

The MCP OpenAPI server (`@ivotoby/openapi-mcp-server`) reads the Swagger/OpenAPI spec and exposes **each API endpoint as an MCP tool**. You call these tools directly instead of using `curl` or `fetch`.

For example, if the spec defines `POST /auth/login`, the MCP server creates a tool you can call with the request body as parameters.

## Instructions

### Step 1 — Discover available API tools

1. Fetch the Swagger spec at `http://localhost:8081/api/v3/api-docs`
2. Parse the JSON response to list all available endpoints:
   - `POST /auth/register` — Register a new user
   - `POST /auth/login` — Login and get JWT token
   - `POST /transactions/transfer` — Transfer money
   - `GET /transactions` — Get transaction history
   - `GET /api/users/me` — Get current user info
   - `GET /api/users` — Get all users (Admin only)
   - `GET /api/users/{userId}` — Get user by ID (Admin only)
   - `GET /api/users/balance` — Get account balance
3. Document any additional endpoints discovered from the spec

### Step 2 — Test Authentication endpoints

**Test 2a — Register a new user:**
Call the register endpoint via the MCP OpenAPI tool with:
```json
{
  "name": "Test API User",
  "email": "apitest@bank.com",
  "password": "SecurePass123"
}
```
- Expected: 200/201 with user data
- Record the response

**Test 2b — Register with duplicate email (negative test):**
Call register again with the same email `apitest@bank.com`
- Expected: 400/409 error (email already exists)

**Test 2c — Login with valid credentials:**
Call the login endpoint with:
```json
{
  "email": "apitest@bank.com",
  "password": "SecurePass123"
}
```
- Expected: 200 with JWT token in response
- **Save the JWT token** — you will need it for authenticated requests

**Test 2d — Login with invalid credentials:**
Call login with:
```json
{
  "email": "apitest@bank.com",
  "password": "wrongpassword"
}
```
- Expected: 401 Unauthorized

### Step 3 — Test User endpoints (authenticated)

> **Note**: For authenticated endpoints, include the JWT token from Test 2c as `Authorization: Bearer <token>` header.

**Test 3a — Get current user info:**
Call `GET /api/users/me` with the JWT token
- Expected: 200 with user data matching the registered user

**Test 3b — Get account balance:**
Call `GET /api/users/balance` with the JWT token
- Expected: 200 with balance value (should be the initial balance)

**Test 3c — Get all users without admin role (negative test):**
Call `GET /api/users` with the regular user JWT token
- Expected: 403 Forbidden (requires ADMIN role)

### Step 4 — Test Transaction endpoints (authenticated)

**Test 4a — Transfer money:**
Call `POST /transactions/transfer` with the JWT token and:
```json
{
  "toAccountNumber": "<recipient_account>",
  "amount": 100.00,
  "description": "API test transfer"
}
```
- Expected: 200 with transaction confirmation
- Note: You may need to create a second user first to have a valid recipient

**Test 4b — Transfer with insufficient funds (negative test):**
Call transfer with an amount exceeding the balance:
```json
{
  "toAccountNumber": "<recipient_account>",
  "amount": 999999999.00,
  "description": "Should fail - insufficient funds"
}
```
- Expected: 400 error (insufficient funds)

**Test 4c — Get transaction history:**
Call `GET /transactions` with the JWT token
- Expected: 200 with paginated list containing the transfer from Test 4a

### Step 5 — Test Admin endpoints

**Login as admin:**
Call login with admin credentials:
```json
{
  "email": "admin@bank.com",
  "password": "admin123"
}
```
- Save the admin JWT token

**Test 5a — Get all users (admin):**
Call `GET /api/users` with the admin JWT token
- Expected: 200 with list of all users

**Test 5b — Get user by ID (admin):**
Call `GET /api/users/{userId}` with a valid user ID from Test 5a
- Expected: 200 with user data

### Step 6 — Test edge cases

**Test 6a — Call authenticated endpoint without token:**
Call `GET /api/users/me` without any Authorization header
- Expected: 401 Unauthorized

**Test 6b — Register with invalid email format:**
```json
{
  "name": "Bad Email",
  "email": "not-an-email",
  "password": "password123"
}
```
- Expected: 400 Bad Request with validation error

**Test 6c — Transfer with negative amount:**
```json
{
  "toAccountNumber": "<recipient_account>",
  "amount": -50.00,
  "description": "Negative amount test"
}
```
- Expected: 400 Bad Request

## Output

Write the report to `test-reports/api-swagger-report.md`:

### API Test Results

| # | Endpoint | Method | Test Case | Input | Expected | Actual | Status |
|---|----------|--------|-----------|-------|----------|--------|--------|
| 2a | /auth/register | POST | Valid registration | valid data | 200/201 | ... | Pass/Fail |
| 2b | /auth/register | POST | Duplicate email | same email | 400/409 | ... | Pass/Fail |
| 2c | /auth/login | POST | Valid login | valid creds | 200 + JWT | ... | Pass/Fail |
| 2d | /auth/login | POST | Invalid password | wrong pass | 401 | ... | Pass/Fail |
| 3a | /api/users/me | GET | Get current user | JWT token | 200 | ... | Pass/Fail |
| 3b | /api/users/balance | GET | Get balance | JWT token | 200 | ... | Pass/Fail |
| 3c | /api/users | GET | Non-admin access | user JWT | 403 | ... | Pass/Fail |
| 4a | /transactions/transfer | POST | Valid transfer | amount + recipient | 200 | ... | Pass/Fail |
| 4b | /transactions/transfer | POST | Insufficient funds | huge amount | 400 | ... | Pass/Fail |
| 4c | /transactions | GET | Transaction history | JWT token | 200 + list | ... | Pass/Fail |
| 5a | /api/users | GET | Admin get all users | admin JWT | 200 | ... | Pass/Fail |
| 5b | /api/users/{id} | GET | Admin get user by ID | admin JWT + ID | 200 | ... | Pass/Fail |
| 6a | /api/users/me | GET | No auth token | none | 401 | ... | Pass/Fail |
| 6b | /auth/register | POST | Invalid email | bad format | 400 | ... | Pass/Fail |
| 6c | /transactions/transfer | POST | Negative amount | -50 | 400 | ... | Pass/Fail |

### Summary
- Swagger spec URL: `http://localhost:8081/api/v3/api-docs`
- Total endpoints discovered: X
- Total test cases: 15
- Passed: X / Failed: Y
- Critical issues found: (list)
- Security observations: (auth bypass, missing validation, etc.)

> **Tip**: Run the `publish-reports` skill to publish this report to GitHub Pages.
