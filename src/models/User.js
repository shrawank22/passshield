const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");


var userSchema = new mongoose.Schema({
	name: {type: String, required: true},
    email: {type: String, unique: true, required: true},
	username: {type: String, unique: true, required: true},
	password: String,
	resetPasswordToken: String,
    resetPasswordExpires: Date,
	privateKey: {
        type: String,
        required: true
    },
    iv: {
        type: String
    }
});

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", userSchema);