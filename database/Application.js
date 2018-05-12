const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const applicationSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    class: { type: String, required: true },
    number: { type: String, required: true },
    position: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    application: { type: String, required: true },
    isSubmitted: { type: Boolean, default: false },
    clientIp: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);