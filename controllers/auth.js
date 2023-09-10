const bcrypt = require('bcrypt');
const gravatar = require('gravatar');
const path = require('path');
const fs = require('fs').promises;
const { nanoid } = require('nanoid');
const { User } = require('../models/user');
const { ctrlWrapper, HttpError, resizeAvatar, sendEmail } = require('../helpers');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { SECRET_KEY, BASE_URL } = process.env;

const avatarsDir = path.join(__dirname, '../', 'public', 'avatars');

const registerController = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });

	if (user) {
		throw HttpError(409, 'Email in use');
	}
	const hashPassword = await bcrypt.hash(password, 10);
	const avatarURL = gravatar.url(email);
	const verificationToken = nanoid();
	const newUser = await User.create({
		...req.body,
		password: hashPassword,
		avatarURL,
		verificationToken,
	});

	const verifyEmail = {
		to: email,
		subject: 'Verify email',
		html: `<a href="${BASE_URL}/users/verify/${verificationToken}"> Please, confirm your email </a>`,
	};

	await sendEmail(verifyEmail);

	res.status(201).json({
		user: {
			email: newUser.email,
			subscription: newUser.subscription,
		},
	});
};

const verifyEmailControler = async (req, res) => {
	const { verificationToken } = req.params;
	const user = await User.findOne({ verificationToken });
	if (!user) {
		throw HttpError(401, 'Email not verify')
	}

	await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: null });

	res.json({
		message: 'Verification successful',
	});
};

const resendEmailController = async (req, res) => {
	const { email } = req.body;
	const user = await User.findOne({ email });
	if (!user) {
		throw HttpError(404, 'User not found');
	}
	if (user.verify) {
		res.status(400).json({
			message: 'Verification has already been passed',
		});
	}
	const verifyEmail = {
		to: email,
		subject: 'Verify email',
		html: `<a href="${BASE_URL}/users/verify/${user.verificationToken}"> Click verify email </a>`,
	};

	await sendEmail(verifyEmail);

	res.status(200).json({
		message: 'Verification email sent',
	});
};

const loginController = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	if (!user) {
		throw HttpError(401, 'Email or password is wrong');
	}

	if (!user.verify) {
		throw HttpError(404, 'User not found');
	}

	const passwordCompare = await bcrypt.compare(password, user.password);
	if (!passwordCompare) {
		throw HttpError(401, 'Email or password is wrong');
	}

	const payload = {
		id: user._id,
	};

	const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '23h' });
	await User.findByIdAndUpdate(user._id, { token });

	res.json({
		token,
		user: {
			email: user.email,
			subscription: user.subscription,
		},
	});
};

const getCurrentController = (req, res) => {
	const { email, subscription } = req.user;
	res.json({ email, subscription });
};

const logoutController = async (req, res) => {
	const { _id } = req.user;
	await User.findByIdAndUpdate(_id, { token: '' });
	res.status(204).send();
};

const updateSubscriptionStatus = async (req, res) => {
	const { _id } = req.user;
	const result = await User.findByIdAndUpdate(_id, req.body, { new: true });
	if (!result) {
		throw HttpError(404, 'Not found');
	}
	const { email, subscription } = result;

	res.json({ email, subscription });
};

const updateAvatar = async (req, res) => {
	const { _id } = req.user;
	const { path: tmpUpload, originalname } = req.file;
	const fileName = `${_id}_${originalname}`;
	const resultUpload = path.join(avatarsDir, fileName);

	resizeAvatar(tmpUpload, resultUpload);

	await fs.rename(tmpUpload, resultUpload);
	const avatarURL = path.join('avatars', fileName);
	await User.findByIdAndUpdate(_id, { avatarURL });

	res.json({
		avatarURL,
	});
};

module.exports = {
	registerController: ctrlWrapper(registerController),
	loginController: ctrlWrapper(loginController),
	getCurrentController: ctrlWrapper(getCurrentController),
	logoutController: ctrlWrapper(logoutController),
	updateSubscriptionStatus,
	updateAvatar: ctrlWrapper(updateAvatar),
	verifyEmailControler: ctrlWrapper(verifyEmailControler),
	resendEmailController: ctrlWrapper(resendEmailController),
};
