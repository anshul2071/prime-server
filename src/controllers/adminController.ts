import {Request, Response, NextFunction} from 'express'
import { Admin } from '../models/Admin'
import { generateToken } from '../utils/generateToken'
import { sendVerifcationEmail } from '../utils/sendEmail'
import {sign, verify} from 'jsonwebtoken'

const ALLOWED_ADMINS = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split('').map((e) => e.trim().toLowerCase()) : []



export const registerAdmin = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const {name, email, password} = req.body
        if (!ALLOWED_ADMINS.includes(email.toLowerCase())) {
                return res.status(403).json({ message: 'Email is not authorized to register as admin' })

           }  

           const existing = await Admin.findOne({email})
           if(existing) {
            return res.status(400).json({message: 'Admin already Exists'})
           }

           const admin = new Admin({name, email, password})
           await admin.save()


           const token = generateToken(admin.id)
           await sendVerifcationEmail(email, token)

           res.status(201).json({message: 'Registration successful. Check email for verification link '})
           


    } catch (err) {
        next(err)
    }
}




export const verifyAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction


) => {
    try {
        const token = req.query.token as string
        const decoded = (await import('jsonwebtoken')).verify(token, process.env.JWT_SECRET!) as {id: string}
        const admin = await Admin.findById(decoded.id)
        if(!admin) return res.status(400).json({message: 'Invalid token'})
         admin.isVerified = true 
         await admin.save()

         res.json({message: "Email Verified. You can now login"})
         } catch(err) {
            next (err)
         }
           
}