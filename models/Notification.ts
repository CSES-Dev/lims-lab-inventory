import mongoose from 'mongoose';
const { Schema } = mongoose;

const notificationSchema = new Schema({
    labId: { type: String, required: true },
    type: { type: String, required: true },
    resourceId: { type: String, required: true },
    recipients: {
        type: [String],
        roles: { type: String },
        required: true
    },
    createdAt: { type: Date, required: true, default: Date.now }
});

const Notification = mongoose.models.Notification || 
    mongoose.model('Notification', notificationSchema);

export default Notification;