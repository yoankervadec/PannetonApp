// 
// server/app/utils/response/sendSuccess.js

export const sendSuccess = (res, statusCode = 200, data = null) => {
  res.status(statusCode).json({
    status: statusCode,
    data
  })
}