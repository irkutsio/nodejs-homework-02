const { HttpError } = require('../helpers');

const validateBodyPatch = schema => {
	const func = (req, res, next) => {

		if (Object.keys(schema.validate(req.body).value).length === 0) {
			throw HttpError(400, `missing field favorite`);
		}

		next();
	};
	return func;
};

module.exports = validateBodyPatch;
