const jimp = require('jimp');

const resizeAvatar = async (tmpUpload, resultUpload) => {
	const image = await jimp.read(tmpUpload);
	await image.cover(250, 250).quality(99);
	await image.writeAsync(resultUpload);
};

module.exports = resizeAvatar;
