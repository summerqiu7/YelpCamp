const mongoose = require ("mongoose");

const commentSchema = new mongoose.Schema({
    content:String,
    author:String
});
const Comment = mongoose.model("Comment",commentSchema);

module.exports = Comment;