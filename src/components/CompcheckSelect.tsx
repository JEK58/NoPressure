import { api } from "@/utils/api";
import { useState } from "react";
import WidgetURL from "./WidgetURL";
import Spinner from "./Spinner";
import GenericError from "./GenericError";

const CompcheckSelect = () => {
  const [selectedPilot, setSelectedPilot] = useState<number>();

  const pilots = api.compcheck.pilots.useQuery();

  const listPilots = pilots.data?.map((pilot) => {
    if (!pilot.id) return;
    return (
      <option key={pilot.id} value={pilot.id}>
        {pilot.name}
      </option>
    );
  });

  const handleSelectPilot = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(event.target.value);
    setSelectedPilot(id);
  };

  const getWidgetUrl = (trackerId: number) => {
    return `${window.location.href}compcheck/${trackerId}`;
  };

  return (
    <>
      {/* Select pilot */}
      {!pilots.isFetched && <Spinner />}

      {pilots.isFetched && (
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
      {selectedPilot && <WidgetURL url={getWidgetUrl(selectedPilot)} />}
      {/* Error */}
      {pilots.error && <GenericError />}
    </>
  );
};

export default CompcheckSelect;
