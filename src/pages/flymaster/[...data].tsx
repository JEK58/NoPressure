import Widget from "@/components/Widget";
import { api } from "@/utils/api";
import { useRouter } from "next/router";

export function Position() {
  const router = useRouter();
  const data = router.query.data;

  let groupId = undefined;
  let trackerSerial = undefined;
  let blindmode = undefined;

  if (Array.isArray(data)) {
    [groupId, trackerSerial, blindmode] = data;
  }

  const position = api.flymaster.position.useQuery(
    { groupId: groupId ?? "99999", trackerSerial: trackerSerial ?? "99999" },
    {
      refetchInterval: 1000 * 60, // 1 minute
      enabled: !!(groupId && trackerSerial),
    },
  );

  return (
    <Widget
      data={position.data}
      blindmode={blindmode == "iamold"}
      isFetching={position.isFetching}
      dataUpdatedAt={position.dataUpdatedAt}
    />
  );
}

export default Position;
