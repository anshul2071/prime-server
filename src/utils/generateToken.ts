import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config();




const JWT_SECRET: string = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

export const generateToken = (id: string): string => {
  const expirationTime = Math.floor(Date.now() / 1000) + parseInt(JWT_EXPIRES_IN, 10);
  return jwt.sign({ id, exp: expirationTime }, JWT_SECRET);
};