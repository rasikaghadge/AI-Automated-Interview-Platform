import jwt from "jsonwebtoken";
// @ts-ignore
import dotenv from "dotenv"; 
import { Request, Response, NextFunction } from "express";

dotenv.config();
const SECRET: string | undefined = process.env.SECRET;

if (!SECRET) {
  console.error("Secret key is not specified in the environment variables.");
  process.exit(1);
}

interface AuthenticatedRequest extends Request {
  id?: string;
  role?: string;
  permissions?: string[];
  email?: string;
}

export const auth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const authorizationHeader = req.headers.authorization;

    // Check if the authorization header is not present
    if (!authorizationHeader) {
        res.status(401)
        .json({ message: "Authentication failed. Token not provided." });
        return;
    }

    const token = authorizationHeader.split(" ")[1];
    const isCustomAuth = token.length < 500;

    let decodeData: any;

    // If token is custom token, do this
    if (token && isCustomAuth) {
      try {
        decodeData = jwt.verify(token, SECRET);
        req.id = decodeData?.id;
        req.role = decodeData?.role || "candidate";
        req.permissions = decodeData?.permissions || [];
        req.email = decodeData?.email;
      } catch (error) {
        res.status(401)
          .json({ message: "Authentication failed. Invalid Token." });
      }
    } else {
      // Else if token is google token, then do this
      decodeData = jwt.decode(token);
      req.id = decodeData?.sub;
      req.role = decodeData?.role || "candidate";
    }

    next();
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const admin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authorizationHeader = req.headers.authorization;

    // Check if the authorization header is not present
    if (!authorizationHeader) {
      res
        .status(401)
        .json({ message: "Authentication failed. Token not provided." });
      return;
    }

    const token = authorizationHeader.split(" ")[1];
    const isCustomAuth = token.length < 500;

    let decodeData: any;

    // If token is custom token, do this
    if (token && isCustomAuth) {
      decodeData = jwt.verify(token, SECRET);
      req.id = decodeData?.id;
    } else {
      // Else if token is google token, then do this
      decodeData = jwt.decode(token);
      req.id = decodeData?.sub;
      req.role = decodeData?.role;
    }

    next();
  } catch (error) {
    console.log(error);
  }
};

export const hrAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authorizationHeader = req.headers.authorization;

    // Check if the authorization header is not present
    if (!authorizationHeader) {
      res
        .status(401)
        .json({ message: "Authentication failed. Token not provided." });
      return;
    }

    const token = authorizationHeader.split(" ")[1];
    const isCustomAuth = token.length < 500;

    let decodeData: any;

    // If token is custom token, do this
    decodeData = jwt.verify(token, SECRET);
    if (token && isCustomAuth) {
      decodeData = jwt.verify(token, SECRET);
      req.id = decodeData?.id;
      req.role = decodeData?.role;
      req.email = decodeData?.email;
    } else {
      // Else if token is google token, then do this
      decodeData = jwt.decode(token);
      req.id = decodeData?.sub;
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Authentication failed. Invalid Token." });
  }
};
