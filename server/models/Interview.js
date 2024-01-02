import mongoose from 'mongoose';
const { Schema } = mongoose;

const interviewSchema = Schema({
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: false
    },
    hr: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ["Scheduled", "Cancelled", "Completed", "Live", "Postponed", "Rescheduled"],
      default: "Scheduled"
    },
    room: {
      type: Object,
      required: false
    }
  });


const Interview = mongoose.model('Interview', interviewSchema);

export default Interview;
