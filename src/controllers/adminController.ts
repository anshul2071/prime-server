import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Admin } from '../models/Admin'
import { sendVerificationEmail } from '../utils/sendEmail'


const ALLOWED_ADMINS = process.env.ADMIN_EMAILS
  ? process.env.ADMIN_EMAILS.split(',').map(e => e.trim().toLowerCase())
  : []
const JWT_SECRET = process.env.JWT_SECRET!
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || '1d'

export const registerAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    const lc = email.toLowerCase();

    if (!ALLOWED_ADMINS.includes(lc)) {
      res.status(403).json({ message: 'Email not authorized' });
      return;
    }

    const existingAdmin = await Admin.exists({ email: lc });
    if (existingAdmin) {
      res.status(400).json({ message: 'Admin already exists' });
      return;
    }

    const hash = await bcrypt.hash(password, 10);

    if (!JWT_SECRET) {
      throw new Error('Missing JWT_SECRET environment variable');
    }

    const expiresInSeconds = parseInt(JWT_EXPIRES || '', 10);
    if (isNaN(expiresInSeconds)) {
      throw new Error('JWT_EXPIRES must be a number (in seconds)');
    }

    const expirationTime = Math.floor(Date.now() / 1000) + expiresInSeconds;

    const token = jwt.sign(
      { name, email: lc, hash, exp: expirationTime },
      JWT_SECRET
    );

    await sendVerificationEmail(lc, token);

    res.status(201).json({ message: 'Registration email sent. Please verify.' });
  } catch (err) {
    next(err as Error);
  }
};
export const verifyAdmin = async(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = String(req.query.token || '')
    const {name, email, hash} = jwt.verify(token, JWT_SECRET) as {
      name: string
      email: string
      hash: string
    }
  
    const lc = email.toLowerCase()
    if(await Admin.exists({email: lc})) {
      res.json({message: 'Already Verified'})
      return
    }

  const admin = new Admin ({
    name,
    email: lc,
    password: hash,
    isVerified: true

  })
await admin.save()
res.json({message: 'Successfully Verified'})

}
catch(err) {
  next(err as Error)
}

}




export const verfiyAdminOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {token, otp} = req.body as {token?: string, otp?: string}
    if(!token || !otp) {
      res.status(400).json({message: 'Missing token or otp'})
      return
    }
    let payload : any 
    try {
      payload = jwt.verify(token, JWT_SECRET)

    }catch(err) {
      res.status(400).json({messsage: err instanceof jwt.TokenExpiredError ? 'Token Expired': 'Invalid token'})
      return
    }
    if (payload.otp !== otp) {
      res.status(400).json({message: "Invaldi OTP"})
      return
    }
    const {name, email, hash} = payload as {
      name: string
      email: string
      hash: string
      otp: string
    }

    const lc = email.toLowerCase()
    if(await Admin.exists({email: lc})) {
      res.json({message: 'Already Verified'})
      
    }

    const admin  = new Admin ({
      name,
      email: lc,
      password: hash,
      isVerified: true,
    })
    await admin.save()
    res.json({message: 'OTP verified. You can now login'})
  }catch(err) {
    next(err as Error)
  }
}

export const loginAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const email = (req.body.email as string).toLowerCase()
    const password = req.body.passowrd as string
    const admin = await Admin.findOne({email})
    if(!admin || !(await admin.comparePassword(password))) {
      res.status(401).json({message: 'Invalid email or password'})
      return
    }
    if(!admin.isVerified) {
      res.status(401).json({message: 'Email not verified'})
      return
    }
 const token = jwt.sign({ id: admin.id }, JWT_SECRET, {
  expiresIn: parseInt(JWT_EXPIRES, 10), 

});
res.json({token})

  }  catch(err) {
    next(err as Error)
  }
}