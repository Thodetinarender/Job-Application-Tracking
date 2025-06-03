const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReminderSchema = new Schema({
  reminderDate: { type: Date, required: true },
  applicationId: { type: Schema.Types.ObjectId, ref: 'Application', required: true },
  userId: { type: String, required: true }
});

// Static: Create a reminder
ReminderSchema.statics.createReminder = function(data) {
  return this.create(data);
};

// Static: Find all reminders for a user
ReminderSchema.statics.findByUser = function(userId) {
  return this.find({ userId });
};

// Static: Find reminder by ID
ReminderSchema.statics.findByReminderId = function(id) {
  return this.findById(id);
};

// Static: Delete reminder by ID
ReminderSchema.statics.deleteById = function(id) {
  return this.findByIdAndDelete(id);
};

module.exports = mongoose.model('Reminder', ReminderSchema);