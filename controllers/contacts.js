const { HttpError, ctrlWrapper } = require('../helpers');
const { Contact } = require('../models/contact');

const getListContacts = async (req, res) => {
	const result = await Contact.find();
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
	const result = await Contact.create(req.body);
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
