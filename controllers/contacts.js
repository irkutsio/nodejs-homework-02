const {
	listContacts,
	getContactById,
	removeContact,
	addContact,
	updateContact,
} = require('../models/contacts');

const { HttpError, dataValidation, ctrlWrapper } = require('../helpers');

const getListContacts = async (req, res) => {
	const result = await listContacts();
	res.json(result);
};

const getOneContact = async (req, res) => {
	const { id } = req.params;
	const result = await getContactById(id);

	if (!result) {
		throw HttpError(404, 'Not found');
	}
	res.json(result);
};

const addNewContact = async (req, res) => {
	const validatedData = dataValidation(req.body);
	if (validatedData.error) {
		if (validatedData.error.details[0].type.includes('required')) {
			throw HttpError(400, `missing required ${validatedData.error.details[0].path} field`);
		} else if (validatedData.error.details[0].type.includes('string')) {
			throw HttpError(400, `${validatedData.error.details[0].message}`);
		}
	}
	const result = await addContact(validatedData.value);
	res.status(201).json(result);
};

const updateOneContact = async (req, res) => {
	const data = req.body;
	const { id } = req.params;
	const validatedData = dataValidation(data);
	if (Object.keys(validatedData.value).length === 0) {
		throw HttpError(400, `missing fields`);
	}
	if (validatedData.error) {
		if (validatedData.error.details[0].type.includes('required')) {
			throw HttpError(400, `missing required ${validatedData.error.details[0].path} field`);
		} else if (validatedData.error.details[0].type.includes('string')) {
			throw HttpError(400, `${validatedData.error.details[0].message}`);
		}
	}
	const result = await updateContact(id, validatedData.value);
	if (!result) {
		throw HttpError(404, 'Not found');
	}
	res.status(200).json(result);
};

const deleteOneContact = async (req, res) => {
	const { id } = req.params;
	const result = await removeContact(id);
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
	deleteOneContact: ctrlWrapper(deleteOneContact),
};
