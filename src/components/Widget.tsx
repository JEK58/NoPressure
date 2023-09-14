interface Props {
  position?: string | number;
  score?: string | number;
  isFetching?: boolean;
  blindmode?: boolean;
}

const Widget = (props: Props) => {
  const h1Size = props.blindmode ? "text-7xl" : "text-4xl";
  const h1Class = `${h1Size} font-bold mb-0`;

  const h2size = props.blindmode ? "text-2xl" : "text-lg";
  const h2Class = `${h2size} text-gray-700`;

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
      {/* TODO: Add indicator if data is stale */}
      <h2> {props.isFetching ? "⏳" : "✅"}</h2>
    </div>
  );
};

export default Widget;
