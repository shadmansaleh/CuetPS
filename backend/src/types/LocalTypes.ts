import { Request } from "express";
import { Document } from "mongoose";

export type AuthRequest = Request & {
  user?: JWT_USER;
};

export type JWT_USER = {
  name: string;
  id: string;
  role: UserRole;
};

export type User = Document & {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  profile_pic: string;
  first_name: string;
  last_name: string;
  designation: string;
  phone: string;
  location: string;
  timezone: string;
  companies: string[];
};

export type Session = Document & {
  id: string;
  token: string;
};

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}
