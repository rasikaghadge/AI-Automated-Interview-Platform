import mongoose from 'mongoose';
const { Schema } = mongoose;

const eventSchema = Schema({
    eventTitle: {
      type: String,
      required: true
    },
    eventDescription: {
      type: String,
      required: true
    },
    eventStartTime: {
      type: Date,
      required: true
    },
    eventEndTime: {
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
    staus: {
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
  
export const Meeting = mongoose.model('Meeting', eventSchema);

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

export function getEventById(id, callback) {
    Meeting.findById(id, callback);
}

export function getEvents(callback, limit) {
    Meeting.find(callback).limit(limit);
}
export function addEvent(event, callback) {
    Meeting.create(event, callback);
}

export function updateEvent(id, event, options, callback) {
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
    Meeting.findOneAndUpdate(query, update, options, callback);
}

export function removeEvent(id, callback) {
    var query = { _id: id };
    Meeting.remove(query, callback);
}