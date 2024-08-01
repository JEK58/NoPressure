import { type AppType } from "next/app";
import PlausibleProvider from "next-plausible";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import { env } from "@/env.mjs";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <PlausibleProvider
        domain="no-pressure.app"
        selfHosted={true}
        customDomain={env.NEXT_PUBLIC_PLAUSIBLE_URL}
      >
        <Component {...pageProps} />
      </PlausibleProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
