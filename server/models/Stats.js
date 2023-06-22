import mongoose from 'mongoose';

const statSchema = new mongoose.Schema({

    users: {
        type: Number,
        default: 0,
    },
    subscriptions: {
        type: Number,
        default: 0,
    },
    views: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

});

export const Stats = mongoose.model('Stats', statSchema);