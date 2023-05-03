require('dotenv').config();
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
    const auth = req.headers['auth'];                //To get token from the authorization header
    //Gets the Second element i.e token from the params iff auth is present
    const token = auth && auth.split(' ')[1];
    if (token == null)
        return res.status(401).send("Token Not Sent");

    //To Verify entered token
    jwt.verify(token, process.env.KEY, (err, data) => {
        if (err) {
            console.log(err);
            return res.status(403).send({ success: false, msg: "Token Invalid" });
        }
        req.user = data;                        //Stores the payload (email, isAdmin & id) of Logged in user
        console.log(req.user);
        next();
    });
}
module.exports = auth;