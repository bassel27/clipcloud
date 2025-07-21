import { Router } from 'express';
import { signinHandler, signupHandler, issueNewAccessTokenHandler } from '../controllers/auth.controller';


const router = Router();

// @ts-expect-error - TypeScript overload issue with Express Router
router.post('/signup', signupHandler);
router.post('/signin', signinHandler);
router.post('/refresh-token', issueNewAccessTokenHandler);

export default router;