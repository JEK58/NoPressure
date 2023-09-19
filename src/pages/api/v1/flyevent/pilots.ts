import type { NextApiRequest, NextApiResponse } from "next";
import { getPilotsFromGroupId } from "@/server/api/routers/flyevent";
import { z } from "zod";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { groupId } = req.query;
    // Define a schema for groupId validation
    const schema = z.object({ groupId: z.number() });

    // Validate the groupId parameter
    schema.parse({ groupId });

    const pilots = await getPilotsFromGroupId(groupId);
    if (!pilots) throw new Error("Failed to load data");

    res.status(200).json({ groupId });
  } catch (err) {
    res.status(400).json({ error: "Invalid input: groupId must be a number" });
  }
}
