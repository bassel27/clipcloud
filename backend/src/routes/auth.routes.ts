import { Router } from 'express';
import { signupHandler } from '../controllers/auth.controller';


const router = Router();

// @ts-expect-error - TypeScript overload issue with Express Router
router.post('/', signupHandler);

export default router;