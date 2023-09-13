import { createTRPCRouter } from "@/server/api/trpc";
import { compRouter } from "@/server/api/routers/comps";
import { flymasterRouter } from "@/server/api/routers/flymaster";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  comps: compRouter,
  flymaster: flymasterRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
