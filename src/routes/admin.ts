import { Router } from 'express'
import {
  registerAdmin,
  verifyAdmin,
  loginAdmin
} from '../controllers/adminController'
const router = Router()

router.post('/register', registerAdmin)
router.get('/verify', verifyAdmin)
router.post('/login', loginAdmin)

export default router
