import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { getFlymasterServerTime } from "@/utils/getFlymasterServerTime";
import { z } from "zod";

export const compRouter = createTRPCRouter({
  list: publicProcedure.query(async () => {
    return await getFlymasterGroups();
  }),
  pilots: publicProcedure
    .input(z.object({ groupId: z.number().optional() }))
    .query(async ({ input }) => {
      if (!input.groupId) return;
      const pilots = await getPilotsFromGroupId(input.groupId);
      pilots.sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );

      return pilots;
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
