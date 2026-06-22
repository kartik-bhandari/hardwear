import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import { signToken } from '../utils/token.js';
import TempUser from '../models/TempUser.js';
import { sendOTPEmail } from '../utils/email.js';

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('name, email, password are required');
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
      const emailExists = await User.findOne({ email: req.body.email.toLowerCase() });
      if (emailExists) {
        res.status(400);
        throw new Error('Email already in use');
      }
      user.email = req.body.email.toLowerCase();
    }

    if (req.body.password) {
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


