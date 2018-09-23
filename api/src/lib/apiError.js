import { error } from "./log";

/*
  Error wrapping our API errors (especially the codes).
*/
export default function ApiError(error) {
  if (process.env.NODE_ENV === "development") {
    Error.captureStackTrace(this, this.constructor);
  }

  this.name = this.constructor.name;
  this.message = error.message;
  this.code = error.code;
  this.status = error.status || 422;
}
require("util").inherits(ApiError, Error);

export const errorHandler = (err, req, res, next)=>{
  if (err && err.code) {
    error('api error',err)
    res.status(err.name && err.name === "ApiError" ? err.status : 500).json({
      error: {
        code: err.code,
        message: err.message
      }
    });
    return;
  }
  next(err);
}
