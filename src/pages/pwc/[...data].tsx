import Widget from "@/components/Widget";
import { api } from "@/utils/api";
import { useRouter } from "next/router";

export function PWC() {
  const router = useRouter();
  const data = router.query.data;

  let pilotNumber = undefined;
  let blindmode = undefined;

  if (Array.isArray(data)) {
    [pilotNumber, blindmode] = data;
  }

  const position = api.pwc.position.useQuery(
    { pilotNumber: pilotNumber ?? "99999" },
    {
      refetchInterval: 1000 * 60, // 1 minute
      enabled: !!pilotNumber,
    },
  );

  return (
    <Widget
      data={position.data}
      blindmode={blindmode === "iamold"}
      isFetching={position.isFetching}
      dataUpdatedAt={position.dataUpdatedAt}
    />
  );
}

export default PWC;
