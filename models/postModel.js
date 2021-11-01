const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        require: [true, "Post Title is required"]
    },
    body: {
        type: String,
        require: [true, "Post body is required"]

    }
});
const Post = mongoose.model("Post", postSchema);
module.exports = Post