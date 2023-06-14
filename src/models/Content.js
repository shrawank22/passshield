const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    website: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    owner: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }, 
        username: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    iv: {
        type: String
    }
});


module.exports = mongoose.model("Content", contentSchema);