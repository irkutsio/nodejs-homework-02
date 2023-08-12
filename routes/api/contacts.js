const express = require('express');
const router = express.Router();

const {
	getListContacts,
	getOneContact,
	addNewContact,
	updateOneContact,
	deleteOneContact,
} = require('../../controllers/contacts.js');

router.get('/', getListContacts);

router.get('/:id', getOneContact);

router.post('/', addNewContact);

router.put('/:id', updateOneContact);

router.delete('/:id', deleteOneContact);

module.exports = router;
