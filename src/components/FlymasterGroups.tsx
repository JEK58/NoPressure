import { api } from "@/utils/api";
import { useState } from "react";
import WidgetURL from "./WidgetURL";
import Spinner from "@/components/Spinner";
import GenericError from "./GenericError";

const FlymasterGroups = () => {
  const [selectedComp, setSelectedComp] = useState<number>();
  const [selectedPilot, setSelectedPilot] = useState<number>();

  const comps = api.flymaster.list.useQuery();

  const pilots = api.flymaster.pilots.useQuery(
    { groupId: selectedComp },
    {
      enabled: !!selectedComp,
      cacheTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  );

  const listComps = comps.data?.map((comp) => {
    if (!comp.id && !comp.group_name) return;
    return (
      <option key={comp.id} value={comp.id}>
        {comp.group_name}
      </option>
    );
  });

  const listPilots = pilots.data?.map((pilot) => {
    if (!pilot.id) return;
    return (
      <option key={pilot.id} value={pilot.id}>
        {pilot.name}
      </option>
    );
  });

  const handleSelectComp = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(event.target.value);
    setSelectedPilot(undefined);
    setSelectedComp(id);
  };

  const handleSelectPilot = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(event.target.value);
    setSelectedPilot(id);
  };

  const getWidgetUrl = (groupId: number, trackerId: number) => {
    return `${window.location.href}flymaster/${groupId}/${trackerId}`;
  };
  if (!comps.isFetched) return <Spinner />;

  return (
    <>
      {/* Select comp */}
      {comps.isFetched && !comps.error && (
        <>
          <h3 className="mt-3 text-lg font-semibold">Group</h3>

          <select
            className="select mt-2 h-12 w-full items-center space-x-3 rounded-lg border border-gray-300 bg-white px-2 text-left text-slate-600 shadow-sm  ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-secondary"
            onChange={handleSelectComp}
            defaultValue="DEFAULT"
          >
            <option disabled value="DEFAULT">
              Select Group
            </option>
            {listComps}
          </select>
        </>
      )}
      {/* Select pilot */}
      {selectedComp && !pilots.isFetched && <Spinner />}

      {selectedComp && pilots.isFetched && (
        <>
          <h3 className="mt-3 text-lg font-semibold">Pilot</h3>

          <select
            className="select mt-2 h-12 w-full items-center space-x-3 rounded-lg border border-gray-300 bg-white px-2 text-left text-slate-600 shadow-sm  ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-secondary"
            onChange={handleSelectPilot}
            value={selectedPilot ?? "DEFAULT"}
          >
            <option disabled value="DEFAULT">
              Select pilot
            </option>
            {listPilots}
          </select>
        </>
      )}
      {/* URL */}
      {selectedPilot && selectedComp && (
        <WidgetURL url={getWidgetUrl(selectedComp, selectedPilot)} />
      )}
      {/* Error */}
      {(comps.error || pilots.error) && <GenericError />}
    </>
  );
};

export default FlymasterGroups;
