import Head from "next/head";

import { Footer } from "@/components/Footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
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
      <main className="flex min-h-screen flex-col items-center justify-start bg-gradient-to-b from-[#15162c] to-[#167caf]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <div>
            <h1 className="max-w-2xl text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
              No<span className="text-[hsl(342,100%,70%)]">Pressure!</span>
              <span className="ml-1 inline text-left text-sm tracking-normal">
                beta
              </span>
            </h1>

            <h2 className="text-md mt-1 text-white md:text-xl">
              Race position widget URL generator for XCTrack & Alfapilot
            </h2>
          </div>
          {children}
        </div>
        <Footer />
      </main>
    </>
  );
};

export default Layout;
