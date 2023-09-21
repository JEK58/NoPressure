import type { NextApiRequest, NextApiResponse } from "next";
import { getPilotPosition } from "@/server/api/routers/pwc";
import { z } from "zod";

export const querySchema = z.object({
  pilotId: z.string(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const queryParams = querySchema.parse(req.query);
    const { pilotId } = queryParams;

    // Check if groupId is a valid number (in string format)
    if (!/^\d+$/.test(pilotId)) {
      res.status(400).json({
        error: "groupId and pilotId must be a valid number (in string format)",
      });
    }

    const position = await getPilotPosition(pilotId);
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
