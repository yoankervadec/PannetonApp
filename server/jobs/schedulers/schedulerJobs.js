//
// server/jobs/schedulers/schedulerJobs.js

import dotenv from "dotenv";

import SchedulerManager from "./schedulerManager.js";
import { fetchClanMembers } from "../services/fetchClanMembers.js";

dotenv.config();
const clanTag = process.env.CLAN_TAG;

export const startAllSchedulers = () => {
  fetchClanMembersScheduler.start();
  // Other jobs...
};
export const stopAllSchedulers = () => {
  fetchClanMembersScheduler.stop();
  // Other jobs...
};

const fetchClanMembersJob = "fetchAndUpdateMembers";

export const fetchClanMembersScheduler = new SchedulerManager(
  fetchClanMembersJob,
  async () => {
    try {
      await fetchClanMembers(clanTag);
      const timestamp = new Date().toLocaleString("en-CA", {
        timeZone: "America/Toronto",
      });
      console.log(`[${timestamp}] SUCCESS: Clan members updated successfully.`);
    } catch (error) {
      console.error("Failed to update work table:", error.message);
    }
  }
);
