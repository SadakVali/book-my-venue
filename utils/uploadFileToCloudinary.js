const { FILE_TYPES } = require("./constants");

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
  publicIds,
  fileType,
  height,
  quality
) => {
  try {
    // console.log("Hi Bro files are being uploaded", files);
    // Use the Cloudinary API to delete the images if exists
    console.log(publicIds);
    if (publicIds) {
      for (const public_id of publicIds) {
        try {
          if (fileType === FILE_TYPES.VIDEO) {
            const deletionResponse = await cloudinary.uploader.destroy(
              public_id,
              { resource_type: FILE_TYPES.VIDEO }
            );
          } else {
            const deletionResponse = await cloudinary.uploader.destroy(
              public_id
            );
          }
          console.log("Deletion response:", deletionResponse);
          console.log("deletion completed");
          console.log(public_id);
        } catch (error) {
          console.error("Error deleting video:", error);
        }
      }
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
