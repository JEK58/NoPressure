import { createTRPCRouter } from "@/server/api/trpc";
import { flymasterRouter } from "@/server/api/routers/flymaster";
import { flyeventRouter } from "@/server/api/routers/flyevent";
import { pwcRouter } from "./routers/pwc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  flymaster: flymasterRouter,
  flyevent: flyeventRouter,
  pwc: pwcRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
