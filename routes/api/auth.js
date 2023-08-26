const express = require('express');
const { validateBody, authenticate, validateSubscriptionPatch } = require('../../middlewares');
const { schemas } = require('../../models/user');
const { registerController, loginController, getCurrentController,logoutController,updateSubscriptionStatus } = require('../../controllers/auth');

const router = express.Router();

module.exports = router;

router.post('/register', validateBody(schemas.registerSchema), registerController)

router.post('/login', validateBody(schemas.loginSchema), loginController)

router.get('/current', authenticate, getCurrentController)

router.post('/logout', authenticate, logoutController)

router.patch('/:id/subscription', authenticate,  validateSubscriptionPatch(schemas.subscriptionStatusSchema), updateSubscriptionStatus )
