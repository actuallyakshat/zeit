import { createTransport } from "nodemailer";

const transporter = createTransport({
  host: process.env.EMAIL_HOST,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendMail = async (to: string, subject: string, html: string) => {
  const info = await transporter.sendMail({
    from: `"${process.env.EMAIL_USER}" <${process.env.EMAIL_NAME}>`,
    to,
    subject,
    html,
  });
  return info;
};

export { transporter, sendMail };
