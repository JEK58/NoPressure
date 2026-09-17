import { load } from "cheerio";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const FLYMASTER_RESULTS_TEST_GROUP_ID = "7800";
export const FLYMASTER_RESULTS_TEST_PILOT_ID = "666";

interface FlymasterResultsPosition {
  position: number | string;
  leadingPercentage?: number;
}

interface Task {
  id: string;
  date: string;
  index: number;
}

const noData = { position: "?" } as const;

export const flymasterResultsRouter = createTRPCRouter({
  position: publicProcedure
    .input(
      z
        .object({
          groupId: z.string().regex(/^\d+$/),
          pilotId: z.string().regex(/^\d+$/),
          taskId: z.string().regex(/^\d+$/).optional(),
        })
        .optional(),
    )
    .query(async ({ input }) =>
      getFlymasterResultsPosition(
        input?.groupId ?? FLYMASTER_RESULTS_TEST_GROUP_ID,
        input?.pilotId ?? FLYMASTER_RESULTS_TEST_PILOT_ID,
        input?.taskId,
      ),
    ),
});

/**
 * Returns the newest non-training task from a Flymaster competition front page.
 * The page currently lists tasks in chronological order, but dates are used when
 * present so the selection remains correct if that presentation changes.
 */
export function getLatestScoredTaskId(html: string): string | undefined {
  const $ = load(html);
  const tasks: Task[] = [];

  $(".task-card").each((index, element) => {
    const name = $(element).find(".task-name").first().text().trim();
    if (!name || /training/i.test(name)) return;

    const url = $(element)
      .find("a.js-results-link[data-base-url]")
      .first()
      .attr("data-base-url");
    if (!url) return;

    const taskId = new URL(url, "https://lt.flymaster.net/").searchParams.get(
      "taskId",
    );
    if (!taskId) return;

    tasks.push({
      id: taskId,
      date: $(element).find(".task-date").first().text().trim(),
      index,
    });
  });

  return tasks.sort((a, b) => {
    const aDate = Date.parse(a.date);
    const bDate = Date.parse(b.date);

    if (!Number.isNaN(aDate) && !Number.isNaN(bDate)) return bDate - aDate;
    return b.index - a.index;
  })[0]?.id;
}

/** Extracts one pilot's rank and leading-points percentage from a task table. */
export function getTaskPosition(
  html: string,
  pilotId: string,
): FlymasterResultsPosition {
  const $ = load(html);
  const table = $("#score-table").first();
  if (!table.length) return noData;

  let leadingColumn = -1;
  table.find("thead th").each((index, element) => {
    const heading = $(element).text().replace(/\s+/g, " ").trim();
    if (heading.toLowerCase() === "lead pts") {
      leadingColumn = index;
      return false;
    }
  });
  if (leadingColumn < 0) return noData;

  const rows = table.find("tbody tr.fs_res_res_row");
  let pilot: { position: number; leadingPoints?: number } | undefined;
  let maximumLeadingPoints = 0;

  rows.each((_, row) => {
    const cells = $(row).children("td");
    const id = $(row).find("td.col-id").first().text().trim();
    const leadingPoints = parseScore(cells.eq(leadingColumn).text());

    if (leadingPoints !== undefined) {
      maximumLeadingPoints = Math.max(maximumLeadingPoints, leadingPoints);
    }

    if (id !== pilotId) return;

    const position = parseInt(cells.first().text().trim(), 10);
    if (Number.isNaN(position)) return;
    pilot = { position, leadingPoints };
  });

  if (!pilot) return noData;
  if (pilot.leadingPoints === undefined || maximumLeadingPoints <= 0) {
    return { position: pilot.position };
  }

  return {
    position: pilot.position,
    leadingPercentage: Math.round(
      (pilot.leadingPoints / maximumLeadingPoints) * 100,
    ),
  };
}

export async function getFlymasterResultsPosition(
  groupId: string,
  pilotId: string,
  taskId?: string,
): Promise<FlymasterResultsPosition> {
  try {
    const selectedTaskId =
      taskId ?? (await getLatestScoredTaskIdFromGroup(groupId));
    if (!selectedTaskId) return noData;

    const taskResults = await fetch(
      `https://lt.flymaster.net/bsTaskResultsFiltered.php?idgroup=${groupId}&taskId=${selectedTaskId}`,
      fetchOptions,
    );
    if (!taskResults.ok) return noData;

    return getTaskPosition(await taskResults.text(), pilotId);
  } catch (error) {
    console.error("Unable to load Flymaster official results", error);
    return noData;
  }
}

async function getLatestScoredTaskIdFromGroup(groupId: string) {
  const frontPage = await fetch(
    `https://lt.flymaster.net/bsCompetitionFrontPage.php?idgroup=${groupId}`,
    fetchOptions,
  );
  if (!frontPage.ok) return;

  return getLatestScoredTaskId(await frontPage.text());
}

function parseScore(value: string): number | undefined {
  const normalized = value.replace(/\s+/g, " ").trim();
  const match = normalized.match(/-?\d+(?:[.,]\d+)?/);
  if (!match) return;

  const score = Number.parseFloat(match[0].replace(",", "."));
  return Number.isFinite(score) ? score : undefined;
}

const fetchOptions = {
  cache: "no-store" as const,
  headers: { "user-agent": "Chrome" },
};
