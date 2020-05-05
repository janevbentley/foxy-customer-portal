/* eslint-disable @stencil/ban-side-effects */

import fastifyCORS from "fastify-cors";
import fastify from "fastify";
import { mockDatabase } from "./assets/utils/mockDatabase";
import { handlers } from "./assets/handlers";

(async () => {
  const port = 5000;
  const db = await mockDatabase(`http://localhost:${port}/s/customer/`);
  const app = fastify();

  const handleRequest = async (request, response) => {
    const { url, method } = request.raw;

    if (url.startsWith("/s/customer")) {
      let relativeURL = url.replace(`/s/customer`, "");
      if (!relativeURL.startsWith("/")) relativeURL = `/${relativeURL}`;
      const handler = handlers.find(h => h.test(method, relativeURL));

      if (handler !== undefined) {
        const { status, body } = await handler.run(db, {
          body: request.body,
          headers: request.headers,
          url: relativeURL,
          method
        });

        response.code(status);
        return body;
      }
    }

    response.code(404).send();
  };

  app.register(fastifyCORS, {
    origin: "http://localhost:8080",
    methods: ["GET", "POST", "PATCH"],
    allowedHeaders: ["fx.customer", "content-type"],
    exposedHeaders: ["fx.customer"]
  });

  app.get("*", handleRequest);
  app.post("*", handleRequest);
  app.patch("*", handleRequest);

  try {
    await app.listen(port);

    console.log(
      "\x1b[2m[%s:%s.%s]\x1b[0m  %s: \x1b[36m%s\x1b[0m",
      new Date().getMinutes().toString(),
      new Date().getSeconds().toString(),
      Math.floor(new Date().getMilliseconds() / 100).toString(),
      "api server",
      `http://localhost:${port}`
    );
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
