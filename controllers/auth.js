const bcrypt = require('bcrypt');
const gravatar = require('gravatar');
const path = require('path');
const fs = require('fs').promises;
const { User } = require('../models/user');
const { ctrlWrapper, HttpError, resizeAvatar } = require('../helpers');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { SECRET_KEY } = process.env;

const avatarsDir = path.join(__dirname, '../', 'public', 'avatars');

const registerController = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });

	if (user) {
		throw HttpError(409, 'Email in use');
	}
	const hashPassword = await bcrypt.hash(password, 10);
	const avatarURL = gravatar.url(email);
	const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL });

	res.status(201).json({
		user: { email: newUser.email, subscription: newUser.subscription },
	});
};

const loginController = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	if (!user) {
		throw HttpError(401, 'Email or password is wrong');
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
};
