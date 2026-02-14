import express from "express";
import { setupApp } from "./setup-app";
import { SETTINGS } from "./core/settings/settings";
import { runDb } from "./db/database";

const startApp = async () => {
  const app = express();
  setupApp(app);
  const PORT = SETTINGS.PORT;
  await runDb(SETTINGS.MONGO_URL);

  app.listen(PORT, () => console.log(`Listening on ${PORT}!`));

  return app;
};

startApp();
