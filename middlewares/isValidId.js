const { isValidObjectId } = require('mongoose');
const { HttpError } = require('../helpers');

const isValidId = (req, res, next) => {
	const { id } = req.params;
	if (!isValidObjectId(id)) {
		next(HttpError(400, `Invalid Id ${id}`));
	}
	next();
};

module.exports = isValidId;
