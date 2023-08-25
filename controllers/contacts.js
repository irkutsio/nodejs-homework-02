const { HttpError, ctrlWrapper } = require('../helpers');
const { Contact } = require('../models/contact');

const getListContacts = async (req, res) => {
	const { _id: owner } = req.user;
	const { page = 1, limit = 20, favorite } = req.query;
	const skip = (page - 1) * limit;
	let result;
	if (favorite) {
		result = await Contact.find({ favorite: true });
	} else {
		result = await Contact.find({ owner }, '-_id', { skip, limit }).populate('owner', 'email');
	}
	res.json(result);
};

const getOneContact = async (req, res) => {
	const { id } = req.params;
	const result = await Contact.findById(id);

	if (!result) {
		throw HttpError(404, 'Not found');
	}
	res.json(result);
};

const addNewContact = async (req, res) => {
	const { _id: owner } = req.user;
	const result = await Contact.create({ ...req.body, owner });
	res.status(201).json(result);
};

const updateOneContact = async (req, res) => {
	const { id } = req.params;
	const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
	if (!result) {
		throw HttpError(404, 'Not found');
	}
	res.json(result);
};

const updateStatusContact = async (req, res) => {
	const { id } = req.params;
	const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
	if (!result) {
		throw HttpError(404, 'Not found');
	}
	res.json(result);
};

const deleteOneContact = async (req, res) => {
	const { id } = req.params;
	const result = await Contact.findByIdAndDelete(id);
	if (!result) {
		throw HttpError(404, 'Not found');
	}
	res.status(200).json({
		message: 'contact deleted',
	});
};

module.exports = {
	getListContacts: ctrlWrapper(getListContacts),
	getOneContact: ctrlWrapper(getOneContact),
	addNewContact: ctrlWrapper(addNewContact),
	updateOneContact: ctrlWrapper(updateOneContact),
	updateStatusContact: ctrlWrapper(updateStatusContact),
	deleteOneContact: ctrlWrapper(deleteOneContact),
};
