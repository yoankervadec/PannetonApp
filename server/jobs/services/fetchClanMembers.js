//
// server/jobs/services/fetchClanMembers.js

import { apiHelper } from "../api/apiHelper.js";

export const fetchClanMembers = async (clanTag) => {
  const endpoint = `/clans/${clanTag}/members`;
  try {
    const startTime = performance.now();

    const response = await apiHelper(endpoint);
    // console.log(JSON.stringify(response, null, 2));
    console.log("fetch members ran...")

    const endTime = performance.now();
    const executionTime = `${(endTime - startTime).toFixed(2)}ms`;

    return {
      response,
      executionTime,
    };
  } catch (error) {
    console.error("Failed to fetch Clan Members: " + error.message);
  }
};
