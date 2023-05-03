const mongoose = require('mongoose');

const ListSchema = new mongoose.Schema({
    title: {                  //Continue watching/Hindi/English...
        type: String,
        unique: true,
        required: true
    },
    type: { type: String },  //Movie/Series 
    genre: { type: String },
    content: { type: Array }  //List of movies(movie_id) in a particular title
}, { timestamps: true });

const listschema = mongoose.model("List", ListSchema);
module.exports = listschema;