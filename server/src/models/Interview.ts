import mongoose, { Document } from 'mongoose';
const { Schema } = mongoose;
import Interview from "../schemas/InterviewType.js";

const interviewSchema = new Schema<Interview>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: false,
  },
  hr: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  candidate: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ["Scheduled", "Cancelled", "Completed", "Live", "Postponed", "Rescheduled"],
    default: "Scheduled",
  },
  topic: {
    type: Array,
    default: [],
    required: false
  },
  requiredSkills: {
      type: Array,
      default: [],
      required: false
  },
  penalty: {
    type: Number,
    required: false,
  },
});

const Interview = mongoose.model<Interview>('Interview', interviewSchema);

export default Interview;
