import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { load } from "cheerio";

export const pwcRouter = createTRPCRouter({
  position: publicProcedure
    .input(
      z.object({
        pilotNumber: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const position = await getPilotPosition(input.pilotNumber);

      return position;
    }),
});

const getPilotPosition = async (pilotNumber: string) => {
  const liveResultUrl = await getPwcLiveResultsUrl();

  if (!liveResultUrl) return;

  const response = await fetch(liveResultUrl);
  const html = await response.text();
  const $ = load(html);

  const table = $("table.result").eq(1);

  const tablehead = table.find("th");
  const tableRows = table.find("tr");

  let indexOfTotalPointsHeader = -1;

  tablehead.each((index, element) => {
    const headerContent = $(element).text();
    if (headerContent.trim().toLowerCase() === "totalpoints") {
      indexOfTotalPointsHeader = index;
      return false;
    }
  });

  const data = tableRows.filter((_, el) => {
    const secondTdContent = $(el).find("td:nth-child(2)").text();
    return secondTdContent.trim() === pilotNumber.toString();
  });

  const position = $(data).find("td:nth-child(1)").text();
  const score = $(data)
    .find(`td:nth-child(${indexOfTotalPointsHeader + 1})`)
    .text();
  return { position, score };
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
