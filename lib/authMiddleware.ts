import JWT from "jsonwebtoken";
import User from "../models/User";
import { NextRequest } from "next/server";

export interface AuthenticatedRequest extends NextRequest {
  user?: any;
}

export const requireSignIn = async (req: AuthenticatedRequest) => {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      throw new Error('Access Denied');
    }
    const decode = JWT.verify(token, process.env.JWT_SECRET!);
    req.user = decode;
    return decode;
  } catch (error) {
    throw new Error('Access Denied');
  }
};

export const isAdmin = async (req: AuthenticatedRequest) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.role !== 1) {
      throw new Error('UnAuthorized Access');
    }
    return true;
  } catch (error) {
    throw new Error('UnAuthorized Access');
  }
};