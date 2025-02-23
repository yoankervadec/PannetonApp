//
// server/jobs/services/patchClanInfo.js

import { apiHelper } from "../api/apiHelper.js";

export const patchClanInfo = async (clanTag) => {
  const infoEndpoint = `/clan/${clanTag}`;
  const rankEndpoint = `/locations/57000047/rankings/clanwars`;

  try {
    const startTime = performance.now();
    const rawInfo = await apiHelper(infoEndpoint);
    const rawRank = await apiHelper(rankEndpoint);

    if (!rawInfo || !rawRank || !rawRank.items) {
      throw new Error("Invalid API response.");
    }

    const decodedTag = decodeURIComponent(clanTag);

    const clanRankData = rawRank.items.find((clan) => clan.tag === decodedTag);

    const clanInfo = {
      clanTag: rawInfo.tag,
      clanName: rawInfo.name,
      clanType: rawInfo.type,
      clanDescription: rawInfo.description,
      badgeId: rawInfo.badgeId,
      clanScore: rawInfo.clanScore,
      clanWarTrophies: rawInfo.clanWarTrophies,
      locationId: rawInfo.id,
      locationName: rawInfo.name,
      locationCountryCode: rawInfo.countryCode,
      requiredTrophies: rawInfo.requiredTrophies,
      rank: clanRankData ? clanRankData.rank : null,
      previousRank: clanRankData ? clanRankData.previousRank : null,
    };

    // const rowsAffected = await updateClanInfo(clanInfo);

    // Could store leaderboard for nice dashboard..?

    const endTime = performance.now();
    const executionTime = `${(endTime - startTime).toFixed(2)}ms`;
  } catch (error) {
    console.error(
      "Failed to Fecth or Patch Clan Information: " + error.message
    );
    throw error;
  }
};
