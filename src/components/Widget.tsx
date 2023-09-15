import { useEffect, useState } from "react";

interface Props {
  position?: string | number;
  score?: string | number;
  isFetching?: boolean;
  blindmode?: boolean;
  dataUpdatedAt?: number;
}

const Widget = (props: Props) => {
  const [stale, setStale] = useState(false);

  const h1Size = props.blindmode ? "text-7xl" : "text-4xl";
  const staleColor = stale ? "text-red-700" : "";
  const h1Class = `${h1Size} ${staleColor} font-bold mb-0 `;

  const h2size = props.blindmode ? "text-2xl" : "text-lg";
  const h2Class = `${h2size} ${staleColor} text-gray-700`;

  // Check if data is older than 3 minutes
  const STALE_TIME = 1000 * 60 * 3;

  useEffect(() => {
    const staleData = () => {
      if (!props.dataUpdatedAt) return;
      if (props.dataUpdatedAt + STALE_TIME <= Date.now()) return setStale(true);
      setStale(false);
    };

    const intervalId = setInterval(staleData, 1000 * 60);

    return () => {
      clearInterval(intervalId);
    };
  });

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      {!props.position && (
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex h-3 w-3 rounded-full bg-sky-500"></span>
        </span>
      )}
      <h1 className={h1Class}>{props.position}</h1>
      {props.score && <h2 className={h2Class}>{props.score}</h2>}
    </div>
  );
};

export default Widget;
