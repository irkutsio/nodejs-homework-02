const express = require('express');
const router = express.Router();

const {
	getListContacts,
	getOneContact,
	addNewContact,
	updateOneContact,
	updateStatusContact,
	deleteOneContact,
} = require('../../controllers/contacts.js');

const { validateBody, isValidId, validateBodyPatch, authenticate } = require('../../middlewares');

const { schemas } = require('../../models/contact.js');

router.get('/', authenticate, getListContacts);

router.get('/:id', authenticate, isValidId, getOneContact);

router.post('/', authenticate, validateBody(schemas.addSchema), addNewContact);

router.put('/:id', authenticate, isValidId, validateBody(schemas.addSchema), updateOneContact);

router.patch(
	'/:id/favorite',
	authenticate,
	isValidId,
	validateBodyPatch(schemas.updateFavoriteSchema),
	updateStatusContact
);

router.delete('/:id', authenticate, isValidId, deleteOneContact);

module.exports = router;
