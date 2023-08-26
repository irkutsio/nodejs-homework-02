const { HttpError } = require('../helpers');

const validateSubscriptionPatch = schema => {
	const func = (req, res, next) => {
		const { error } = schema.validate(req.body);
		if (Object.keys(schema.validate(req.body).value).length === 0) {
			throw HttpError(400, `missing field subscription`);
		}
		if (error) {
			throw HttpError(400, `${error.details[0].message}`);
		}
		next();
	};
	return func;
};

module.exports = validateSubscriptionPatch;