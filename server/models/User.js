const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    role: { type: String, enum: ["Doctor","Patient"], required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
}, {timestamps: true});

module.exports = mongoose.model('User', userSchema);
