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

export const sendOrderConfirmationEmail = async (email, order) => {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM || 'onboarding@resend.dev';

  const orderItemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 10px 0; border-bottom: 1px solid #1e1e1e;">
        <span style="font-weight: bold; color: #f0ede6;">${item.name}</span>
        <br/>
        <span style="font-size: 11px; color: #9d9d9d;">Size: ${item.size} | Color: ${item.color} | Qty: ${item.qty}</span>
      </td>
      <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #f0ede6; border-bottom: 1px solid #1e1e1e;">
        ₹${(item.price * item.qty).toLocaleString('en-IN')}
      </td>
    </tr>
  `).join('');

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #1e1e1e; background-color: #0c0c0c; color: #f0ede6;">
      <h2 style="color: #3b127c; font-family: 'Arial Black', Gadget, sans-serif; text-transform: uppercase; letter-spacing: 2px; border-bottom: 2px solid #1e1e1e; padding-bottom: 10px; margin-bottom: 15px;">HARDWEAR</h2>
      <h3 style="color: #f0ede6; font-family: Arial, sans-serif; text-transform: uppercase; font-size: 16px; letter-spacing: 1px;">Order Confirmed ///</h3>
      <p style="font-size: 14px; line-height: 1.5; color: #9d9d9d;">Thank you for your order! Your payment has been successfully processed.</p>
      
      <div style="background-color: #111; border: 1px solid #1e1e1e; padding: 15px; margin: 20px 0;">
        <p style="margin: 0 0 5px 0; font-size: 11px; color: #696969; font-weight: bold; text-transform: uppercase;">Order Number</p>
        <p style="margin: 0 0 15px 0; font-size: 14px; font-weight: bold; color: #f0ede6;">#${order._id.toString().toUpperCase()}</p>
        
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <thead>
            <tr style="border-bottom: 1px solid #1e1e1e; color: #696969; font-size: 10px; text-transform: uppercase; text-align: left;">
              <th style="padding-bottom: 8px;">Item</th>
              <th style="padding-bottom: 8px; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${orderItemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td style="padding: 10px 0 5px 0; color: #9d9d9d;">Subtotal:</td>
              <td style="padding: 10px 0 5px 0; text-align: right; color: #f0ede6;">₹${order.subtotal.toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: #9d9d9d;">Shipping:</td>
              <td style="padding: 5px 0; text-align: right; color: #f0ede6;">₹${order.shipping.toLocaleString('en-IN')}</td>
            </tr>
            <tr style="font-size: 15px; font-weight: bold;">
              <td style="padding: 15px 0 5px 0; color: #f0ede6; border-top: 1px solid #1e1e1e;">Grand Total:</td>
              <td style="padding: 15px 0 5px 0; text-align: right; color: #f0ede6; border-top: 1px solid #1e1e1e;">₹${order.total.toLocaleString('en-IN')}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div style="background-color: #111; border: 1px solid #1e1e1e; padding: 15px; margin: 20px 0; font-size: 13px;">
        <p style="margin: 0 0 5px 0; font-size: 11px; color: #696969; font-weight: bold; text-transform: uppercase;">Shipping Address</p>
        <p style="margin: 0; color: #f0ede6; line-height: 1.4;">
          <strong>${order.shippingAddress.fullName}</strong><br/>
          ${order.shippingAddress.line1}<br/>
          ${order.shippingAddress.line2 ? order.shippingAddress.line2 + '<br/>' : ''}
          ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.postalCode}<br/>
          Phone: ${order.shippingAddress.phone}
        </p>
      </div>

      <hr style="border: 0; border-top: 1px solid #1e1e1e; margin: 25px 0;" />
      <p style="font-size: 10px; color: #696969; text-align: center; text-transform: uppercase; letter-spacing: 1px;">www.hardwear.live</p>
    </div>
  `;

  if (!apiKey) {
    console.warn('[Resend] API Key not configured. Order confirmation email simulated in console.');
    console.log(`\n==========================================`);
    console.log(`[Order Confirmation] Email to ${email} for Order #${order._id}`);
    console.log(`==========================================\n`);
    return;
  }

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
        subject: `Your HardWear Order #${order._id.toString().slice(-6).toUpperCase()} is Confirmed`,
        html: htmlContent,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log(`[Resend] Order confirmation email sent successfully to ${email}. ID: ${data.id}`);
    } else {
      console.error(`[Resend] Error sending order confirmation email:`, data);
    }
  } catch (error) {
    console.error(`[Resend] Fetch network error sending order confirmation email:`, error);
  }
};

export const sendPasswordResetEmail = async (email, resetLink) => {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM || 'onboarding@resend.dev';

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #1e1e1e; background-color: #0c0c0c; color: #f0ede6;">
      <h2 style="color: #3b127c; font-family: 'Arial Black', Gadget, sans-serif; text-transform: uppercase; letter-spacing: 2px; border-bottom: 2px solid #1e1e1e; padding-bottom: 10px; margin-bottom: 15px;">HARDWEAR</h2>
      <h3 style="color: #f0ede6; font-family: Arial, sans-serif; text-transform: uppercase; font-size: 16px; letter-spacing: 1px;">Reset Your Password ///</h3>
      <p style="font-size: 14px; line-height: 1.5; color: #9d9d9d;">We received a request to reset your account password. Click the button below to choose a new password.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" style="background-color: #ff3c00; color: #ffffff; text-decoration: none; font-weight: bold; text-transform: uppercase; padding: 12px 24px; border: 1px solid #ff3c00; font-size: 13px; letter-spacing: 2px; display: inline-block;">
          Reset Password
        </a>
      </div>

      <p style="font-size: 12px; color: #696969; line-height: 1.5;">This link is valid for 1 hour. If you did not request a password reset, please ignore this email.</p>
      <p style="font-size: 12px; color: #696969; line-height: 1.5; margin-top: 10px;">If the button above does not work, copy and paste the link below into your browser:</p>
      <p style="font-size: 12px; color: #ff3c00; word-break: break-all;">${resetLink}</p>
      
      <hr style="border: 0; border-top: 1px solid #1e1e1e; margin: 25px 0;" />
      <p style="font-size: 10px; color: #696969; text-align: center; text-transform: uppercase; letter-spacing: 1px;">www.hardwear.live</p>
    </div>
  `;

  if (!apiKey) {
    console.warn('[Resend] API Key not configured. Password reset link simulated in console.');
    console.log(`\n==========================================`);
    console.log(`[Password Reset] Link for ${email} is: ${resetLink}`);
    console.log(`==========================================\n`);
    return;
  }

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
        subject: `Reset your HardWear password`,
        html: htmlContent,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log(`[Resend] Password reset email sent successfully to ${email}. ID: ${data.id}`);
    } else {
      console.error(`[Resend] Error sending password reset email:`, data);
    }
  } catch (error) {
    console.error(`[Resend] Fetch network error sending password reset email:`, error);
  }
};
