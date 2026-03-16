const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

/**
 * Uploads a buffer to Cloudinary using streams
 * @param {Buffer} buffer - File buffer
 * @param {String} folder - Cloudinary folder name
 * @returns {Promise} - Cloudinary upload result
 */
exports.uploadFromBuffer = (buffer, folder = 'rte-grievances') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

/**
 * Deletes an image from Cloudinary
 * @param {String} publicId - Cloudinary public ID
 * @returns {Promise}
 */
exports.deleteFromCloudinary = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId);
};
