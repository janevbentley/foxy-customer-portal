import fetch from "node-fetch";
import { handlers } from "../handlers";
import { mockDatabase } from "./mockDatabase";

export async function mockFetch(endpoint = "/") {
  const db = await mockDatabase(endpoint);

  return async (url: string, params?: RequestInit) => {
    if (url.startsWith(endpoint)) {
      const method = params?.method || "GET";
      const relativeURL = endpoint === "/" ? url : url.replace(endpoint, "");
      const handler = handlers.find(h => h.test(method, relativeURL));

      if (Boolean(handler)) {
        const { status, body } = await handler.run(db, {
          headers: (params?.headers as Record<string, string>) || {},
          body: JSON.parse(params?.body?.toString() || '""'),
          url: relativeURL,
          method
        });

        return {
          ok: Math.floor(status / 100) === 2,
          json: () => Promise.resolve(body),
          status
        };
      } else {
        throw new Error(`No handler found for ${method} ${url}`);
      }
    } else {
      return fetch(url, params);
    }
  };
}
