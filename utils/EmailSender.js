const nodemailer = require("nodemailer");
const { OK_RC, INTERNAL_SERVER_ERROR_RC } = require("./ResponseCodes");

const sendEmail = async (toEmail, subject, message) => {
  try {
    const transport = nodemailer.createTransport({
      pool: true,
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const sendEmailResponse = await transport.sendMail({
      from: process.env.EMAIL_USERNAME,
      to: toEmail,
      subject: subject,
      text: message,
    });

    if (
      sendEmailResponse.rejected.length === 0 &&
      sendEmailResponse.messageId !== undefined &&
      sendEmailResponse.messageId !== null &&
      sendEmailResponse.messageId.toString().length > 0
    ) {
      return {
        message: `Email sent successfully to ${toEmail}`,
        success: true,
        status: OK_RC,
      };
    } else {
      return {
        message: `Something went wrong sending email`,
        success: false,
        status: INTERNAL_SERVER_ERROR_RC,
      };
    }
  } catch (err) {
    return {
      message: `Error sending email to ${toEmail}`,
      success: false,
      status: 500,
    };
  }
};

exports.sendForgotPasswordEmail = async (
  email,
  temporaryPassword,
  expiredInMinutes
) => {
  const subject = "Forgot Password";
  const message = `Your one time password is: ${temporaryPassword}. Valid for ${expiredInMinutes} minutes only`;

  return await sendEmail(email, subject, message);
};

exports.sendPasswordChangedSuccessEmail = async (email) => {
  const subject = "Password changed successfully";
  const message = `The password of your account is changed successfully`;

  return await sendEmail(email, subject, message);
};
