import mongoose from 'mongoose';
const { Schema } = mongoose;

const interviewSchema = Schema({
    interViewId: {
      type: String,
      required: true,
      unique: true,
      default: () => uuidv4()
    },
    interviewTitle: {
      type: String,
      required: true
    },
    interviewDescription: {
      type: String,
      required: true
    },
    interviewStartTime: {
      type: Date,
      required: true
    },
    interviewEndTime: {
      type: Date,
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
    allowedUsers: {
      type: [Schema.Types.ObjectId],
      required: false
    },
    status: {
      type: String,
      enum: ["Scheduled", "Cancelled", "Completed", "Live", "Postponed", "Rescheduled"],
      default: "Scheduled"
    }
  });

export const Interview = mongoose.model('Interview', interviewSchema);

export function getInterviewById(id, callback) {
  Interview.findById(id, callback);
}

export function getInterviews(callback, limit) {
  Interview.find(callback).limit(limit);
}
export function addInterview(event, callback) {
  Interview.create(event, callback);
}

export function updateInterview(id, event, options, callback) {
    var query = { _id: id };
    var update = {
        eventTitle: event.eventTitle,
        eventDescription: event.eventDescription,
        eventPlace: event.eventPlace,
        eventDate: event.eventDate,
        eventCreateDate: event.eventCreateDate,
        startsAt: event.startsAt,
        endsAt: event.endsAt

    }
    Interview.findOneAndUpdate(query, update, options, callback);
}

export function removeInterview(id, callback) {
    var query = { _id: id };
    Interview.remove(query, callback);
}