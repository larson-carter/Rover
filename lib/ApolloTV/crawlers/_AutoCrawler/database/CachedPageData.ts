import Mongoose from "mongoose";

export const PageIndexSchema = new Mongoose.Schema({
    url: String,
    expiry: {
        type: Date,
        expires: 0,
        default: '1h'
    }
});

export const PageIndex = Mongoose.model('indexedPage', PageIndexSchema);