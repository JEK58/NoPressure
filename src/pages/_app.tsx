import { type AppType } from "next/app";
import PlausibleProvider from "next-plausible";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import { env } from "@/env.mjs";

console.log("Plausible URL: " + env.NEXT_PUBLIC_PLAUSIBLE_URL);

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <PlausibleProvider domain="no-pressure.app">
        <Component {...pageProps} />
      </PlausibleProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
