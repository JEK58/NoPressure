import { type NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>NoPressure!</title>
        <meta
          name="description"
          content="Widget URL generator for XCTrack & Alfapilot"
        />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <main className="flex h-screen flex-col items-center justify-center bg-slate-400">
        <h1 className="text-5xl font-bold">All good</h1>
      </main>
    </>
  );
};

export default Home;
