
import {RequestHandler} from "express";
import {Request, Response, NextFunction} from "express";

const catchAsyncError = (theFunc: RequestHandler): RequestHandler => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(theFunc(req, res, next)).catch(next);
};

export default catchAsyncError;