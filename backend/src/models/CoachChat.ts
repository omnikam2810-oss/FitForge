import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage {
  _id?: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  content?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'workout_summary';
  readAt?: Date;
  sentAt: Date;
}

export interface ICoachChat extends Document {
  userId: mongoose.Types.ObjectId;
  coachId: mongoose.Types.ObjectId;
  messages: IMessage[];
  lastMessageAt?: Date;
  unreadByUser: number;
  unreadByCoach: number;
  isActive: boolean;
}

const MessageSchema = new Schema<IMessage>({
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String },
  mediaUrl: { type: String },
  mediaType: { type: String, enum: ['image', 'video', 'workout_summary'] },
  readAt: { type: Date },
  sentAt: { type: Date, default: Date.now }
});

const CoachChatSchema = new Schema<ICoachChat>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  coachId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  messages: [MessageSchema],
  lastMessageAt: { type: Date },
  unreadByUser: { type: Number, default: 0 },
  unreadByCoach: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const CoachChat = mongoose.model<ICoachChat>('CoachChat', CoachChatSchema);
