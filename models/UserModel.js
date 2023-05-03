const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({        //Creates User Schema
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is Invalid!");
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: [8, 'Password must be 8 characters or more']
    },
    mob: {
        type: String,
        required: true,
        minlength: [10, 'Mobile no must 10 digits or more'],
        maxlength: 15
    },
    pf: {
        type: String,
        default: ""
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

//Pass Encryption
//Mongoose 'pre' Middleware operates before the data is saved to DB
UserSchema.pre('save', async function (next) {              //cannot use arrow func. since this keyword is used
    try {
        // higher the salt_num, the longer it will take a machine to calculate the hash associated with the password default is 10
        this.password = await bcrypt.hash(this.password, 10);
        next();             //This tells Mongoose to end the middleware and move on to the next step in the process.
    } catch (err) {
        next(err);
    }
});

const userschema = mongoose.model("User", UserSchema);
module.exports = userschema;