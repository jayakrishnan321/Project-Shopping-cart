const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    phone: String,
    password: String,
    image: {
        type: String,
        default: "",
        required: false,
    },
    status: { type: String, default: '' },
    district: { type: String, default: '' },
    place: { type: String, default: '' },

    // New field for pending updates
    pendingDetails: {
        district: { type: String, default: '' },
        place: { type: String, default: '' }
    },

    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Supplier", supplierSchema);
