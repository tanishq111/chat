import Conversation from '../model/conversation.model.js';
import Message from '../model/message.model.js';
import { ApiError } from '../util/ApiError.js';
import { asyncHandler } from '../util/asyncHandler.js';
import { findConversationForUser } from '../util/conversationAccess.js';
import { getIO } from '../socket/io.js';


export const getMessages = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const { before } = req.query;

  const requestedLimit = Number(req.query.limit ?? 20);
  if (!Number.isInteger(requestedLimit) || requestedLimit < 1) {
    throw new ApiError('Limit must be a positive integer', 400);
  }

  await findConversationForUser(conversationId, req.user._id);

  const limit = Math.min(requestedLimit, 50);

  const query = { conversationId };

  if (before) {
    const cursor = new Date(before);
    if (Number.isNaN(cursor.getTime())) {
      throw new ApiError('Invalid cursor', 400);
    }
    query.createdAt = { $lt: cursor };
  }

  // Over-fetch by one so hasMore needs no second count query.
  const messages = await Message.find(query)
    .populate('sender', 'username')
    .sort({ createdAt: -1 })
    .limit(limit + 1)
    .lean();

  const hasMore = messages.length > limit;
  const page = hasMore ? messages.slice(0, limit) : messages;

  res.status(200).json({
    messages: page.reverse(),
    hasMore,
    nextCursor: hasMore ? page[0].createdAt : null,
  });
});

export const createMessage = asyncHandler(async (req, res) => {
  const { conversationId, text } = req.body ?? {};

  if (typeof text !== 'string') {
    throw new ApiError('Message text must be a string', 400);
  }

  const trimmed = text.trim();
  if (!trimmed) throw new ApiError('Message text is required', 400);
  if (trimmed.length > 2000) throw new ApiError('Message is too long', 400);

  const conversation = await findConversationForUser(conversationId, req.user._id);

  const message = await Message.create({
    conversationId,
    sender: req.user._id,
    text: trimmed,
  });

  await Conversation.findByIdAndUpdate(conversationId, {
    lastMessage: message._id,
  });

  const populated = await message.populate('sender', 'username');
  const payload = populated.toObject();

  const io = getIO();
  io.to(`conv:${conversationId}`).emit('message:new', payload);

  // Reaches participants who are viewing a different chat, so their sidebar still updates.
  conversation.participants.forEach((participantId) => {
    io.to(`user:${participantId.toString()}`).emit('conversation:updated', {
      conversationId,
      lastMessage: payload,
    });
  });

  res.status(201).json({ message: payload });
});