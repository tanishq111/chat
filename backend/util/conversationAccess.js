import mongoose from 'mongoose';
import Conversation from '../model/conversation.model.js';
import { ApiError } from './ApiError.js';

export const findConversationForUser = async (conversationId, userId) => {
  if (!mongoose.isValidObjectId(conversationId)) {
    throw new ApiError('Invalid conversation id', 400);
  }

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) throw new ApiError('Conversation not found', 404);

  const isParticipant = conversation.participants.some((participant) =>
    participant.equals(userId)
  );
  if (!isParticipant) {
    throw new ApiError('You are not a participant in this conversation', 403);
  }

  return conversation;
};