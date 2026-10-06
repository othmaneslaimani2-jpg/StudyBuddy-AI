import { Request } from 'express';

export interface JwtUserPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

export interface AuthRequest extends Request {
  user?: JwtUserPayload;
}
