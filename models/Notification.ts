import mongoose from 'mongoose';
const { Schema } = mongoose;

const notificationSchema = new Schema({
    labId: { type: String, required: true },
    type: { type: String, required: true },
    resourceId: { type: String, required: true },
    recipients: [
        {
            role: {
                type: [String],
                enum: ["PI", "LAB_MANAGER", "RESEARCHER"],
                required: true
            },
            type: [String],
        }
    ],
    createdAt: { type: Date, required: true, default: Date.now }
});

const Notification = mongoose.models.Notification || 
    mongoose.model('Notification', notificationSchema);

export default Notification;