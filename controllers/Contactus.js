import contactusFormResponse from "../mail/templates/contactusFormResponse";
import sendMail from "../utils/sendMail";

export const contactUsController = async (req, res) => {
  // Destructure request body
  const { email, firstName, lastName, message, phoneNo, countryCode } =
    req.body;

  try {
    // Validate request data (optional but recommended)
    if (!email || !firstName || !message) {
      return res.status(400).json({
        success: false,
        message: "Email, firstName, and message are required fields.",
      });
    }

    // Send contact form response email
    const emailResponse = await sendMail(
      email,
      "Your Data Sent Successfully",
      contactusFormResponse(
        email,
        firstName,
        lastName,
        message,
        phoneNo,
        countryCode
      )
    );

    // Log the email response for debugging (optional)
    console.log("Email Response", emailResponse);

    // Return a success response
    return res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error(error);

    // Return an error response if something goes wrong
    return res.status(500).json({
      success: false,
      message: "Something went wrong while sending the email.",
    });
  }
};
