const { HttpError } = require('../helpers');

const validateBodyPatch = schema => {
	const func = (req, res, next) => {
		const { error } = schema.validate(req.body);
		if (Object.keys(schema.validate(req.body).value).length === 0) {
			throw HttpError(400, `missing field favorite`);
		}
		if (error) {
			throw HttpError(400, `${error.details[0].message}`);
		}
		next();
	};
	return func;
};

module.exports = validateBodyPatch;
