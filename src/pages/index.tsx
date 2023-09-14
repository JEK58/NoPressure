import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import FlymasterGroups from "@/components/FlymasterGroups";
import FlyeventGroups from "@/components/FlyEventGroups";
import PwcSelect from "@/components/PwcSelect";
import HowToUse from "@/components/HowToUse";
import { Footer } from "@/components/Footer";

const Home: NextPage = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<number>();

  const platforms = [
    { name: "Flymaster", id: 1 },
    { name: "Flyevent / SRS", id: 2 },
    { name: "PWC", id: 3 },
  ];

  const listPlatforms = platforms.map((platform) => {
    if (!platform.id && !platform.name) return;
    return (
      <option key={platform.id} value={platform.id}>
        {platform.name}
      </option>
    );
  });

  const handleSelectPlatform = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const id = parseInt(event.target.value);
    setSelectedPlatform(id);
  };

  return (
    <>
      <Head>
        <title>Paragliding Race Position</title>
        <meta
          name="description"
          content="Widget URL generator for XCTrack & Alfapilot"
        />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-start bg-gradient-to-b from-[#15162c] to-[#167caf]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <div>
            <h1 className="max-w-3xl text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
              <span className="text-[hsl(342,100%,70%)]">Paragliding</span> Race
              Position{" "}
              <span className="inline text-left text-sm tracking-normal">
                beta
              </span>
            </h1>

            <h2 className="text-md mt-1 text-white md:text-xl">
              Widget URL generator for XCTrack & Alfapilot
            </h2>
          </div>

          <div className="mt-5 w-full max-w-3xl justify-center gap-3 md:flex">
            <div className="mb-3 w-full rounded-xl bg-white/10 p-4 text-white hover:bg-white/20 md:mb-0">
              <h3 className="text-lg font-semibold">Platform</h3>
              {/* Select Platform */}
              <select
                className="select focus:ring-primary mt-3 h-12 w-full items-center space-x-3 rounded-lg border border-gray-300 bg-white px-2 text-left text-slate-600  shadow-sm ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2"
                onChange={handleSelectPlatform}
                defaultValue="DEFAULT"
              >
                <option disabled value="DEFAULT">
                  Select Platform
                </option>
                {listPlatforms}
              </select>
              {selectedPlatform === 1 && <FlymasterGroups />}
              {selectedPlatform === 2 && <FlyeventGroups />}
              {selectedPlatform === 3 && <PwcSelect />}
            </div>
          </div>
          <HowToUse />
        </div>
        <Footer />
      </main>
    </>
  );
};

export default Home;
