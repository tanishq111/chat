import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
  isGroup: { type: Boolean, default: false },
  name: { type: String },
  /* ever growing list of messages in the conversation */
  /* messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],*/
}, { timestamps: true });


conversationSchema.index({ participants: 1, createdAt: -1 });

const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;