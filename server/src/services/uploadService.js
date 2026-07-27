const supabase = require('../config/supabase');

/**
 * Uploads a buffer to Supabase Storage
 * @param {Buffer} buffer - File buffer
 * @param {String} folder - Folder name within the bucket
 * @returns {Promise<Object>} - Mock Cloudinary result { secure_url, public_id }
 */
exports.uploadFromBuffer = async (buffer, folder = 'rte-grievances', mimetype = 'image/jpeg') => {
  const BUCKET_NAME = 'rte-bucket';
  
  // Generate a unique filename using timestamp and a random string
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const filePath = `${folder}/${timestamp}_${randomStr}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, buffer, {
      contentType: mimetype,
      upsert: false
    });

  if (error) {
    throw new Error(`Supabase upload failed: ${error.message}`);
  }

  // Get the public URL
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return {
    secure_url: urlData.publicUrl,
    public_id: filePath // We'll store the full path as the "public_id" so we can delete it easily
  };
};

/**
 * Deletes a file from Supabase Storage
 * @param {String} publicId - The filePath in the bucket
 * @returns {Promise}
 */
exports.deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  const BUCKET_NAME = 'rte-bucket';

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([publicId]);

  if (error) {
    console.error(`Supabase delete failed: ${error.message}`);
    // Don't throw here to avoid blocking other operations if a file is already deleted
  }
};
