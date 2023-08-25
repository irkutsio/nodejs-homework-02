const { Schema, model } = require('mongoose');
const { handleMongooseError } = require('../helpers');
const Joi = require('joi');

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const userSchema = new Schema(
	{
		password: {
			type: String,
			required: [true, 'Set password for user'],
		},
		email: {
			type: String,
			required: [true, 'Email is required'],
			unique: true,
			match: emailRegex,
		},
		subscription: {
			type: String,
			enum: ['starter', 'pro', 'business'],
			default: 'starter',
		},
	
		token: String,
	},
	{ versionKey: false }
);

const registerSchema = Joi.object({
	password: Joi.string().min(6).required(),
	email: Joi.string().pattern(emailRegex).required(),
});

const loginSchema = Joi.object({
	password: Joi.string().min(6).required(),
	email: Joi.string().pattern(emailRegex).required(),
});


const subscriptionStatusSchema =  Joi.object({
	subscription : Joi.string().valid('starter', 'pro', 'business').required()
});

userSchema.post('save', handleMongooseError);

const schemas = {
	registerSchema,
	loginSchema,
    subscriptionStatusSchema
};

const User = model('user', userSchema);

module.exports = {
	schemas,
	User,
};
