import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  deliveredTo :{ type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] },
  status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' },/* this will come as a part of read receipts */
  text: { type: String, required: true },
}, { timestamps: true });

messageSchema.index({ conversationId: 1, createdAt: -1 });

const Message = mongoose.model('Message', messageSchema);
export default Message;