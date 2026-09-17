import Widget from "@/components/Widget";
import { api } from "@/utils/api";
import { useRouter } from "next/router";

export function FlymasterResultsTest() {
  const router = useRouter();
  const data = router.query.data;

  const [groupId = "", pilotId = "", taskId] = Array.isArray(data) ? data : [];
  const isValidGroupId = /^\d+$/.test(groupId);
  const isValidPilotId = /^\d+$/.test(pilotId);
  const isValidTaskId = taskId === undefined || /^\d+$/.test(taskId);
  const isBlindmode = true;

  const position = api.flymasterResults.position.useQuery(
    { groupId, pilotId, taskId },
    {
      refetchInterval: 1000 * 60,
      enabled: isValidGroupId && isValidPilotId && isValidTaskId,
    },
  );

  if (!isValidGroupId || !isValidPilotId || !isValidTaskId) return null;

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
