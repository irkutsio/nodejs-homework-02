const express = require('express');
const {
	validateBody,
	authenticate,
	validateSubscriptionPatch,
	upload,
} = require('../../middlewares');
const { schemas } = require('../../models/user');
const {
	registerController,
	loginController,
	updateAvatar,
	getCurrentController,
	logoutController,
	updateSubscriptionStatus,
	verifyEmailControler,
	resendEmailController
} = require('../../controllers/auth');

const router = express.Router();

module.exports = router;

router.post('/register', validateBody(schemas.registerSchema), registerController);

router.get('/verify/:verificationToken', verifyEmailControler);

router.post('/verify',  validateBody(schemas.emailSchema), resendEmailController)

router.post('/login', validateBody(schemas.loginSchema), loginController);

router.get('/current', authenticate, getCurrentController);

router.post('/logout', authenticate, logoutController);

router.patch('/avatars', authenticate, upload.single('avatar'), updateAvatar);

router.patch(
	'/subscription',
	authenticate,
	validateSubscriptionPatch(schemas.subscriptionStatusSchema),
	updateSubscriptionStatus
);
