import { testDatabaseConnection } from "./config/db";
import { app } from "./app";
import { env } from "./config/env";

async function bootstrap() {
  await testDatabaseConnection();

  app.listen(env.port, () => {
    console.log(`WebQuest server is running on http://localhost:${env.port}`);
  });
}

bootstrap().catch((error: unknown) => {
  console.error("Failed to start WebQuest server:", error);
  process.exit(1);
});
