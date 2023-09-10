// Importing the required packages
const cloudinary = require("cloudinary").v2;

/**
 * Uploads a file to Cloudinary with optional height and quality parameters.
 * @param {Object} file - The file object containing the temporary file path.
 * @param {string} folder - The destination folder in Cloudinary.
 * @param {number} [height] - The optional height of the uploaded image.
 * @param {number} [quality] - The optional quality of the uploaded image (1-100).
 * @returns {Promise<Object>} - A Promise that resolves to the Cloudinary response object.
 */

exports.uploadFilesToCloudinary = async (
  files,
  folder,
  height,
  quality,
  public_ids
) => {
  try {
    // console.log("Hi Bro files are being uploaded", files);
    // Use the Cloudinary API to delete the images if exists
    if (public_ids) {
      for (const public_id of public_ids)
        await cloudinary.uploader.destroy(public_id);
    }

    // upload the images
    const uploadedImages = [];
    if (!Array.isArray(files)) {
      files = [files];
    }
    for (const file of files) {
      // Create options object for Cloudinary upload
      const options = { folder };
      if (height) options.height = height;
      if (quality) options.quality = quality;
      options.resource_type = "auto";
      // Upload the file to Cloudinary and push the response to the array
      const response = await cloudinary.uploader.upload(
        file.tempFilePath,
        options
      );
      uploadedImages.push(response);
    }
    return uploadedImages;
  } catch (error) {
    // Handle any errors that occurred during the Cloudinary upload
    console.log("Something went wrong while uploading a file to Cloudinary");
    console.error(error);
    throw new Error("Failed to upload file to Cloudinary");
  }
};
