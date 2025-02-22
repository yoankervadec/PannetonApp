//
// server/jobs/api/apiHelper.js

import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

export const apiHelper = async (endpoint) => {
  const baseUrl = "https://api.clashroyale.com/v1";
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.error("Missing API key");
    return null;
  }
  const url = `${baseUrl}${endpoint}`;
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    return response.data;
    // return response
  } catch (error) {
    console.error(`Request Failed: ${error.message}`);

    if (error.response) {
      return {
        status: error.response.status,
        message: error.response.data?.message || "No error message provided",
      };
    }

    return {
      status: 500,
      message: "An unnexpected error occurred",
    };
  }
};
