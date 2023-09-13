const { FILE_TYPES } = require("./constants");

// Importing the required packages
const cloudinary = require("cloudinary").v2;

exports.uploadFilesToCloudinary = async (
  files,
  folder,
  publicIds,
  fileType,
  height,
  quality
) => {
  try {
    // Use the Cloudinary API to delete the files if publicIds are provided
    if (publicIds && publicIds.length > 0) {
      for (const publicId of publicIds) {
        try {
          const deletionResponse = await cloudinary.uploader.destroy(publicId, {
            resource_type: fileType === FILE_TYPES.VIDEO ? "video" : "image",
          });
          // console.log(
          //   `Deletion response for publicId ${publicId}:`,
          //   deletionResponse
          // );
        } catch (error) {
          console.error(
            `Error deleting file with publicId ${publicId}:`,
            error
          );
          throw error;
        }
      }
    }

    // Upload the files while preserving their original filenames
    const uploadedFiles = [];
    if (!Array.isArray(files)) files = [files];
    for (const file of files) {
      try {
        const options = {
          folder,
          use_filename: true,
          unique_filename: false,
          resource_type: "auto",
        };
        if (height) options.height = height;
        if (quality) options.quality = quality;

        const response = await cloudinary.uploader.upload(
          file.tempFilePath,
          options
        );
        // console.log("File uploaded successfully:", response);
        uploadedFiles.push(response);
      } catch (error) {
        console.error("Error uploading file:", error);
        throw error; // Propagate the error to the calling code
      }
    }

    return uploadedFiles;
  } catch (error) {
    // Handle any errors that occurred during the Cloudinary upload
    console.error(
      "Something went wrong while uploading files to Cloudinary:",
      error
    );
    throw new Error("Failed to upload files to Cloudinary");
  }
};

exports.zipImageArrays = (imagesResponse) => {
  const urls = imagesResponse.map((res) => res.secure_url);
  const publicIds = imagesResponse.map((res) => res.public_id);
  const result = [];
  // Assuming arr1 and arr2 have the same length
  for (let i = 0; i < urls.length; i++)
    result.push({ url: urls[i], publicId: publicIds[i] });
  return result;
};

exports.zipVideoArrays = (videoResponse) => {
  const urls = videoResponse.map((res) => res.secure_url);
  const publicIds = videoResponse.map((res) => res.public_id);
  const durations = videoResponse.map((res) => res.duration);
  const result = [];
  // Assuming arr1 and arr2 have the same length
  for (let i = 0; i < urls.length; i++)
    result.push({
      url: urls[i],
      publicId: publicIds[i],
      duration: durations[i],
    });
  return result;
};

// exports.uploadFilesToCloudinary = async (
//   files,
//   folder,
//   publicIds,
//   fileType,
//   height,
//   quality
// ) => {
//   try {
//     // console.log("Hi Bro files are being uploaded", files);
//     // Use the Cloudinary API to delete the images if exists
//     console.log(publicIds);
//     if (publicIds) {
//       for (const public_id of publicIds) {
//         let deletionResponse;
//         try {
//           if (fileType === FILE_TYPES.VIDEO) {
//             deletionResponse = await cloudinary.uploader.destroy(public_id, {
//               resource_type: FILE_TYPES.VIDEO,
//             });
//           } else {
//             deletionResponse = await cloudinary.uploader.destroy(public_id);
//           }
//           console.log("Deletion response:", deletionResponse);
//           console.log("deletion completed");
//           console.log(public_id);
//         } catch (error) {
//           console.error("Error deleting video:", error);
//         }
//       }
//     }

//     // upload the images
//     const uploadedImages = [];
//     if (!Array.isArray(files)) {
//       files = [files];
//     }
//     for (const file of files) {
//       // Create options object for Cloudinary upload
//       const options = { folder };
//       if (height) options.height = height;
//       if (quality) options.quality = quality;
//       options.resource_type = "auto";
//       // Upload the file to Cloudinary and push the response to the array
//       const response = await cloudinary.uploader.upload(
//         file.tempFilePath,
//         options
//       );
//       uploadedImages.push(response);
//     }
//     return uploadedImages;
//   } catch (error) {
//     // Handle any errors that occurred during the Cloudinary upload
//     console.log("Something went wrong while uploading a file to Cloudinary");
//     console.error(error);
//     throw new Error("Failed to upload file to Cloudinary");
//   }
// };
