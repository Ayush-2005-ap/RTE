const { createClient } = require('@supabase/supabase-js');

let _supabase = null;

const getClient = () => {
  if (!_supabase) {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
      throw new Error('Supabase credentials are not configured. Set SUPABASE_URL and SUPABASE_SERVICE_KEY in .env');
    }
    _supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY  // Use service key for server-side uploads
    );
  }
  return _supabase;
};

const BUCKET_NAME = 'publications';

/**
 * Upload a PDF buffer to Supabase Storage
 * @param {Buffer} fileBuffer - File buffer from multer
 * @param {string} originalName - Original file name
 * @returns {{ pdfUrl: string, pdfPath: string }}
 */
exports.uploadPDF = async (fileBuffer, originalName) => {
  const supabase = getClient();
  const timestamp = Date.now();
  const sanitizedName = originalName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const filePath = `${timestamp}_${sanitizedName}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, fileBuffer, {
      contentType: 'application/pdf',
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
    pdfUrl: urlData.publicUrl,
    pdfPath: filePath
  };
};

/**
 * Delete a PDF from Supabase Storage
 * @param {string} filePath - The stored path in Supabase
 */
exports.deletePDF = async (filePath) => {
  if (!filePath) return;

  const supabase = getClient();

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([filePath]);

  if (error) {
    console.error(`Supabase delete failed: ${error.message}`);
  }
};
