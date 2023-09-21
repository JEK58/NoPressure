import type { NextApiRequest, NextApiResponse } from "next";
import { getPilotPosition } from "@/server/api/routers/flyevent";
import { z } from "zod";
import { apiKeyIsValid } from "@/server/middleware/api-key";

export const querySchema = z.object({
  groupId: z.string(),
  pilotId: z.string(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!apiKeyIsValid(req))
    return res.status(401).json({ error: "Unauthorized" });

  try {
    const queryParams = querySchema.parse(req.query);
    const { pilotId, groupId } = queryParams;

    // Check if groupId is a valid number (in string format)
    if (!/^\d+$/.test(pilotId) || !/^\d+$/.test(groupId)) {
      res.status(400).json({
        error: "groupId and pilotId must be a valid number (in string format)",
      });
    }

    const position = await getPilotPosition(groupId, pilotId);
    if (!position) throw new Error("Failed to load data");

    res.status(200).json(position);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
