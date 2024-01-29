import Widget from "@/components/Widget";
import { api } from "@/utils/api";
import { useRouter } from "next/router";

export function Position() {
  const router = useRouter();
  const data = router.query.data;
  console.log("🚀 ~ data:", data);

  let pilotId = undefined;
  let blindmode = undefined;

  if (Array.isArray(data)) {
    [pilotId, blindmode] = data;
  }

  console.log("🚀 ~ pilotId:", pilotId);
  const position = api.compcheck.position.useQuery(
    { pilotId: pilotId ?? "99999" },
    {
      refetchInterval: 1000 * 60, // 1 minute
      enabled: !!pilotId,
    },
  );

  return (
    <>
      <Widget
        data={position.data}
        blindmode={blindmode === "iamold"}
        isFetching={position.isFetching}
        dataUpdatedAt={position.dataUpdatedAt}
      />
    </>
  );
}

export default Position;
