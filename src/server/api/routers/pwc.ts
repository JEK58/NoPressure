import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { load } from "cheerio";
import { kv } from "@vercel/kv";

export const pwcRouter = createTRPCRouter({
  position: publicProcedure
    .input(
      z.object({
        pilotNumber: z.string(),
      }),
    )
    .query(async ({ input }) => await getPilotPosition(input.pilotNumber)),
});

// Check if pilot number exists in cache. If not, scrape the PWC page and save scores to cache.
export const getPilotPosition = async (pilotNumber: string) => {
  interface Entry {
    position: string;
    leadingPoints: string;
  }

  type kvEntry = [string, Entry][];
  const TTL = 60; // 1 minute for KV store
  try {
    const kvScores = await kv.get<kvEntry>("pwc");
    if (kvScores) {
      const scores = new Map(kvScores);
      const score = scores.get(pilotNumber);

      if (score) return score;
    }
  } catch (error) {
    console.error(error);
  }

  console.log("No cached values available, scraping PWC results...");

  const liveResultUrl = await getPwcLiveResultsUrl();

  if (!liveResultUrl) return;

  const response = await fetch(liveResultUrl);
  const html = await response.text();
  const $ = load(html);

  // Filter out the Alerts table that only appears if there are alerts
  $('div > h2:contains("Alerts")').each((_, element) => {
    const parentDiv = element.parent;
    if (parentDiv) $(parentDiv).remove();
  });

  const table = $("table.result").eq(1);

  const tablehead = table.find("th");
  const tableRows = table.find("tr");

  // Find the "leading points" column in the table.
  // The number of columns changes depending on the state of the task
  let indexOfTotalPointsHeader = -1;

  tablehead.each((index, element) => {
    const headerContent = $(element).text();
    if (headerContent.trim().toLowerCase() === "lead.points") {
      indexOfTotalPointsHeader = index;
      return false;
    }
  });

  const allLeadingPoints = new Map<string, Entry>();

  for (const el of tableRows) {
    const id = $(el).find("td:nth-child(2)").text();
    const position = $(el).find("td:nth-child(1)").text();
    const leadingPoints = $(el)
      .find(`td:nth-child(${indexOfTotalPointsHeader + 1})`)
      .text();
    if (!id) continue;

    allLeadingPoints.set(id, { position, leadingPoints });
  }
  try {
    // Convert map to JSON and save to cache
    const mapToArray: kvEntry = Array.from(allLeadingPoints);
    const json = JSON.stringify(mapToArray);

    await kv.set("pwc", json, { ex: TTL });
  } catch (error) {
    console.error(error);
  }

  return allLeadingPoints.get(pilotNumber.toString()) ?? { position: "?" };
};

async function getPwcLiveResultsUrl() {
  const resultUrl = "https://pwca.events/pwca-live-results/";
  const res = await fetch(resultUrl);
  const content = await res.text();
  const $ = load(content);

  const iframe = $('iframe[name="livescores"]');
  const src = iframe.attr("src");

  return src;
}
