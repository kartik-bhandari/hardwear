export const sendOTPEmail = async (email, otp) => {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM || 'onboarding@resend.dev';

  if (!apiKey) {
    console.warn('[Resend] API Key not configured. Falling back to console log.');
    console.log(`\n==========================================`);
    console.log(`[OTP Verification] Code for ${email} is: ${otp}`);
    console.log(`==========================================\n`);
    return;
  }

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #1e1e1e; background-color: #0c0c0c; color: #f0ede6;">
      <h2 style="color: #3b127c; font-family: 'Arial Black', Gadget, sans-serif; text-transform: uppercase; letter-spacing: 2px;">HARDWEAR</h2>
      <p style="font-size: 16px; line-height: 1.5; color: #f0ede6;">Verify your email address to complete registration.</p>
      <div style="background-color: #161616; border: 1px solid #1e1e1e; padding: 15px; text-align: center; margin: 20px 0;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #3b127c;">${otp}</span>
      </div>
      <p style="font-size: 14px; color: #666666; line-height: 1.5;">This verification code is valid for 5 minutes. If you did not request this verification code, please ignore this email.</p>
      <hr style="border: 0; border-top: 1px solid #1e1e1e; margin: 20px 0;" />
      <p style="font-size: 12px; color: #333333; text-align: center; letter-spacing: 1px;">www.hardwear.live</p>
    </div>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from,
        to: email,
        subject: `${otp} is your HardWear Verification Code`,
        html: htmlContent,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log(`[Resend] Email sent successfully to ${email}. ID: ${data.id}`);
    } else {
      console.error(`[Resend] Error sending email via Resend API:`, data);
      // Fallback log in case of API error
      console.log(`\n==========================================`);
      console.log(`[OTP Verification] Code for ${email} is: ${otp}`);
      console.log(`==========================================\n`);
    }
  } catch (error) {
    console.error(`[Resend] Fetch network error sending email to ${email}:`, error);
    // Fallback log in case of network error
    console.log(`\n==========================================`);
    console.log(`[OTP Verification] Code for ${email} is: ${otp}`);
    console.log(`==========================================\n`);
  }
};
