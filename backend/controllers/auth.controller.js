import User from '../model/user.model.js';
import { ApiError } from '../util/ApiError.js';
import { asyncHandler } from '../util/asyncHandler.js';
import {
  issueToken,
  issueRefreshToken,
  verifyRefreshToken,
  setAuthCookies,
  clearAuthCookies,
} from '../util/token.js';

export const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) {
    const field = existing.email === email ? 'email' : 'username';
    throw new ApiError(`That ${field} is already registered`, 409);
  }

  const user = await User.create({ username, email, password });

  setAuthCookies(res, issueToken(user), issueRefreshToken(user));

  res.status(201).json({
    success: true,
    message: 'Account created',
    user: user.toPublicJSON(),
  });
});

export const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError('Invalid username or password', 401);
  }

  user.lastSeen = new Date();
  await user.save({ validateBeforeSave: false });

  setAuthCookies(res, issueToken(user), issueRefreshToken(user));

  res.status(200).json({
    success: true,
    message: 'Logged in',
    user: user.toPublicJSON(),
  });
});

export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, user: req.user.toPublicJSON() });
});

export const logout = asyncHandler(async (req, res) => {
  clearAuthCookies(res);
  res.status(200).json({ success: true, message: 'Logged out' });
});

export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) throw new ApiError('No refresh token', 401);

  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch {
    clearAuthCookies(res);
    throw new ApiError('Session expired, please log in again', 401);
  }

  const user = await User.findById(payload.id);
  if (!user) {
    clearAuthCookies(res);
    throw new ApiError('User no longer exists', 401);
  }

  // Rotation: a new refresh token is issued on every refresh.
  setAuthCookies(res, issueToken(user), issueRefreshToken(user));

  res.status(200).json({ success: true, message: 'Token refreshed' });
});
