import mongoose, { Document } from 'mongoose';
const { Schema } = mongoose;

interface ChatHistory extends Document {
    [x: string]: any;
    SessionId: any;
    History: any;
}

export default ChatHistory;
