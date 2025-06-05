import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'


import adminRouter from './routes/admin'
import { errorHandler } from './middleware/errorHandler'

dotenv.config()

const app = express ()

const corsOrigin: string[] = [
  process.env.CLIENT_URL! ,      
        
]

app.use(cors({
  origin: corsOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())       

app.use('/api/admin', adminRouter)


app.use((_req, res) => {
  res.status(404).json({ message: 'Not Found' })
})

app.post('/api/debug', (req, res) => {
  console.log('DEBUG /api/debug body:', req.body, 'headers:', req.headers['content-type'])
  res.json({ ok: true, received: req.body })
})

app.use(errorHandler)

export default app;