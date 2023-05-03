const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: true
    },
    desc: { type: String },
    img: { type: String },
    imgTitle: { type: String },  //Movie title
    imgSmall: { type: String },  //Thumbnail
    trailer: { type: String },
    video: { type: String },
    year: { type: String },
    ageLimit: { type: Number },
    genre: { type: String },
    isSeries: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const movieschema = mongoose.model("Movie", MovieSchema);
module.exports = movieschema;