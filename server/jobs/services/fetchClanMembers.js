// 
// server/jobs/services/fetchClanMembers.js

import { apiHelper } from "../api/apiHelper.js";

export const fetchClanMembers = async (clanTag) => {
  const endpoint = `/clans/${clanTag}/members`
  try {
    const response = await apiHelper(endpoint);
    console.log(JSON.stringify(response, null, 2))

    return response;
  } catch (error) {
    console.error("Failed to fetch Clan Members: " + error.message)
  }
}