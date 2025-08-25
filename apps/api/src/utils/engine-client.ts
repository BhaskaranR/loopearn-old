import type { AppType } from "@loopearn/engine";
import { hc } from "hono/client";

export const engineClient = hc<AppType>(`${process.env.ENGINE_API_URL}/`, {
  headers: {
    Authorization: `Bearer ${process.env.MIDDAY_ENGINE_API_KEY}`,
  },
});
