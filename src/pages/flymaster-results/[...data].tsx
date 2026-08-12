import Widget from "@/components/Widget";
import { api } from "@/utils/api";
import { useRouter } from "next/router";

const DEFAULT_PILOT_ID = "666";

export function FlymasterResultsTest() {
  const router = useRouter();
  const data = router.query.data;

  const [preview, pilotIdOrBlindmode] = Array.isArray(data) ? data : [];
  const isTestPreview = preview === "test";
  const pilotId =
    pilotIdOrBlindmode && pilotIdOrBlindmode !== "iamold"
      ? pilotIdOrBlindmode
      : DEFAULT_PILOT_ID;
  const isValidPilotId = /^\d+$/.test(pilotId);
  const isBlindmode = true;

  const position = api.flymasterResults.position.useQuery({ pilotId }, {
    refetchInterval: 1000 * 60,
    enabled: isTestPreview && isValidPilotId,
  });

  if (!isTestPreview || !isValidPilotId) return null;

  return (
    <Widget
      data={position.data}
      blindmode={isBlindmode}
      isFetching={position.isFetching}
      dataUpdatedAt={position.dataUpdatedAt}
    />
  );
}

export default FlymasterResultsTest;
