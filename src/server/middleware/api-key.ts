import { type NextApiRequest } from "next";
import { env } from "@/env.mjs";

export function apiKeyIsValid(req: NextApiRequest) {
  const { authorization } = req.headers;

  return authorization === env.API_KEY;
}
