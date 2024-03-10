const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userID : String,
    email: String,
    displayName: String,
    credits : Number,
});
module.exports = mongoose.model("User", userSchema);