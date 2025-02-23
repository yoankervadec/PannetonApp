//
// server/jobs/services/fetchClanMembers.js

import { apiHelper } from "../api/apiHelper.js";

import { formatDate } from "../utils/dateHelper.js";
import { insertAndUpdateClanMembers } from "../models/insertAndUpdateClanMembers.js";

export const fetchClanMembers = async (clanTag) => {
  const endpoint = `/clans/${clanTag}/members`;
  try {
    const startTime = performance.now();
    const rawResponse = await apiHelper(endpoint);

    if (!rawResponse || !rawResponse.items) {
      throw new Error("Invalid API response");
    }

    const clanMembers = rawResponse.items.map((member) => ({
      member_name: member.name,
      member_tag: member.tag,
      member_role: member.role,
    }));

    const clanMembersMeta = rawResponse.items.map((member) => ({
      trophies: member.trophies,
      arena: member.arena.name,
      level: member.expLevel,
      donations: member.donations,
      donations_received: member.donationsReceived,
      last_seen: formatDate(member.lastSeen),
    }));

    await insertAndUpdateClanMembers(clanMembers, clanMembersMeta);

    const endTime = performance.now();
    const executionTime = `${(endTime - startTime).toFixed(2)}ms`;
  } catch (error) {
    console.error("Failed to fetch Clan Members: " + error.message);
    throw error;
  }
};
