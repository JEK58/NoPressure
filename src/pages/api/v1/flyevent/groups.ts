import type { NextApiRequest, NextApiResponse } from "next";
import { getFlyeventGroups } from "@/server/api/routers/flyevent";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const groups = await getFlyeventGroups();
    if (!groups) throw new Error("Failed to load data");

    res.status(200).json({ groups });
  } catch (err) {
    res.status(500).json({ error: "failed to load data" });
  }
}
