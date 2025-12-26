import nodemailer from "nodemailer";
import { WELCOME_EMAIL_TEMPLATE } from "./templates";
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});
export const sendWelcomeEmail = async ({
  email,
  name,
  intro,
}: WelcomeEmailData) => {
  const htmlTemplate = WELCOME_EMAIL_TEMPLATE.replace("{{name}}", name).replace(
    "{{intro}}",
    intro
  );
  const mailOptions = {
    from: `Singalist <singalist@js.pro>`,
    to: email,
    subject: "Welcome to Singalist - your stock market toolkit is ready! ",
    text: "Thanks for joining Singalist! We're excited to have you on board. Explore our tools and resources to enhance your stock market experience.",
    html: htmlTemplate,
  };
  await transporter.sendMail(mailOptions);
};
