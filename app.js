require('./mongodb');                      //Connects to DB
const express = require('express');
const app = express();
const uroute = require('./routes/UserRoute')
const mroute = require('./routes/MovieRoute')
const lroute = require('./routes/ListRoute')

app.use(express.json());                   //Formats the data in JSON format

app.use('/user', uroute.urouter);
app.use('/movie', mroute.mrouter);
app.use('/list', lroute.lrouter);

app.listen(6000, () => {
    console.log("The server is running at port 6000");
});