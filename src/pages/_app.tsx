import { type AppType } from "next/app";
import PlausibleProvider from "next-plausible";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import { env } from "@/env.mjs";
import Layout from "@/components/layout";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <PlausibleProvider
        domain="no-pressure.app"
        selfHosted={true}
        customDomain={env.NEXT_PUBLIC_PLAUSIBLE_URL}
      >
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </PlausibleProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
