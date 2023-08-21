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

const {validateBody, isValidId, validateBodyPatch} = require('../../middlewares');

const { schemas } = require('../../models/contact.js');



router.get('/', getListContacts);

router.get('/:id',isValidId, getOneContact);

router.post('/',validateBody(schemas.addSchema), addNewContact);

router.put('/:id', isValidId, validateBody(schemas.addSchema), updateOneContact);

router.patch('/:id/favorite', isValidId, validateBodyPatch(schemas.updateFavoriteSchema), updateStatusContact )

router.delete('/:id',isValidId, deleteOneContact);

module.exports = router;
