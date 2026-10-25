import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Conversation from '../model/conversation.model.js';
import Message from '../model/message.model.js';
import User from '../model/user.model.js';

const run = async () => {
  await connectDB();

  const [a, b] = await User.find().limit(2).select('_id');
  if (!a || !b) throw new Error('Register two users first');

  const conversation = await Conversation.create({
    isGroup: false,
    participants: [a._id, b._id],
  });

  const docs = Array.from({ length: 50000 }, (_, i) => ({
    conversationId: conversation._id,
    sender: i % 2 === 0 ? a._id : b._id,
    text: `load test message ${i}`,
    createdAt: new Date(Date.now() - (50000 - i) * 1000),
  }));

  await Message.insertMany(docs);

  console.log('conversation:', conversation._id.toString());
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
