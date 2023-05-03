const userschema = require('../models/UserModel');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//REGISTRATION
const reg = async (req, res) => {
    const data = new userschema(req.body);
    await data.save().then(() =>
        res.status(201).send({ message: "Registration Successful" })
    ).catch((err) => {
        res.status(500).json({ message: err })
    });
}

//LOGIN
//Authentication via email paired with password
const login = async (req, res) => {
    try {
        //Checks if the entered email is present, if true saves user details in 'data'
        const data = await userschema.findOne({ email: req.body.email });
        if (data) {
            //Checks if the password enterd is correct
            const pass = await bcrypt.compare(req.body.password, data.password);
            if (pass) {
                try {
                    const tokendata = jwt.sign(
                        { email: data.email, isAdmin: data.isAdmin, id: data._id },  //Creates JWT Token using email, isAdmin & user_id as payload
                        process.env.KEY,
                        { expiresIn: "2d" });
                    res.status(200).send({ success: true, messsage: "Succesfully Logged In & Token generated: ", token: tokendata });
                } catch (err) {
                    res.status(400).json(err);
                }
            }
            else {
                res.status(401).send({ success: false, msg: "Login details are Incorrect!" });
            }

        } else {
            res.status(401).send({ success: false, msg: "Login details are Incorrect!!" });

        }

    } catch (err) {
        res.status(400).json(err);
    }
}

//UPDATE
const update = async (req, res) => {
    if (req.user.id === req.params._id || req.user.isAdmin) {
        if (req.body.password) {                                                //If pass is updated it needs to be hashed again
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }
        try {
            let data = await userschema.findByIdAndUpdate(req.params,      //Condition for update
                {
                    $set: req.body                                 //Updated Value
                },
                { new: true }             // To display updated value on postman instantly
            );
            res.status(200).send(data);
        } catch (err) {
            res.status(500).json(err);
            console.log(err.message);
        }
    } else {
        res.status(403).json("Allowed to update only your account ")
    }
}

//DELETE
const remove = async (req, res) => {
    if (req.user.id === req.params._id || req.user.isAdmin) {
        try {
            let data = await userschema.findByIdAndDelete(req.params);
            if (data)
                res.status(200).json("User Deleted");
            else
                res.send("Id Not Found")
        } catch (err) {
            res.send("Id Not Found");
            console.log(err.message);
        };
    } else {
        res.status(403).json("Allowed to delete only your account ")
    }
}

//GET  
const get = async (req, res) => {
    try {
        let user = await userschema.findById(req.params);
        const { password, ...info } = user._doc;    //Ignores pass while displaying user details
        res.status(200).send(info);
    } catch (err) {
        res.status(500).json(err);
    };
}

//GET ALL 
const user = async (req, res) => {
    const query = req.query.new;
    if (req.user.isAdmin) {
        try {
            let users = query ? await userschema.find().sort({ _id: -1 }).limit(2) : await userschema.find();
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json(err);
        };
    } else {
        res.status(403).json("Not allowed to see all users");
    }
}

//GET STATS
const stats = async (req, res) => {
    try {
        const data = await userschema.aggregate([
            {
                $project: {                         //Projects the month & year field from the createdAt field of each document.
                    year: { $year: "$createdAt" }, // Extract year from createdAt field
                    month: { $month: "$createdAt" } // Return 1 for Jan, 2 for Feb, ...
                }
            }, {
                $group: {                //Groups the doc by year & month
                    _id: { year: "$year", month: "$month" }, // Group by year and month
                    total: { $sum: 1 } // Returns total users per month
                }
            },
            {
                $project: {
                    _id: 0,               // Specifies to exclude the _id field from the output
                    year: "$_id.year",    // Extracts the year field from the _id field and renames it as year.
                    month: "$_id.month",
                    total: 1              // Specifies to include the total field in the output.
                }
            }
        ]);
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports = { reg, login, update, get, remove, user, stats }