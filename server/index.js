// 
// server/index.js

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";

import { startAllSchedulers } from "./jobs/schedulers/schedulerJobs.js";

// Routes
import testRoutes from "./app/routes/test.routes.js";

// Middleware
dotenv.config();
const app = express();
app.use(express.json());

// CORS Configuration
app.use(
  cors({
    origin: ["http://10.0.0.111:3300"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(cookieParser());

// Session configuration
app.use(
  session({
    key: process.env.SESSION_KEY,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 1000 * 60 * 60 * 24,
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    },
  })
);

// Routes
app.use("/route", testRoutes);
// const clanTag = process.env.CLAN_TAG;
// await fetchClanMembers(clanTag);

// startAllSchedulers();

const PORT = process.env.PORT;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});