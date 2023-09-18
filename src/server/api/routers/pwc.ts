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
const getPilotPosition = async (pilotNumber: string) => {
  interface Entry {
    position: string;
    score: string;
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

  const table = $("table.result").eq(1);

  const tablehead = table.find("th");
  const tableRows = table.find("tr");

  // Find the "total points" column in the table.
  // The number of columns changes depending on the state of the task
  let indexOfTotalPointsHeader = -1;

  tablehead.each((index, element) => {
    const headerContent = $(element).text();
    if (headerContent.trim().toLowerCase() === "totalpoints") {
      indexOfTotalPointsHeader = index;
      return false;
    }
  });

  const scores = new Map<string, Entry>();

  for (const el of tableRows) {
    const id = $(el).find("td:nth-child(2)").text();
    const position = $(el).find("td:nth-child(1)").text();
    const score = $(el)
      .find(`td:nth-child(${indexOfTotalPointsHeader + 1})`)
      .text();
    if (!id) continue;

    scores.set(id, { position, score });
  }
  try {
    // Convert map to JSON and save to cache
    const mapToArray: kvEntry = Array.from(scores);
    const json = JSON.stringify(mapToArray);

    await kv.set("pwc", json, { ex: TTL });
  } catch (error) {
    console.error(error);
  }

  return scores.get(pilotNumber.toString()) ?? { position: "?" };
};

async function getPwcLiveResultsUrl() {
  const resultUrl = "https://pwca.events/pwca-live-results/";
  const res = await fetch(`https://corsproxy.io/?${resultUrl}`);
  const content = await res.text();
  const $ = load(content);

  const iframe = $('iframe[name="livescores"]');
  const src = iframe.attr("src");

  return src;
}
