import { useEffect, useState } from "react";

const REFRESH_INTERVAL_LIVE = 5 * 1000;

function App() {
  const [data, setData] = useState();

  const fetchLiveData = async () => {
    const group = 5387;
    const url = `https://corsproxy.io/?https://lt.flymaster.net/json/GROUPS/${group}/${getRoundedTimestamp()}/rnk${getRoundedTimestampMinute()}.json`;

    console.log("🚀 ~ url:", url);

    try {
      const res = await fetch(url, {});
      const body = await res.json();
      console.log("🚀 ~ body:", body);
      setData(body);
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   console.log("Fetching");

  //   fetchLiveData();
  //   const fetchInterval = setInterval(fetchLiveData, REFRESH_INTERVAL_LIVE);
  //   return () => {
  //     clearInterval(fetchInterval);
  //   };
  // }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-2">10.</h1>
      <h2 className="text-lg text-gray-500">10km</h2>
    </div>
  );
}

function getRoundedTimestamp(): number {
  const currentDate = new Date();
  const targetYear = 1993;
  const targetMinutes = [0, 10, 20, 30, 40, 50];

  currentDate.setFullYear(targetYear);
  const currentMinutes = currentDate.getMinutes();
  const roundedMinutes =
    targetMinutes.find((minute) => minute <= currentMinutes) || 0;

  currentDate.setMinutes(roundedMinutes);
  currentDate.setSeconds(0);
  currentDate.setMilliseconds(0);

  const epochTimestamp = Math.floor(currentDate.getTime() / 1000);

  return epochTimestamp;
}

function getRoundedTimestampMinute(): number {
  const currentDate = new Date();
  const targetYear = 1993;

  currentDate.setFullYear(targetYear);
  currentDate.setMilliseconds(0);
  currentDate.setSeconds(0);

  const epochTimestamp = Math.floor(currentDate.getTime() / 1000);

  return epochTimestamp;
}

export default App;
