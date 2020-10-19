const mongoose = require('mongoose');
const ProfileSchema = new mongoose.Schema({
    source: {
        type: String,
        required: true
    },
    target: {
        type: String,
        required: false,
    },
    attributes: [{
        type: String,
        required: false,
    }],
    sourceIpAddress: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    }
});
const Profile = mongoose.model('Profile', ProfileSchema);

module.exports = Profile;
