import Widget from "@/components/Widget";
import { api } from "@/utils/api";
import { useRouter } from "next/router";

export function Position() {
  const router = useRouter();
  const data = router.query.data;

  let groupId = undefined;
  let pilotId = undefined;
  let blindmode = undefined;

  if (Array.isArray(data)) {
    [groupId, pilotId, blindmode] = data;
  }

  const position = api.flyevent.position.useQuery(
    { groupId: groupId ?? "99999", pilotId: pilotId ?? "99999" },
    {
      refetchInterval: 1000 * 60, // 1 minute
      enabled: !!(groupId && pilotId),
    }
  );

  return (
    <Widget
      position={position.data?.position}
      score={position.data?.score}
      blindmode={blindmode === "iamold"}
      isFetching={position.isFetching}
    />
  );
}

export default Position;
