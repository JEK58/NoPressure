import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { getFlymasterServerTime } from "@/utils/getFlymasterServerTime";
import { z } from "zod";

export const flymasterRouter = createTRPCRouter({
  list: publicProcedure.query(async () => {
    return await getFlymasterGroups();
  }),
  pilots: publicProcedure
    .input(z.object({ groupId: z.number().optional() }))
    .query(async ({ input }) => {
      if (!input.groupId) return;
      const pilots = await getPilotsFromGroupId(input.groupId);
      pilots.sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
      );

      return pilots;
    }),
  position: publicProcedure
    .input(
      z.object({
        groupId: z.string(),
        trackerSerial: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const position = await getFlymasterPosition(
        input.groupId,
        input.trackerSerial,
      );

      return position;
    }),
});

export interface FlymasterGroups {
  groups: Group[];
  rcode?: number;
}

export interface Group {
  id: string;
  group_name: string;
}

const getFlymasterGroups = async () => {
  try {
    const res = await fetch("https://lb.flymaster.net/bsBrowsableGroups.php");
    const body = (await res.json()) as FlymasterGroups;
    return body.groups;
  } catch (error) {}
};

interface FlymasterGroupResponse {
  plist: FlymasterPilot[];
}

interface FlymasterPilot {
  sn: string;
  nm: string;
}

interface Pilot {
  id: number;
  name: string;
}

export async function getPilotsFromGroupId(groupId: number) {
  const fmTime = await getFlymasterServerTime(groupId);
  const fmGroupUrl = `https://lb.flymaster.net/getlivedatam.php?grp=${groupId}&d=${fmTime}&plist=1`;

  const res = await fetch(fmGroupUrl);
  if (!res) throw new Error("No pilot response from flymaster server");

  const body = (await res.json()) as FlymasterGroupResponse;

  const pilots: Pilot[] = [];

  body.plist.forEach((el) => {
    pilots.push({ id: parseInt(el.sn), name: el.nm });
  });

  return pilots;
}

interface FlymasterGroupResponse {
  aaData?: [
    string?,
    number?,
    string?,
    string?,
    string?,
    string?,
    string?,
    string?,
    string?,
    string?,
    string?,
    string?,
  ][];
}

const getFlymasterPosition = async (group: string, tracker: string) => {
  console.log("🚀 ~ Fetching flymaster position for pilot:", tracker);

  const serverTime = await getFlymasterServerTime(group);

  const url = `https://lt.flymaster.net/json/GROUPS/${group}/${roundTimeToHour(
    serverTime,
  )}/rnk${roundTimeToMinute(serverTime)}.json`;

  const res = await fetch(url);
  const data = (await res.json()) as FlymasterGroupResponse;

  return getPilotRanking(tracker, data);
};

function roundTimeToHour(serverTime: number): number {
  return 3600 * Math.floor(serverTime / 3600);
}

function roundTimeToMinute(serverTime: number): number {
  return 60 * Math.floor(serverTime / 60);
}

function getPilotRanking(serial: string, data: FlymasterGroupResponse) {
  try {
    const pilotData = data.aaData?.find((el) => el[0] == serial);

    if (!pilotData) return "?";
    const rank = pilotData[1];
    return rank;
  } catch (error) {
    console.log(error);

    return "?";
  }
}
