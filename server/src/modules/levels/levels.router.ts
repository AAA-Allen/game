import { Router } from "express";

import { sendSuccess } from "../../utils/api-response";
import { getLevelById, getLevels } from "./levels.service";

export const levelsRouter = Router();

levelsRouter.get("/", (req, res) => {
  const zoneId =
    typeof req.query.zoneId === "string" ? req.query.zoneId : undefined;

  return sendSuccess(res, getLevels(zoneId));
});

levelsRouter.get("/:id", (req, res) => {
  return sendSuccess(res, getLevelById(req.params.id));
});
