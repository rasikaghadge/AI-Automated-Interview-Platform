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
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
        required: true
      },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    allowedUsers: {
      type: Array,
      required: false
    }
  });

  export const Meeting = mongoose.model('Meeting', eventSchema);

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