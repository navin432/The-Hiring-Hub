const mongoose = require('mongoose');

const availableTimeSchema = new mongoose.Schema({
    availableTime: {type: String, required: true},

    clientEmail: {type: String, required: true},

    message: {type: String,
              default: ''  //Alter it at your convenience
              },

     

    sentAt: {
        type: Date, // Time when the email was sent
        default: null
    },

    createdAt: {type: Date, default: Date.now}
});

const AvailableTime = mongoose.model('AvailableTime',availableTimeSchema);

module.exports = AvailableTime;
