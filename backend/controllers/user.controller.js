import User from '../model/user.model.js';
import {asyncHandler} from '../util/asyncHandler.js';


const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const searchUsers = asyncHandler(async (req, res) => {
  const search = (req.query.search || '').trim();

  if (search.length < 2) {
    return res.status(200).json({ users: [] });
  }

  const pattern = new RegExp(escapeRegex(search), 'i');

  const users = await User.find({
    _id: { $ne: req.user._id },
    $or: [{ username: pattern }, { email: pattern }],
  })
    .select('username email lastSeen')
    .limit(10)
    .lean();

  res.status(200).json({ users });
});