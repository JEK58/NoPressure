import type { NextApiRequest, NextApiResponse } from "next";
import { getFlyeventGroups } from "@/server/api/routers/flyevent";
import { getFlymasterGroups } from "@/server/api/routers/flymaster";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const [flyevent, flymaster] = await Promise.all([
      getFlyeventGroups(),
      getFlymasterGroups(),
    ]);

    const comps = [
      {
        name: "Flyevent / SRS",
        endpoint: "/flyevent",
        comps: flyevent,
      },
      {
        name: "Flymaster",
        endpoint: "/flymaster",
        comps: flymaster,
      },
      {
        name: "PWC",
        endpoint: "/pwc",
      },
    ];
    res.status(200).json(comps);
  } catch (err) {
    res.status(500).json({ error: "failed to load data" });
  }
}
