const mongoose = require('mongoose');

const blacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: [true, 'Token is required'],
    unique: true
  },  
},{
    timestamps: true
});

const tokenBlacklistModel = mongoose.model('Blacklist', blacklistSchema);

module.exports = tokenBlacklistModel;