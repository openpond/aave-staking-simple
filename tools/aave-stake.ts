// GET-only scheduled staking tool using OpenTool wallet + Aave V3 Pool
import { wallet } from "opentool/wallet";
import { parseUnits } from "viem";

const ERC20_ABI = [
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "decimals",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
  },
];

const AAVE_POOL_ABI = [
  {
    type: "function",
    name: "supply",
    stateMutability: "nonpayable",
    inputs: [
      { name: "asset", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "onBehalfOf", type: "address" },
      { name: "referralCode", type: "uint16" },
    ],
    outputs: [],
  },
];

export const profile = {
  description: "Stake 100 USDC daily at 12:00 UTC",
  fixedAmount: "100",
  tokenSymbol: "USDC",
  schedule: { cron: "0 12 * * *", enabled: true },
  limits: { concurrency: 1, dailyCap: 1 },
};

export async function GET(_req: Request) {
  const ctx = await wallet({
    chain: "base-sepolia",
    apiKey: process.env.ALCHEMY_API_KEY,
    rpcUrl: process.env.RPC_URL,
    turnkey: {
      organizationId: process.env.TURNKEY_SUBORG_ID!,
      apiPublicKey: process.env.TURNKEY_API_PUBLIC_KEY!,
      apiPrivateKey: process.env.TURNKEY_API_PRIVATE_KEY!,
      signWith: process.env.TURNKEY_WALLET_ADDRESS!,
      apiBaseUrl: process.env.TURNKEY_API_BASE_URL,
    },
  });

  const AAVE_POOL = "0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951" as `0x${string}`; // Base Sepolia Pool
  const TOKEN_ADDRESS = "0xba50cd2a20f6da35d788639e581bca8d0b5d4d5f" as `0x${string}`; // Base Sepolia USDC
  const amountUnits = parseUnits(profile.fixedAmount, 6);

  // 1) Approve pool to spend USDC
  const approveHash = await ctx.walletClient.writeContract({
    address: TOKEN_ADDRESS,
    abi: ERC20_ABI as any,
    functionName: "approve",
    args: [AAVE_POOL, amountUnits],
    account: ctx.account,
  });

  // 2) Supply to Aave Pool
  const supplyHash = await ctx.walletClient.writeContract({
    address: AAVE_POOL,
    abi: AAVE_POOL_ABI as any,
    functionName: "supply",
    args: [TOKEN_ADDRESS, amountUnits, ctx.address, 0],
    account: ctx.account,
  });

  // No content response (intentionally empty)
  return new Response(null, { status: 204 });
}
