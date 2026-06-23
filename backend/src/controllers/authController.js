import asyncHandler from 'express-async-handler';
import crypto from 'crypto';
import User from '../models/User.js';
import { signToken } from '../utils/token.js';
import TempUser from '../models/TempUser.js';
import { sendOTPEmail, sendPasswordResetEmail } from '../utils/email.js';

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).+$/;
  if (password.length < 6 || !passwordRegex.test(password)) {
    res.status(400);
    throw new Error('Password must be at least 6 characters long and contain both alphabets and numbers');
  }

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) {
    res.status(409);
    throw new Error('Email already in use');
  }

  // Generate 6-digit OTP
  const otp = String(Math.floor(100000 + Math.random() * 900000));

  // Overwrite any pre-existing temp registration for this email
  await TempUser.deleteMany({ email: email.toLowerCase() });

  // Save temporary user details
  await TempUser.create({
    name,
    email: email.toLowerCase(),
    password,
    otp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes TTL
  });

  // Send verification code email in the background (non-blocking)
  sendOTPEmail(email.toLowerCase(), otp).catch((err) => {
    console.error('Background sendOTPEmail error:', err);
  });

  res.status(201).json({
    message: 'OTP sent successfully',
    email: email.toLowerCase(),
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error('email and password are required');
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const token = signToken(user._id.toString());
  res.json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token,
  });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;

    if (req.body.email && req.body.email.toLowerCase() !== user.email) {
      res.status(400);
      throw new Error('Email address cannot be changed');
    }

    if (req.body.password) {
      const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).+$/;
      if (req.body.password.length < 6 || !passwordRegex.test(req.body.password)) {
        res.status(400);
        throw new Error('Password must be at least 6 characters long and contain both alphabets and numbers');
      }
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    const token = signToken(updatedUser._id.toString());

    res.json({
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
      token,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export const googleAuth = asyncHandler(async (req, res) => {
  const { credential } = req.body;
  if (!credential) {
    res.status(400);
    throw new Error('Credential token is required');
  }

  // Validate Google Credential token
  const googleResponse = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
  if (!googleResponse.ok) {
    res.status(400);
    throw new Error('Invalid Google credential token');
  }

  const payload = await googleResponse.json();
  const { email, name } = payload;
  if (!email) {
    res.status(400);
    throw new Error('Google credential does not contain email');
  }

  let user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    const randomPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
    user = await User.create({
      name: name || 'Google User',
      email: email.toLowerCase(),
      password: randomPassword,
    });
  }

  const token = signToken(user._id.toString());
  res.json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token,
  });
});

export const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    res.status(400);
    throw new Error('email and otp are required');
  }

  const tempUser = await TempUser.findOne({
    email: email.toLowerCase(),
    otp: otp.trim(),
  });

  if (!tempUser) {
    res.status(400);
    throw new Error('Invalid or expired OTP');
  }

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) {
    res.status(409);
    throw new Error('Email already in use');
  }

  // Create actual user (pre-save hook in User model handles bcrypt hashing)
  const user = await User.create({
    name: tempUser.name,
    email: tempUser.email,
    password: tempUser.password,
  });

  // Remove the temp user record
  await TempUser.deleteOne({ _id: tempUser._id });

  const token = signToken(user._id.toString());

  res.status(201).json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token,
  });
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  res.json({ users });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400);
    throw new Error('Email is required');
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(200).json({
      message: 'If the email is registered on our site, a password reset link has been dispatched.',
    });
  }

  // Generate reset token
  const token = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiry
  await user.save();

  // Construct reset link
  const origin = req.headers.origin || process.env.FRONTEND_URL || 'http://localhost:5173';
  const cleanOrigin = origin.replace(/\/$/, '');
  const resetLink = `${cleanOrigin}/reset-password?token=${token}`;

  // Send email
  await sendPasswordResetEmail(user.email, resetLink);

  res.status(200).json({
    message: 'If the email is registered on our site, a password reset link has been dispatched.',
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    res.status(400);
    throw new Error('Token and password are required');
  }

  // Validate password strength (min 6 characters, must contain letters and numbers)
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).+$/;
  if (password.length < 6 || !passwordRegex.test(password)) {
    res.status(400);
    throw new Error('Password must be at least 6 characters long and contain both alphabets and numbers');
  }

  // Find user with matching token and unexpired date
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error('Password reset token is invalid or has expired.');
  }

  // Update password (User model pre-save hook will hash it)
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.status(200).json({
    message: 'Your password has been successfully updated.',
  });
});



