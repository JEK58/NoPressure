import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const REFRESH_INTERVAL_LIVE = 5 * 1000;

function App() {
  const [rank, setRank] = useState<number | string>();
  const { group, tracker } = useParams();

  const fetchLiveData = async () => {
    // const group = 2172;
    // const trackerSerial = 483147;
    const trackerSerial = parseInt(tracker ?? "0");

    try {
      const serverTime = await getFlymasterServerTime(5387);

      const url = `https://corsproxy.io/?https://lt.flymaster.net/json/GROUPS/${group}/${roundTimeToHour(
        serverTime
      )}/rnk${roundTimeToMinute(serverTime)}.json`;

      console.log("🚀 ~ url:", url);

      const res = await fetch(url);
      const data = await res.json();

      setRank(getPilotRanking(trackerSerial, data));
    } catch (error) {
      console.log(error);
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
      <h1 className="text-4xl font-bold mb-2">{rank}</h1>
      {/* <h2 className="text-lg text-gray-500">.</h2> */}
    </div>
  );
}

async function getFlymasterServerTime(groupId: number) {
  const res = await fetch(
    `https://lb.flymaster.net/time.php?grp=${groupId}&_=${Date.now()}`
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
