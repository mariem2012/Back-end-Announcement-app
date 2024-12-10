
import express from 'express';
import { registerUser, loginUser, resetPassword, requestPasswordReset } from '../controllers/authController.js';
import { registerValidator, loginValidator } from '../middlewares/validators/authValidator.js';


const router = express.Router();

router.post('/reset-password', resetPassword);
router.post('/request-reset-password', requestPasswordReset);
router.post('/register', registerValidator, registerUser);
router.post('/login', loginValidator, loginUser);

export default router;
