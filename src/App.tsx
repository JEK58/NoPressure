import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as cheerio from "cheerio";

const REFRESH_INTERVAL_LIVE = 5 * 1000;

function App() {
  const [rank, setRank] = useState<number | string>();
  const [points, setPoints] = useState<number | string>();
  const { group, tracker } = useParams();

  const fetchLiveData = async () => {
    const trackerSerial = parseInt(tracker ?? "0");

    if (group == "pwc") {
      // PWC Live ranking
      try {
        const liveResultUrl = await getPwcLiveResultsUrl();

        if (!liveResultUrl) return;
        const url = `https://corsproxy.io/?${liveResultUrl}`;

        const response = await fetch(url);
        const html = await response.text();
        const $ = cheerio.load(html);

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
          return secondTdContent.trim() === trackerSerial.toString();
        });

        const position = $(data).find("td:nth-child(1)").text();
        const rank = $(data)
          .find(`td:nth-child(${indexOfTotalPointsHeader + 1})`)
          .text();


        setPoints(rank);
        setRank(position);
      } catch (error) {
        console.error("Error:", error);
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

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-0">{rank}</h1>
      {points && <h2 className="text-lg text-gray-700">{points}</h2>}
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

async function getPwcLiveResultsUrl() {
  const resultUrl = "https://pwca.events/pwca-live-results/";
  const res = await fetch(`https://corsproxy.io/?${resultUrl}`);
  const content = await res.text();
  const $ = cheerio.load(content);

  const iframe = $('iframe[name="livescores"]');
  const src = iframe.attr("src");

  return src;
}

export default App;
