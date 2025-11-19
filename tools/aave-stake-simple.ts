import { z } from "zod";

export const profile = {
  description: "One-off stake utility that accepts an amount",
};

export const schema = z.object({
  amount: z
    .string()
    .min(1, "amount is required")
    .refine((v) => /^\d+(?:\.\d+)?$/.test(v), "amount must be a number string"),
  // Optional note to label the run
  note: z.string().optional(),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { amount, note } = schema.parse(body);

  // This simple version does not execute an on-chain stake.
  // It validates input and returns a structured response that your scheduler/runner can consume.
  // To implement real staking later, import wallet helpers from 'opentool/wallet' and call the Aave staking contract.

  return Response.json({ ok: true, action: "stake", amount, note });
}
