import { Router } from 'express';

import { errorWrap } from '../middleware';
import { AuthController } from '../controllers';

const router = Router();

// GET /api/auth/currentUser
router.get('/currentUser', errorWrap(AuthController.getCurrentUser));

// GET /api/auth/loggedin
router.get('/loggedin', errorWrap(AuthController.getLoginStatus));

// GET /api/auth/login
router.get('/login', errorWrap(AuthController.login));

// GET /api/auth/redirectURI
router.get('/redirectURI', errorWrap(AuthController.redirectURI));

// GET /api/auth/google/callback
router.get('/google/callback', errorWrap(AuthController.receiveGoogleCallback));

// GET /api/auth/logout
router.put('/logout', errorWrap(AuthController.logout));

export default router;
