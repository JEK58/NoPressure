import { api } from "@/utils/api";
import { useRouter } from "next/router";

export function Position() {
  const router = useRouter();
  const data = router.query.data;

  let groupId = undefined;
  let trackerSerial = undefined;
  let blindmode = undefined;
  let dataIsValid = false;
  let useBlindmode = false;

  if (Array.isArray(data)) {
    [groupId, trackerSerial, blindmode] = data;
  }
  if (groupId && trackerSerial) dataIsValid = true;

  if (blindmode == "iamold") useBlindmode = true;
  const position = api.flymaster.position.useQuery(
    { groupId: groupId ?? "99999", trackerSerial: trackerSerial ?? "99999" },
    {
      refetchInterval: 1000 * 60, // 1 minute
      // refetchInterval: 1000 * 5, // 5 secs for dev
      enabled: dataIsValid,
    }
  );

  const h1Size = useBlindmode ? "text-7xl" : "text-4xl";
  const h1Class = `${h1Size} font-bold mb-0`;

  // const h2size = useBlindmode ? "text-2xl" : "text-lg";
  // const h2Class = `${h2size} text-gray-700`;

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      {!position.data && (
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex h-3 w-3 rounded-full bg-sky-500"></span>
        </span>
      )}
      <h1 className={h1Class}>{position.data}</h1>
      {/* TODO: Add indicator if data is stale */}
      <h2> {position.isFetching ? "⏳" : "✅"}</h2>
      {/* {points && <h2 className={h2Class}>{points}</h2>} */}
    </div>
  );
}

export default Position;
