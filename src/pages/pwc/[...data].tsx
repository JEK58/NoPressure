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

export default PWC;
