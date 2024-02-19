const mongoose = require('mongoose');

const pictureSchema = mongoose.Schema({
    quote: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true,
        unique: true
    },
    device: {
        type: String,
        required: true
    },
    commentsCount: {
        type: Number,
        default:0
    },
    userID : {
        type: Number,
        required: true
    },
   
}, {
    versionKey: false,
});

const PictureModel = mongoose.model('picturs', pictureSchema);

module.exports = {
    PictureModel
};
