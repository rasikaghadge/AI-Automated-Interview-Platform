import mongoose from 'mongoose';
const { Schema } = mongoose;

const interviewSchema = Schema({
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

  const applicationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    jobTitle: String,
    company: String,  
    status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
    // Add other application-specific fields as needed
  });
  
export const Application = mongoose.model('Application', applicationSchema);
  
export const Interview = mongoose.model('Interview', interviewSchema);

export function getApplicationStatus(id, callback) {
    Application.findById(id, callback);
}

export function getApplications(callback, limit) {
    Application.find(callback).limit(limit);
}

export function addApplication(application, callback) {
    Application.create(application, callback);
}

export function updateApplication(id, application, options, callback) {
    var query = { _id: id };
    var update = {
        user: application.user,
        jobTitle: application.jobTitle,
        company: application.company,
        status: application.status
    }
    Application.findOneAndUpdate(query, update, options, callback);
}

export function removeApplication(id, callback) {
    var query = { _id: id };
    Application.remove(query, callback);
}

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