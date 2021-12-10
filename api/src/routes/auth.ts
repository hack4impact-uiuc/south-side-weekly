import { Router } from 'express';

import { errorWrap } from '../middleware';
import * as authController from '../controllers/auth.controller';

const router = Router();

// GET /api/auth/currentUser
router.get('/currentUser', errorWrap(authController.getCurrentUser));

// GET /api/auth/loggedin
router.get('/loggedin', errorWrap(authController.getLoginStatus));

// GET /api/auth/login
router.get('/login', errorWrap(authController.login));

// GET /api/auth/redirectURI
router.get('/redirectURI', errorWrap(authController.redirectURI));

// GET /api/auth/google/callback
router.get('/google/callback', errorWrap(authController.receiveGoogleCallback));

// GET /api/auth/logout
router.get('/logout', errorWrap(authController.logout));

export default router;
