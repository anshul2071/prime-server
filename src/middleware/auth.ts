import {Request, Response, NextFunction} from 'express'

import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { Admin } from '../models/Admin'

interface JwtPayload {
    id: string

}

interface RequestWithUser extends Request {
  user: string;
}

export const protect = (
    req:Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization
    if(!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({message: 'Not authorized'})
    }

    const token = authHeader.split('')[1]

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
        (req as RequestWithUser).user = decoded.id
        next()
    } catch {
        res.status(401).json({message: "Token invalid or expired"})
    }
}




export const protectAdmin = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const admin = await Admin.findById((req as RequestWithUser).user)
        if(!Admin) return res.status(403).json({message: "Not authorized"})
            next()

    } catch {
        res.status(403).json({message: "Not Authorized"})
    }

}
