import { User } from "../types/custom";

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}

export {};
