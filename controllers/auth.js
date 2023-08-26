const bcrypt = require('bcrypt');
const { User } = require('../models/user');
const { ctrlWrapper, HttpError } = require('../helpers');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { SECRET_KEY } = process.env;

const registerController = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	if (user) {
		throw HttpError(409, 'Email in use');
	}
	const hashPassword = await bcrypt.hash(password, 10);
	const newUser = await User.create({ ...req.body, password: hashPassword });
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
	const { id } = req.params;
	const result = await User.findByIdAndUpdate(id, req.body, { new: true });
	if (!result) {
		throw HttpError(404, 'Not found');
	}
	const { email, subscription } = result;

	res.json({ email, subscription });
};

module.exports = {
	registerController: ctrlWrapper(registerController),
	loginController: ctrlWrapper(loginController),
	getCurrentController: ctrlWrapper(getCurrentController),
	logoutController: ctrlWrapper(logoutController),
	updateSubscriptionStatus,
};
