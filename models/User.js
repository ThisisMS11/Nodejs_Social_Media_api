const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        maxlength: [50, 'Name can not have more than 50 characters']
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        minlength: [6, 'password cannot be shorted than 6 words'],
        select: false // to avoid password to come along with our query results.
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    followers: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Users'

    }],
    following: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Users'
    }],
    verificationToken: String,
    verificationTokenExpire: Date,

    createdAt: {
        type: Date,
        default: Date.now
    }
})

/*to check whether user input password matches with that of database one or not. */
UserSchema.methods.matchpassword = async function (password) {
    const result = await bcrypt.compare(password, this.password);
    return result;
}

UserSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id, password: this.password }, process.env.JWT_SECRET);
}

/* To Generate a Random  Verfication Token to further create a url */
UserSchema.methods.getVerficationtoken = function () {
    const verificationToken = crypto.randomBytes(20).toString('hex');

    // Setting the verificationToken and VerificaitionTokenExpire here
    this.verificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
    const noOfMinutes = 0.5;
    this.verificationTokenExpire = Date.now() + noOfMinutes * 60 * 1000;
    return verificationToken;
}


module.exports = mongoose.model('Users', UserSchema);
