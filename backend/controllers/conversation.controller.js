import mongoose from 'mongoose';
import Conversation from '../model/conversation.model.js';
import User from '../model/user.model.js';
import { ApiError } from '../util/ApiError.js';
import { asyncHandler } from '../util/asyncHandler.js';

export const createConversation = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const me = req.user._id;

  if (!mongoose.isValidObjectId(userId)) {
    throw new ApiError('A valid userId is required', 400);
  }

  if (userId === me.toString()) {
    throw new ApiError('You cannot start a conversation with yourself', 400);
  }

  const other = await User.findById(userId).select('_id');
  if (!other) throw new ApiError('User not found', 404);

  const existing = await Conversation.findOne({
    isGroup: false,
    participants: { $all: [me, other._id], $size: 2 },
  }).populate('participants', 'username email lastSeen');

  if (existing) {
    return res.status(200).json({ conversation: existing });
  }

  const created = await Conversation.create({
    isGroup: false,
    participants: [me, other._id],
  });

  const conversation = await created.populate(
    'participants',
    'username email lastSeen'
  );

  res.status(201).json({ conversation });
});



export const getConversations = asyncHandler(async (req, res) => {
  const me = req.user._id;

  const conversations = await Conversation.find({ participants: me })
    .populate('participants', 'username email lastSeen')
    .populate({ path: 'lastMessage', select: 'text sender createdAt status' })
    .sort({ updatedAt: -1 })
    .lean();

  res.status(200).json({ conversations });
});
