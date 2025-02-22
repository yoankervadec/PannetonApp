// 
// server/app/routes/test.routes.js

import express from "express";

import { handleTest } from "../controllers/test.controllers.js";

const router = express.Router();

// http://10.0.0.111:8080/auth/register

// Routes
router.get("/test", handleTest);

export default router;