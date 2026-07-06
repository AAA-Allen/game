import { Router } from "express";

import { authRouter } from "../modules/auth/auth.router";
import { levelsRouter } from "../modules/levels/levels.router";
import { progressRouter } from "../modules/progress/progress.router";
import { submissionsRouter } from "../modules/submissions/submissions.router";
import { usersRouter } from "../modules/users/users.router";
import { zonesRouter } from "../modules/zones/zones.router";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/zones", zonesRouter);
apiRouter.use("/levels", levelsRouter);
apiRouter.use("/progress", progressRouter);
apiRouter.use("/submissions", submissionsRouter);
