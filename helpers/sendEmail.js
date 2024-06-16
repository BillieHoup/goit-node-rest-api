import "dotenv/config";
import nodemailer from "nodemailer";

const { META_EMAIL, META_PASSWORD } = process.env;

const config = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: META_EMAIL,
    pass: META_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(config);

export const sendEmail = async (data) => {
  const email = { ...data, from: META_EMAIL };
  try {
    await transporter.sendMail(email);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};
