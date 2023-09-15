import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { jsonrepair } from "jsonrepair";

import { z } from "zod";

export const flyeventRouter = createTRPCRouter({
  list: publicProcedure.query(async () => {
    return await getFlyeventGroups();
  }),
  pilots: publicProcedure
    .input(z.object({ groupId: z.number().optional() }))
    .query(async ({ input }) => {
      if (!input.groupId) return;
      const pilots = await getPilotsFromGroupId(input.groupId);
      if (!pilots) return;

      pilots.sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
      );

      return pilots;
    }),
  position: publicProcedure
    .input(
      z.object({
        groupId: z.string(),
        pilotId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const position = await getPilotPosition(input.groupId, input.pilotId);

      return position;
    }),
});

interface FlyeventGroups {
  activeComps: Group[];
}

interface Group {
  id: string;
  name: string;
}

const getFlyeventGroups = async () => {
  try {
    const res = await fetch("https://race.airtribune.com/active_comps.json");
    const body = (await res.json()) as FlyeventGroups;
    return body.activeComps;
  } catch (error) {
    console.error(error);
  }
};

const getPilotsFromGroupId = async (groupId: number) => {
  try {
    const url = `https://race.airtribune.com/${groupId}/feed_live.json`;
    const res = await fetch(url + "?" + new Date().getTime().toString(), {
      cache: "no-store",
    });

    // Repair JSON as it might be invalid and crash during parsing.
    const string = await res.text();
    const repairedJson = jsonrepair(string);
    const data = JSON.parse(repairedJson) as unknown;

    // Simple check if data looks like expected
    if (!Array.isArray(data)) throw "Live data is not looking plausible";

    const pilots: { name: string; id: number }[] = data
      .slice(3)
      .flatMap((el) => {
        if (!Array.isArray(el)) return [];
        const unwrap = el[0] as string[];
        const rawName = unwrap[3];
        const rawId = unwrap[2];
        if (!rawName || !rawId) return [];

        const idAsNumber = parseInt(rawId, 10);

        return [
          {
            name: formatName(rawName.replaceAll("_", " ")),
            id: idAsNumber,
          },
        ];
      });

    return pilots;
  } catch (error) {
    console.log(error);
  }
};

const getPilotPosition = async (groupId: string, pilotId: string) => {
  const url = `https://race.airtribune.com/${groupId}/feed_live.json`;
  const res = await fetch(url + "?" + new Date().getTime().toString(), {
    cache: "no-store",
  });

  // Repair JSON as it might be invalid and crash during parsing.
  const string = await res.text();
  const repairedJson = jsonrepair(string);
  const data = JSON.parse(repairedJson) as string[][][];

  // Simple check if data looks like expected
  if (!Array.isArray(data)) throw "Live data is not looking plausible";

  const pilots = data.slice(3).filter((el) => {
    if (!Array.isArray(el)) return;
    if (!Array.isArray(el[0])) return;
    return el[0][2] == pilotId?.padStart(4, "0");
  });

  if (!Array.isArray(pilots)) return;
  if (!Array.isArray(pilots[0])) return;
  const pilot = pilots[0][0];
  if (!pilot) return;
  const position = pilot[1];
  if (!position) return;
  const score = pilot[24];

  return { position, score };
};

export function formatName(text: string): string {
  const words = text.toLowerCase().split(" ");
  const capitalizedWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  const capitalizedText = capitalizedWords.join(" ");

  return capitalizedText;
}
