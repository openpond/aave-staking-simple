# Aave Staking (Private Tools)

A private OpenTool template that exposes two tools:

- GET-only aave-stake (scheduled default profile)
- POST-only aave-unstake (one-off with JSON body)

## Quick Start

1. **Environment**

   Notes:

   - Chain is hardcoded to `base-sepolia` in both tools.
   - USDC and Aave Pool addresses are hardcoded for Base Sepolia; no contract envs needed.
   - Fund the Turnkey wallet with Base Sepolia ETH (gas) and USDC.

2. **Install dependencies:**

   ```bash
   bun install
   ```

3. **Build the project:**

   ```bash
   npx opentool build
   ```

4. **Run the project:**

   ```bash
   npx opentool dev
   ```

5. **Test the endpoints:**

   - Default (GET) — stake tool:

     ```bash
     curl -i http://localhost:7000/aave-stake
     ```

   - One-off (POST) — unstake tool:

     ```bash
     curl -i -X POST http://localhost:7000/aave-unstake \
       -H "content-type: application/json" \
       -d '{"amount":"100","token":"USDC"}'
     ```

   Both endpoints return `204 No Content` on success.

   ```

   ```
