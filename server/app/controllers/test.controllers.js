// 
// server/app/controllers/test.controllers.js

import { sendSuccess } from "../utils/response/sendSuccess.js"

export const handleTest = (req, res) => {

  sendSuccess(res, 201)
}