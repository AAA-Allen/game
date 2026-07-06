import { Router } from "express";

import { sendSuccess } from "../../utils/api-response";
import { getZones } from "./zones.service";

export const zonesRouter = Router();

zonesRouter.get("/", (_req, res) => {
  return sendSuccess(res, getZones());
});
