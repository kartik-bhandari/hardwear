import nodemailer from 'nodemailer';

export const sendOTPEmail = async (email, otp) => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || 'HARD-WEAR <noreply@hardwear.dev>';

  if (!host || !user || !pass) {
    console.warn('[SMTP] Credentials not configured. Falling back to console log.');
    console.log(`\n==========================================`);
    console.log(`[OTP Verification] Code for ${email} is: ${otp}`);
    console.log(`==========================================\n`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port: Number(port) || 587,
    secure: Number(port) === 465, // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from,
    to: email,
    subject: `${otp} is your Hard-Wear Verification Code`,
    text: `Your Hard-Wear registration verification code is ${otp}. This code is valid for 5 minutes. If you did not request this code, please ignore this email.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #1e1e1e; background-color: #0c0c0c; color: #f0ede6;">
        <h2 style="color: #3f1f72; font-family: 'Arial Black', Gadget, sans-serif; text-transform: uppercase; letter-spacing: 2px;">HARD-WEAR</h2>
        <p style="font-size: 16px; line-height: 1.5; color: #f0ede6;">Verify your email address to complete registration.</p>
        <div style="background-color: #161616; border: 1px solid #1e1e1e; padding: 15px; text-align: center; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #3f1f72;">${otp}</span>
        </div>
        <p style="font-size: 14px; color: #666666; line-height: 1.5;">This verification code is valid for 5 minutes. If you did not request this verification code, please ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #1e1e1e; margin: 20px 0;" />
        <p style="font-size: 12px; color: #333333; text-align: center; letter-spacing: 1px;">www.hard-wear.in</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[SMTP] Email sent successfully to ${email}. MessageID: ${info.messageId}`);
  } catch (error) {
    console.error(`[SMTP] Error sending email to ${email}:`, error);
    // Fallback to console log in case of SMTP failure
    console.log(`\n==========================================`);
    console.log(`[OTP Verification] Code for ${email} is: ${otp}`);
    console.log(`==========================================\n`);
  }
};
