//
// server/app/controllers/scheduler.controllers.js

import { fetchClanMembersScheduler } from "../../jobs/schedulers/schedulerJobs.js";

export const handleTriggerFetchClanMembersScheduler = async (req, res) => {
  try {
    fetchClanMembersScheduler.triggerNow();
    res.status(200).send("Trigger: Fetch Clan Members");
  } catch (err) {
    console.error(err.message);
  }
};
