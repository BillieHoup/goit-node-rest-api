import express from 'express';
import {
  register,
  verifyEmail,
  resendVerifyEmail,
  login,
  logout,
  getCurrent,
  updateSubscription,
  updateAvatar,
} from '../controllers/authControllers.js';
import validateBody from '../helpers/validateBody.js';
import auth from '../helpers/auth.js';
import {
  registerSchema,
  emailSchema,
  loginSchema,
  subscriptionSchema,
} from '../schemas/usersSchemas.js';
import { upload } from '../helpers/upload.js';

const router = express.Router();

router.post('/register', validateBody(registerSchema), register);
router.get('/verify/:verificationToken', verifyEmail);
router.post('/verify', validateBody(emailSchema), resendVerifyEmail);
router.post('/login', validateBody(loginSchema), login);
router.post('/logout', auth, logout);
router.get('/current', auth, getCurrent);
router.patch('/', validateBody(subscriptionSchema), auth, updateSubscription);

router.patch('/avatars', auth, upload.single('avatar'), updateAvatar);

export default router;
