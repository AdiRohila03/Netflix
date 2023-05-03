//MongoAtlas connection
require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.URL).then(() => {
    console.log("Conncted to DB");
}).catch((err) => {
    console.log("not conncted to db");
})
