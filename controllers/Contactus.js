import contactusFormEmailTemplate from "../mail/templates/contactusFormEmailTemplate";
import sendMail from "../utils/sendMail";
import { ADMIN_CONSTANTS } from "../utils/constants";

export const contactUsController = async (req, res) => {
  // Destructure request body
  const { email, name, message, contactNumber } = req.body;

  try {
    // Validate request data (optional but recommended)
    if (!email || !name || !message) {
      return res.status(400).json({
        success: false,
        message: "Email, name, and message are required fields.",
      });
    }

    // Send contact form response email
    const emailResponse = await sendMail(
      email,
      "Your Data Sent Successfully",
      contactusFormEmailTemplate(
        email,
        name,
        message,
        contactNumber,
        (toCustomer = true)
      )
    );

    // Send contact form response email
    await sendMail(
      ADMIN_CONSTANTS.EMAIL,
      "FeedBack from a BookMyHall Customer",
      contactusFormEmailTemplate(
        email,
        name,
        message,
        contactNumber,
        (toCustomer = false)
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
