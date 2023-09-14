import { useState } from "react";
import WidgetURL from "./WidgetURL";

const PwcSelect = () => {
  const [selectedPilot, setSelectedPilot] = useState<number>();

  const onPilotNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const id = parseInt(event.target.value);
    setSelectedPilot(id);
  };

  const getWidgetUrl = (pilotNumber: number) => {
    return `${window.location.href}pwc/${pilotNumber}`;
  };

  return (
    <>
      <h3 className="mt-2 text-lg font-semibold">Pilot Number</h3>
      <div className="mt-2 w-full md:mb-0">
        <div className="relative">
          <input
            autoFocus
            type="number"
            className="input focus:ring-primary h-12 w-full space-x-3 rounded-lg border border-gray-300 bg-white px-2 text-left text-slate-600 shadow-sm ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2"
            onChange={onPilotNumberChange}
            placeholder="PWC Pilot Number"
          />
        </div>
      </div>
      {!!selectedPilot && Number.isInteger(selectedPilot) && (
        <WidgetURL url={getWidgetUrl(selectedPilot)} />
      )}
    </>
  );
};

export default PwcSelect;
