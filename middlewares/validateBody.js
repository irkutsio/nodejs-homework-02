const { HttpError } = require('../helpers');

const validateBody = schema => {
	const func = (req, res, next) => {
		const { error } = schema.validate(req.body);
		if (Object.keys(schema.validate(req.body).value).length === 0) {
			throw HttpError(400, `missing fields`);
		}
		if (error) {
			if (error.details[0].type.includes('required')) {
				throw HttpError(400, `missing required ${error.details[0].path} field`);
			} else if (error.details[0].type.includes('string')) {
				throw HttpError(400, `${error.details[0].message}`);
			}
		}
		next();
	};
	return func;
};

module.exports = validateBody;
