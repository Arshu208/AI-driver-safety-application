import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendVerificationCode(
  email: string,
  code: string
) {
  // If no email config is provided, simply log the code (useful for dev)
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`[MailService] Mock sending OTP ${code} to ${email}`);
    return;
  }

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "RideSafe AI Verification Code",
    html: `
      <h2>Email Verification</h2>
      <p>Your verification code is:</p>
      <h1>${code}</h1>
    `,
  });
}
