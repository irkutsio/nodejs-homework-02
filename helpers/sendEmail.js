const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const { API_KEY_SENDGRID } = process.env;

sgMail.setApiKey(API_KEY_SENDGRID);


const sendEmail = async data => {
	const email = { ...data, from: 'kutsevol.iryna18@gmail.com' };
    await sgMail.send(email)
    return true
};


module.exports = sendEmail