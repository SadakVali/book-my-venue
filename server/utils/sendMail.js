// importing the packages
const nodemailer = require("nodemailer");

const sendMail = async (email, title, body) => {
  try {
    const { MAIL_HOST, MAIL_USER, MAIL_PASS } = process.env;

    // Create a transporter for nodemailer
    let transporter = nodemailer.createTransport({
      host: MAIL_HOST,
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
      },
    });

    // Configure and send the email
    let info = await transporter.sendMail({
      from: `StudyNotion || CodeHelp - by <${MAIL_USER}>`,
      to: [email],
      subject: title,
      html: body, //html body
    });

    console.log(info.response);
    return info;
  } catch (error) {
    console.error("Error occurred while sending mail:", error);
    throw new Error("Failed to send email: " + error);
  }
};

module.exports = sendMail;
