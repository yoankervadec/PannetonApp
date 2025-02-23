// 
// server/jobs/utils/dateHelper.js

import { DateTime } from "luxon";

// Converts date from API as a string to usable format

export const formatDate = (isoString) => {
  if (typeof isoString !== "string" || isoString.length < 16) return null; // Handle missing/invalid timestamps

  try {
    // Parse UTC timestamp
    const date = DateTime.fromFormat(isoString, "yyyyLLdd'T'HHmmss.SSS'Z'", { zone: "utc" });

    // Convert to Montreal time (America/Toronto) and format for MySQL
    return date.setZone("America/Toronto").toFormat("yyyy-MM-dd HH:mm:ss");
  } catch (error) {
    console.error(`Error formatting date: ${isoString}`, error);
    return null;
  }
};