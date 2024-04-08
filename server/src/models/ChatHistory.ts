import mongoose, { Document } from 'mongoose';
const { Schema } = mongoose;
import ChatHistory from "../schemas/ChatHistory.js";

const ChatHistorySchema = new Schema<ChatHistory>({
    SessionId: {
        type: String,
        required: true
    },
    History: {
        type: Array,
        required: true
    }
});

const ChatHistory = mongoose.model<ChatHistory>('chat_histories', ChatHistorySchema);

export default ChatHistory;
