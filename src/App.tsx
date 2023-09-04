import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { jsonrepair } from "jsonrepair";

const REFRESH_INTERVAL_LIVE = 5 * 1000;

function App({ blindmode = false }) {
  const [rank, setRank] = useState<number | string>();
  const [points, setPoints] = useState<number | string>("?");
  const { group, tracker } = useParams();

  const fetchLiveData = async () => {
    const trackerSerial = parseInt(tracker ?? "0");

    // if (group == "pwc") {
    //   // PWC Live ranking
    //   const cheerio = await import("cheerio");

    //   async function getPwcLiveResultsUrl() {
    //     const resultUrl = "https://pwca.events/pwca-live-results/";
    //     const res = await fetch(`https://corsproxy.io/?${resultUrl}`);
    //     const content = await res.text();
    //     const $ = cheerio.load(content);

    //     const iframe = $('iframe[name="livescores"]');
    //     const src = iframe.attr("src");

    //     return src;
    //   }

    //   try {
    //     const liveResultUrl = await getPwcLiveResultsUrl();

    //     if (!liveResultUrl) return;
    //     const url = `https://corsproxy.io/?${liveResultUrl}`;

    //     const response = await fetch(url);
    //     const html = await response.text();
    //     const $ = cheerio.load(html);

    //     const table = $("table.result").eq(1);

    //     const tablehead = table.find("th");
    //     const tableRows = table.find("tr");

    //     let indexOfTotalPointsHeader = -1;

    //     tablehead.each((index, element) => {
    //       const headerContent = $(element).text();
    //       if (headerContent.trim().toLowerCase() === "totalpoints") {
    //         indexOfTotalPointsHeader = index;
    //         return false;
    //       }
    //     });

    //     const data = tableRows.filter((_, el) => {
    //       const secondTdContent = $(el).find("td:nth-child(2)").text();
    //       return secondTdContent.trim() === trackerSerial.toString();
    //     });

    //     const position = $(data).find("td:nth-child(1)").text();
    //     const rank = $(data)
    //       .find(`td:nth-child(${indexOfTotalPointsHeader + 1})`)
    //       .text();

    //     setPoints(rank);
    //     setRank(position);
    //   } catch (error) {
    //     console.error("Error:", error);
    //   }
    // }

    if (group == "bpc") {
      const AIRTRIBUNE_URL =
        "https://corsproxy.io/?https://race.airtribune.com/";
      // const COMP_ID = 2414;
      const COMP_ID = 2428; // BPC2023

      const LIVE_DATA_URL = AIRTRIBUNE_URL + COMP_ID + "/feed_live.json";

      try {
        const res = await fetch(LIVE_DATA_URL + "?" + new Date().getTime(), {
          cache: "no-store",
        });

        // Repair JSON as it might be invalid and crash during parsing.
        const string = await res.text();
        const repairedJson = jsonrepair(string);
        const data = JSON.parse(repairedJson) as unknown[];

        const pilots = data.slice(3).filter((el) => {
          // @ts-ignore
          return el[0][2] == tracker?.padStart(4, "0");
        });
        // @ts-ignore
        const rank = pilots[0][0][1];
        // @ts-ignore
        const points = pilots[0][0][24];

        if (typeof rank != "number") throw new Error("Rank is not a number");

        setRank(rank);
        setPoints(points);
      } catch (error) {
        setRank("?");
        console.log(error);
      }
    } else {
      try {
        // Flymaster live ranking
        const serverTime = await getFlymasterServerTime(group);

        const url = `https://corsproxy.io/?https://lt.flymaster.net/json/GROUPS/${group}/${roundTimeToHour(
          serverTime
        )}/rnk${roundTimeToMinute(serverTime)}.json`;

        const res = await fetch(url);
        const data = await res.json();

        setRank(getPilotRanking(trackerSerial, data));
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    console.log("Fetching");

    fetchLiveData();
    const fetchInterval = setInterval(fetchLiveData, REFRESH_INTERVAL_LIVE);
    return () => {
      clearInterval(fetchInterval);
    };
  }, []);

  const h1Size = blindmode ? "text-7xl" : "text-4xl";
  const h1Class = `${h1Size} font-bold mb-0`;

  const h2size = blindmode ? "text-2xl" : "text-lg";
  const h2Class = `${h2size} text-gray-700`;

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className={h1Class}>{rank}</h1>
      {points && <h2 className={h2Class}>{points}</h2>}
    </div>
  );
}

async function getFlymasterServerTime(groupId?: string) {
  const res = await fetch(
    `https://corsproxy.io/?https://lb.flymaster.net/time.php?grp=${groupId}&_=${Date.now()}`
  );
  const data = await res.json();

  return data.st as number;
}

function roundTimeToHour(serverTime: number): number {
  return 3600 * Math.floor(serverTime / 3600);
}

function roundTimeToMinute(serverTime: number): number {
  return 60 * Math.floor(serverTime / 60);
}

function getPilotRanking(serial: number, data: any) {
  try {
    // @ts-ignore
    const pilotData = data.aaData.find((el) => el[0] == serial);

    if (!pilotData) return "?";
    const rank = pilotData[1] as number;
    return rank;
  } catch (error) {
    console.log(error);

    return "?";
  }
}

export default App;
