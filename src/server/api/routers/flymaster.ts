import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { getFlymasterServerTime } from "@/utils/getFlymasterServerTime";
import { z } from "zod";

export const flymasterRouter = createTRPCRouter({
  position: publicProcedure
    .input(
      z.object({
        groupId: z.string(),
        trackerSerial: z.string(),
      })
    )
    .query(async ({ input }) => {
      const position = await getFlymasterPosition(
        input.groupId,
        input.trackerSerial
      );

      return position;
    }),
});

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
    string?
  ][];
}

const getFlymasterPosition = async (group: string, tracker: string) => {
  console.log("🚀 ~ Fetching flymaster position for pilot:", tracker);

  const serverTime = await getFlymasterServerTime(group);

  const url = `https://lt.flymaster.net/json/GROUPS/${group}/${roundTimeToHour(
    serverTime
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
