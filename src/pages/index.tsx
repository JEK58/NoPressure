import { type NextPage } from "next";
import Head from "next/head";
import { api } from "@/utils/api";
import { useState } from "react";
import { useRouter } from "next/router";

const BASE_URL = "https://position.stephanschoepe.de";
const Home: NextPage = () => {
  const [selectedComp, setSelectedComp] = useState<number>();
  const [selectedPilot, setSelectedPilot] = useState<number>();

  const router = useRouter();
  const currentUrl = router.asPath;

  const comps = api.comps.list.useQuery();

  const pilots = api.comps.pilots.useQuery(
    { groupId: selectedComp },
    {
      enabled: !!selectedComp,
      cacheTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    }
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).catch((error) => {
      console.error("Failed to copy: ", error);
    });
  };

  const getWidgetUrl = (groupId: number, trackerId: number) => {
    return `${window.location.href}${groupId}/${trackerId}`;
  };

  return (
    <>
      <Head>
        <title>Paragliding Race Position</title>
        <meta
          name="description"
          content="Widget URL generator for XCTrack/Alfapilot"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#15162c] to-[#167caf]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            <span className="text-[hsl(342,100%,70%)]">Paragliding</span> Race
            Position
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <div className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
              <h3 className="text-2xl font-bold">Flymaster Groups</h3>
              {/* Select comp */}
              <select
                className="select focus:ring-primary mt-3 h-12 w-full items-center space-x-3 rounded-lg border border-gray-300 bg-white text-left text-slate-600  shadow-sm ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2"
                onChange={handleSelectComp}
                defaultValue="DEFAULT"
              >
                <option disabled value="DEFAULT">
                  Select Flymaster Group
                </option>
                {listComps}
              </select>
              {/* Select pilot */}
              {selectedComp && (
                <select
                  className="select focus:ring-primary mt-3 h-12 w-full items-center space-x-3 rounded-lg border border-gray-300 bg-white text-left text-slate-600  shadow-sm ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2"
                  onChange={handleSelectPilot}
                  value={selectedPilot ?? "DEFAULT"}
                >
                  <option disabled value="DEFAULT">
                    Select pilot
                  </option>
                  {listPilots}
                </select>
              )}
              {/* URL */}
              {selectedPilot && selectedComp && (
                <div className="rounded-lg bg-gray-100 p-4 shadow-md">
                  <div className="flex items-center">
                    <input
                      id="urlInput"
                      type="text"
                      value={getWidgetUrl(selectedComp, selectedPilot)}
                      className="mr-2 w-full rounded-lg border border-gray-300 bg-white p-2 text-black"
                      readOnly
                    />
                    <button
                      onClick={() =>
                        copyToClipboard(
                          getWidgetUrl(selectedComp, selectedPilot)
                        )
                      }
                      className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
