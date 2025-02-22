//
// server/app/routes/scheduler.routes.js

import express from "express";

import { handleTriggerFetchClanMembersScheduler } from "../controllers/scheduler.controllers.js";

const router = express.Router();

router.post("/clan-members/trigger", handleTriggerFetchClanMembersScheduler);

export default router;
